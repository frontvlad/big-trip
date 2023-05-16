//Parents
import AbstractView from './abstract.js';

//Supporting function
import { getDifferenceDates, humanizeDate, DateFormat } from '../utils/date.js';

////


//Function

const getDateGapString = (tripsData) => {
  if (!tripsData) {
    return '';
  }

  const datesFrom = tripsData.map(({ date_from }) => date_from).sort(getDifferenceDates).shift();
  const datesTo = tripsData.map(({ date_to }) => date_to).sort(getDifferenceDates).pop();
  return `${humanizeDate(datesFrom, DateFormat.DAY_MONTH)} - ${humanizeDate(datesTo, DateFormat.DAY_MONTH)}`;
};


//Template

const createTripDateGapTemplate = (tripsData) => `<p class="trip-info__dates">${getDateGapString(tripsData)}</p>`;


export default class TripDateGap extends AbstractView {
  constructor(tripsData) {
    super();

    //Data
    this._tripsData = tripsData;

  }

  getTemplate() {
    return createTripDateGapTemplate(this._tripsData);
  }
}
