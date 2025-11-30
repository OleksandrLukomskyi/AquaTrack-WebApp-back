import createHttpError from 'http-errors';
import { getUser, updateUserService } from '../services/userService.js';
import {
  refreshSessionService,
  logoutUserService,
} from '../services/authServices.js';
import { saveFile } from '../utils/cloudinary/saveFile.js';
import { REFRESH_TOKEN_LIFE_TIME } from '../constants/constants.js';

const setupSession = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFE_TIME),
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIFE_TIME),
  });
};

export const removeSensitiveFields = (user) => {
  const userData = user.toObject ? user.toObject() : user;
  delete userData.password;
  delete userData.__v;

  return userData;
};

export const getCurrentAccauntController = (req, res, next) => {
  try {
    // Отримуємо користувача з об'єкта req, який був попередньо заповнений middleware authenticate
    const user = req.user;

    // Перевіряємо, що користувач знайдений
    if (!user) {
      throw createHttpError(401, 'User not authenticated');
    }

    // Створюємо новий об'єкт користувача без чутливих даних
    const sanitizedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      weight: user.weight,
      activeSportsTime: user.activeSportsTime,
      dailyWaterIntake: user.dailyWaterIntake,
      avatar: user.avatar,
    };

    // Відправляємо користувача відповідь
    res.status(200).json({ user: sanitizedUser });
  } catch (error) {
    next(error);
  }
};

export const getFindtUserController = async (req, res, next) => {
  const userId = req.params;

  const user = await getUser(userId);

  if (!user) {
    throw createHttpError(404, { message: 'User not found' });
  }

  const userData = removeSensitiveFields(user);
  res.json({
    status: 200,
    message: 'Successfully found user!',
    data: userData,
  });
};

export const updateUserController = async (req, res, next) => {
  try {
    let avatarUrl;
    if (req.file) {
      avatarUrl = await saveFile(req.file); // Зберігаємо аватар користувача
      req.body.avatar = avatarUrl; // Додаємо URL аватара в тіло запиту
    }

    console.log('Received userId:', req.user._id); // Логуємо userId для відстеження
    const updatedUser = await updateUserService(
      req.user._id,
      req.body,
      avatarUrl,
    ); // Оновлюємо користувача через сервіс

    // Видаляємо чутливі поля з відповіді
    const user = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
    const userData = removeSensitiveFields(user);

    res.status(200).json({ user: userData });
  } catch (error) {
    next(error);
  }
};

export const refreshTokensController = async (req, res, next) => {
  const { sessionId, refreshToken } = req.cookies;

  // Перевірка наявності необхідних даних у запиті
  if (!sessionId || !refreshToken) {
    console.log('refresh controller', sessionId, refreshToken);
    return res.status(400).json({
      status: 400,
      message: 'Session ID and Refresh Token are required',
    });
  }

  // Оновлення сесії
  const session = await refreshSessionService({
    sessionId,
    refreshToken,
  });

  if (!session) {
    return res.status(401).json({
      status: 401,
      message: 'Invalid session or refresh token',
    });
  }

  // Налаштування нових куків
  setupSession(res, session);

  // Відповідь на запит
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const refreshToken = req.cookies.refreshToken;

  //   if (!refreshToken) {
  //     return next(createHttpError(400, 'Refresh token is required'));
  //   }

  await logoutUserService({ sessionId, refreshToken });

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
