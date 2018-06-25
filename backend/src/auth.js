// Vaeb note: auth.js methods sourced from graphql github example

import jwt from 'jsonwebtoken';
import pick from 'lodash/pick';
import bcrypt from 'bcryptjs';

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
