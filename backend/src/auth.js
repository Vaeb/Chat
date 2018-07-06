// Vaeb note: auth.js methods sourced from graphql github example

import jwt from 'jsonwebtoken';
import pick from 'lodash/pick';
import bcrypt from 'bcryptjs';
import request from 'request-promise-native';

const CLIENT_ID = 'localhost';
const CLIENT_SECRET = 'notReallySecret';

export const createTokens = async (user, secret, secret2) => {
    const createToken = jwt.sign(
        // normal token for sensitive information or information that might change
        {
            user: pick(user, ['id', 'username']), // id and other fields wanted
        },
        secret,
        {
            expiresIn: '1h', // how long the fields above will stay cached for the user (e.g. 1m)
        },
    );

    const createRefreshToken = jwt.sign(
        // refresh token used for general information to identify the user when the normal token expires and it needs to generate a new one
        {
            user: pick(user, 'id'),
        },
        secret2,
        {
            expiresIn: '7d',
        },
    );

    return [createToken, createRefreshToken];
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
    let userId = 0;
    try {
        const {
            user: { id },
        } = jwt.decode(refreshToken);
        userId = id;
    } catch (err) {
        return {};
    }

    if (!userId) {
        return {};
    }

    const user = await models.User.findOne({ where: { id: userId }, raw: true });

    if (!user) {
        return {};
    }

    const refreshTokenSecret = user.password + SECRET2;

    try {
        jwt.verify(refreshToken, refreshTokenSecret);
    } catch (err) {
        return {};
    }

    const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

    return {
        token: newToken,
        refreshToken: newRefreshToken,
        user,
    };
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const tryLoginCheck = async (userVal, userValType, password, models) => {
    const user = await models.User.findOne({ where: { [userValType]: userVal }, raw: true });
    if (!user) {
        return {
            ok: false,
            errors: [{ path: 'email', message: 'Invalid username or email' }],
        };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        // bad password
        return {
            ok: false,
            errors: [{ path: 'password', message: 'Invalid password' }],
        };
    }

    return {
        ok: true,
        user,
    };
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
    let user;

    const loginSuccess1 = await tryLoginCheck(email, 'username', password, models);

    if (!loginSuccess1.ok) {
        const loginSuccess2 = await tryLoginCheck(email, 'email', password, models);

        if (!loginSuccess2.ok) {
            const loginReturn = loginSuccess1.errors[0].message === 'Invalid password' ? loginSuccess1 : loginSuccess2;
            return loginReturn;
        }

        ({ user } = loginSuccess2);
    } else {
        ({ user } = loginSuccess1);
    }

    const refreshTokenSecret = user.password + SECRET2;

    const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

    return {
        ok: true,
        token,
        refreshToken,
    };
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const doAuth = async (path, json, bearer) => {
    let body;

    try {
        body = await request[typeof json === 'object' ? 'post' : 'get'](`https://api.vashta.io/auth/${path}`, {
            json,
            auth: bearer && { bearer },
        });
    } catch (err) {
        const out = 'Vashta email or password incorrect - Remember that these should be the details you use for the dashboard login';
        throw new Error(out);
    }

    if (!body) throw new Error('No body');
    if (body.error) throw new Error(body.error === 'invalid_grant' ? 'Invalid credentials' : body.error_description);

    return body;
};

export const tryVashtaAuth = async (email, password) => {
    try {
        console.log('vashta auth request');
        const token = (await doAuth('token', {
            username: email,
            password,
            grant_type: 'password',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        })).access_token;
        if (!token) throw new Error('Wrong email/password');
        console.log('got vashta token');
        const user = await doAuth('user/@me', true, token);
        console.log('got vashta user');
        user.email = email;
        user.token = token;
        if (user && user.username) return user;
        throw new Error("Couldn't fetch user data");
    } catch (err) {
        throw err;
    }
};

let cachedToken = null;
const getClientToken = async () => {
    if (cachedToken) return cachedToken;
    const result = await doAuth('token', {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
    });
    if (!result) throw new Error('No data received');
    if (result.token_type !== 'Bearer') throw new Error("Expected token_type to be 'Bearer'");
    if (result.token_type !== 'Bearer') throw new Error("No 'access_token' field in returned data");
    cachedToken = result.access_token;
    return cachedToken;
};

export const fetchUserProfile = async (userId) => {
    const clientToken = await getClientToken();
    const result = await doAuth(`user/${userId}`, undefined, clientToken);
    return result;
};
