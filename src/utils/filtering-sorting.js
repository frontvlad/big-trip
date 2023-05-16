//Supporting
import { isSameOrAfterDate, isBeforeDate, isAfterDate, getToday, MeasureDate, getDifferenceDates } from './date.js';
import { SortType, FilterType } from '../const/const.js';
////


export const filterTrips = {
  [FilterType.EVERYTHING]: (trips) => trips,
  [FilterType.FUTURE]: (trips) => trips.filter(({ date_from }) => isSameOrAfterDate(date_from, getToday(), MeasureDate.SECOND)),
  [FilterType.PAST]: (trips) => trips.filter(({ date_to }) => isBeforeDate(date_to, getToday(), MeasureDate.SECOND)),
  [FilterType.CURRENT]: (trips) => trips.filter(({ date_from, date_to }) => isBeforeDate(date_from, getToday(), MeasureDate.SECOND) && isAfterDate(date_to, getToday(), MeasureDate.SECOND)),
};

export const sortTrips = {
  [SortType.DAY]: (tripsData) => tripsData.slice().sort((a, b) => getDifferenceDates(a.date_from, b.date_from, MeasureDate.MILLISECOND)),
  [SortType.TIME]: (tripsData) => tripsData.slice().sort((a, b) => getDifferenceDates(a.date_to, a.date_from, MeasureDate.MILLISECOND) - getDifferenceDates(b.date_to, b.date_from , MeasureDate.MILLISECOND)),
  [SortType.PRICE]: (tripsData) => tripsData.slice().sort((a, b) => a.base_price - b.base_price),
};

