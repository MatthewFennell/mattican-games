import { functionToCall } from '../api/api';

export const getUserInfoForWeek = request => functionToCall('users-userInfoForWeek')(request)
    .then(data => ({
        weekPoints: data.data.week_points,
        averagePoints: data.data.average_points,
        highestPoints: data.data.highest_points
    }));


export const getUserStats = request => functionToCall('users-userStats')(request)
    .then(data => ({
        remainingBudget: data.data.remaining_budget,
        remainingTransfers: data.data.remaining_transfers,
        totalPoints: data.data.total_points
    }));

export const getMaxGameWeek = request => functionToCall('users-maxGameWeek')(request)
    .then(data => data.data);

export const scrapeData = request => functionToCall('scrapeData')(request)
    .then(data => data.data);
