import { WaterCollection } from '../db/models/water.js';
import { validateDate } from '../validation/dateValidation.js';
//import { formatResponse } from '../utils/formatResponse.js';
import User from '../db/models/User.js';

export const createWater = async (userId, payload) => {
  const water = await WaterCollection.create({ userId, ...payload });
  return water;
};

export const patchWater = async (userId, waterId, payload, options = {}) => {
  const rawResult = await WaterCollection.findOneAndUpdate(
    { userId, _id: waterId },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );
  return rawResult;
};

export const deleteWater = async (userId, waterId) => {
  const water = await WaterCollection.findOneAndDelete({
    userId,
    _id: waterId,
  });
  return water;
};

export const fetchDailyService = async (userId, dateString) => {
  if (!validateDate(dateString)) {
    console.error('Invalid date format:', dateString);
    throw new Error('Invalid date format');
  }

  const [year, month, day] = dateString.split('-');
  const startDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  try {
    const dailyConsumption = await WaterCollection.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (!dailyConsumption || dailyConsumption.length === 0) {
      return { dateOrMonth: dateString, data: [] }; // Повернути порожній масив, якщо даних немає
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const totalConsumption = dailyConsumption.reduce(
      (total, record) => total + record.amountOfWater,
      0,
    );
    const percentageOfDailyIntake =
      (totalConsumption / user.dailyWaterIntake) * 100;

    return {
      dateOrMonth: dateString,
      data: dailyConsumption,
      totalConsumption,
      percentageOfDailyIntake: percentageOfDailyIntake.toFixed(2),
    };
  } catch (error) {
    throw new Error('Server error');
  }
};

export const fetchMonthlyService = async (userId, dateString) => {
  if (!validateDate(dateString)) {
    throw new Error('Invalid date format');
  }

  const [year, month] = dateString.split('-');
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  // Знаходимо дані про споживання води за місяць
  const monthlyConsumption = await WaterCollection.find({
    userId,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  //   if (!monthlyConsumption || monthlyConsumption.length === 0) {
  //     throw new Error('Data for the specified month was not found');
  //   }

  // Отримуємо користувача для доступу до денної норми води
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const dailyWaterIntake = user.dailyWaterIntake; // Денна норма води

  // Створюємо об'єкт для зберігання споживання води за кожен день
  const dailyConsumptionMap = {};
  const daysInMonth = new Date(year, month, 0).getDate();
  let totalMonthlyConsumption = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dayKey = `${year}-${month.padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    dailyConsumptionMap[dayKey] = 0;
  }

  // Заповнюємо об'єкт даними про споживання води
  monthlyConsumption.forEach((record) => {
    const dayKey = record.createdAt.toISOString().slice(0, 10);
    dailyConsumptionMap[dayKey] += record.amountOfWater;
    totalMonthlyConsumption += record.amountOfWater;
  });

  // Формуємо масив з результатами
  const dailyResults = [];
  for (const [date, totalConsumption] of Object.entries(dailyConsumptionMap)) {
    const consumptionPercentage = (totalConsumption / dailyWaterIntake) * 100;
    dailyResults.push({
      date,
      totalConsumption,
      consumptionPercentage,
    });
  }

  return {
    month: dateString,
    totalMonthlyConsumption,
    dailyResults,
  };
};
