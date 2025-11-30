import {
  registerUserService,
  loginUserService,
  resetPassword,
  sendResetPasswordEmail,
  loginOrSignupWithGoogleOAuth,
} from '../services/authServices.js';
import { generateOAuthURL } from '../utils/googleOAuth.js';
import { REFRESH_TOKEN_LIFE_TIME } from '../constants/constants.js';
import { validateGoogleOAuthSchema } from '../validation/validateGoogleOAuth.js';
import User from '../db/models/User.js';
import createHttpError from 'http-errors';

const setupSession = (res, session) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: isProduction,
    sameSite: !isProduction ? 'Lax' : 'None',
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFE_TIME),
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: !isProduction ? 'Lax' : 'None',
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFE_TIME),
  });
};

export const getTotalUsers = async (req, res) => {
  try {
    // Підрахунок загальної кількості користувачів у базі даних
    const totalUsers = await User.countDocuments();

    // Отримання списку користувачів з полями _id та name
    const users = await User.find({}, '_id name');

    // Відправка відповіді з кількістю користувачів та списком користувачів
    res.status(200).json({ totalUsers, users });
  } catch (error) {
    // Обробка помилок
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const registerUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { userData, accessToken } = await registerUserService({
      email,
      password,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { user: userData, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { session, userId } = await loginUserService({ email, password });

    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { userId, accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const sendResetPasswordEmailController = async (req, res) => {
  await sendResetPasswordEmail(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};

export const getOAuthUrlController = (req, res) => {
  const url = generateOAuthURL();

  res.json({
    status: 200,
    message: 'Successfully received oauth url!',
    data: {
      url,
    },
  });
};

export const verifyGoogleOAuthController = async (req, res, next) => {
  const { error } = validateGoogleOAuthSchema.validate(req.body);

  if (error) {
    return next(createHttpError(400, error.details[0].message));
  }

  const { code } = req.body;

  try {
    const session = await loginOrSignupWithGoogleOAuth(code);
    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Logged in with Google OAuth!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};
