import User from '../db/models/User.js';

export const getUser = async ({ userId }) => {
  const user = User.findOne({ _id: userId });

  return user;
};

export const updateUserService = async (userId, payload, options = {}) => {
  const result = await User.findByIdAndUpdate({ _id: userId }, payload, {
    new: true,
    includesResultMetadata: true,
    ...options,
  });

  return result;
};
