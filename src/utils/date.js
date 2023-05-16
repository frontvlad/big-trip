//Library
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';


//Dayjs
const dayjs = require('dayjs');
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(objectSupport);
dayjs.extend(utc);

////


export const MeasureDate = {
  DAY: 'day',
  WEEK: 'week',
  QUARTER: 'quarter',
  MONTH: 'month',
  YEAR: 'year',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
  MILLISECOND: 'millisecond',
};

export const DateFormat = {
  YEAR: 'YYYY',
  HOUR_MINUTE_24: 'HH:mm',
  DAY_MONTH: 'D MMM',
  DAY_MONTH_YEAR: 'D MMMM YYYY',
  DAY_MONTH_YEAR_HOUR_MINUTE_24: 'DD/MM/YY HH:mm',
  YEAR_MONTH_DAY_HOUR_MINUTE_24: 'YYYY-MM-DD HH:mm',
};




//Приводит date к нужному формату format
export const humanizeDate = (date, format) => dayjs(date).format(format);

//Возвращает копию нативного объекта Date
export const getObjectDate = (date) => dayjs(date).toDate();

//Возвращает копию нативного объекта Date ISO
export const getObjectDateISO = (date) => dayjs(date).toISOString();

//Возвращает дату в формате UTC
export const gets = (date) => dayjs.utc(date).format();

//Возвращает сегодняшнюю дату
export const getToday = () => dayjs();

//Возвращает объект продолжительности duration. measure задаёт еденицу измерения
export const getDuration = (duration, measure = MeasureDate.MILLISECOND) => dayjs.duration(duration, measure);

//Получает строку вида D/H/M из продолжительности duration
export const getStringDate = (duration, measure = MeasureDate.MILLISECOND) => {
  const date = getDuration(duration, measure);
  return `${date.get('month') ? date.get('month') + 'M' : ''} ${date.get('days') ? date.get('days') + 'D' : ''} ${date.get('hour') ? date.get('hour') + 'H' : ''} ${date.get('minute') ? date.get('minute') + 'M' : ''}`;
};

//Вычитает из dateA - dateB и возвращает разницу в указанной еденице измерения measure
export const getDifferenceDates = (dateA, dateB, measure = MeasureDate.MILLISECOND) => dayjs(dateA).diff(dayjs(dateB), measure);

//Вычитает (count) measure от date и возвращает полученную дату
export const getDateSubtract = (date, count, measure = MeasureDate.MILLISECOND) => dayjs(date).subtract(count, measure);

//Возвращает true если день dateA и dateB совпадают, по еденице измерения measure
export const isSameDayDate = (dateA, dateB, measure = MeasureDate.MILLISECOND) => dayjs(dateA).isSame(dayjs(dateB), measure);

//Возвращает true если dateA является такой же или находится до dateB, по еденице измерения measure;
export const isSameOrBeforeDate = (dateA, dateB, measure = MeasureDate.MILLISECOND) => dayjs(dateA).isSameOrBefore(dayjs(dateB), measure);

//Возвращает true если dateA является такой же или следует после dateB, по еденице измерения measure;
export const isSameOrAfterDate = (dateA, dateB, measure = MeasureDate.MILLISECOND) => dayjs(dateA).isSameOrAfter(dayjs(dateB), measure);

//Возвращает true если dateA следует после dateB, по еденице измерения measure;
export const isAfterDate = (dateA, dateB, measure = MeasureDate.MILLISECOND) => dayjs(dateA).isAfter(dayjs(dateB), measure);

//Возвращает true если dateA находится до dateB, по еденице измерения measure;
export const isBeforeDate = (dateA, dateB, measure = MeasureDate.MILLISECOND) => dayjs(dateA).isBefore(dayjs(dateB), measure);










// //Library
// import duration from 'dayjs/plugin/duration';
// // eslint-disable-next-line no-undef
// const dayjs = require('dayjs');
// dayjs.extend(duration);
// ////




// const getTodayDate = () => dayjs().toDate();

// const humanizeDate = (date, format) => dateConverter[format](date);

// const getTimeDuration = (initialDate, expirationDate) => {
//   const duration = dayjs.duration(compareDates(expirationDate, initialDate));

//   const dats = `${duration.get('days') ? duration.get('days') + 'D' :''} ${duration.get('hour') ? duration.get('hour') + 'H' : ''} ${duration.get('minute') ? duration.get('minute') + 'M' : ''}`;

//   return dats;
// };

// const getStringDate = (duration) => {
//   const date = dayjs.duration(duration);
//   return `${date.get('days') ? date.get('days') + 'D' : ''} ${date.get('hour') ? date.get('hour') + 'H' : ''} ${date.get('minute') ? date.get('minute') + 'M' : ''}`;
// };

// const compareDates = (dateA, dateB) => dayjs(dateA).diff(dateB);

// const compareDurationDates = (expirationDate, initialDate) => dayjs.duration(compareDates(expirationDate, initialDate)).asMilliseconds();

// const isDateExpired = (date) => dayjs().isAfter(date, 'm');

// const isDateInFuture = (date) => dayjs().isBefore(date, 'm');

// const isDateCurrent = (date) => dayjs().isSame(date, 'm');


// export {getStringDate, humanizeDate, getTodayDate, getTimeDuration, compareDates, compareDurationDates, isDateExpired, isDateInFuture, isDateCurrent};






// const dateConverter = {
//   DAY_MONTH: (date) => dayjs(date).format('D MMM'),
//   HOUR_MINUTE_12: (date) => dayjs(date).format('hh:mm'),
//   HOUR_MINUTE_24: (date) => dayjs(date).format('HH:mm'),
//   ISO: (date) => dayjs(date).format('YYYY-MM-DDTHH:mm'),
//   DATE_HOUR: (date) => dayjs(date).format('DD/MM/YY HH:mm'),
//   DATE: (date) => dayjs(date).toDate(),
// };
