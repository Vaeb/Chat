// Vaeb note: auth.js methods sourced from graphql github example

import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
    const createToken = jwt.sign(
        // normal token for sensitive information or information that might change
        {
            user: _.pick(user, ['id']), // id and other fields wanted
        },
        secret,
        {
            expiresIn: '1h', // how long the fields above will stay cached for the user (e.g. 1m)
        },
    );

    const createRefreshToken = jwt.sign(
        // refresh token used for general information to identify the user when the normal token expires and it needs to generate a new one
        {
            user: _.pick(user, 'id'),
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

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
    const user = await models.User.findOne({ where: { email }, raw: true });
    if (!user) {
        // user with provided email not found
        return {
            ok: false,
            errors: [{ path: 'email', message: 'Invalid email' }],
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

    const refreshTokenSecret = user.password + SECRET2;

    const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

    return {
        ok: true,
        token,
        refreshToken,
    };
};
