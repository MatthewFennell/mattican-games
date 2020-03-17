/* eslint-disable no-underscore-dangle */
import moment from 'moment';
// eslint-disable-next-line no-underscore-dangle
// eslint-disable-next-line import/prefer-default-export
export const generateTimeSinceNow = date => moment(new Date(date._seconds * 1000)).startOf('second').fromNow();
