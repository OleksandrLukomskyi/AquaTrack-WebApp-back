// src/services/jwtService.js
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const {
  ACCESS_SECRET,
  REFRESH_SECRET,
  JWT_ACC_EXPIRES_IN,
  JWT_REF_EXPIRES_IN,
} = process.env;

export const createAccessToken = (id) =>
  jwt.sign({ id }, ACCESS_SECRET, {
    expiresIn: JWT_ACC_EXPIRES_IN,
  });

export const createRefreshToken = (id) =>
  jwt.sign({ id }, REFRESH_SECRET, {
    expiresIn: JWT_REF_EXPIRES_IN,
  });

export const tokenValidation = (accessToken) => {
  if (!accessToken) throw createHttpError(401, 'Токен доступу відсутній');

  try {
    console.log('Trying to verify access token:', accessToken);
    const { id } = jwt.verify(accessToken, ACCESS_SECRET);
    console.log('Access token verified. User ID:', id);
    return id;
  } catch (err) {
    console.error('Error verifying access token:', err);
    throw createHttpError(401, `Недійсний токен доступу: ${err.message}`);
  }
};

export const refreshTokenValidation = (refreshToken) => {
  if (!refreshToken) throw createHttpError(403, 'Токен оновлення відсутній');

  try {
    console.log('Trying to verify refresh token:', refreshToken);
    const { id } = jwt.verify(refreshToken, REFRESH_SECRET);
    console.log('Refresh token verified. User ID:', id);
    return id;
  } catch (err) {
    console.error('Error verifying refresh token:', err);
    throw createHttpError(403, `Недійсний токен оновлення: ${err.message}`);
  }
};
