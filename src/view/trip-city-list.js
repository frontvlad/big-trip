//Parents
import AbstractView from './abstract.js';

//Supporting const
import { SortType } from '../const/const.js';

//Supporting function
import { sortTrips } from '../utils/filtering-sorting.js';

////


//Function

const getCityListString = (tripsData) => {
  if (!tripsData) {
    return '';
  }

  const sortedTripsData = sortTrips[SortType.DAY](tripsData);
  let cityList = sortedTripsData.map(({ destination }) => destination.name);

  if (cityList.length > 3) {
    cityList = `${cityList[0]} - ... - ${cityList.at(-1)}`;
  } else {
    cityList = cityList.map((item) => `${item}`).join(' - ');
  }

  return cityList;
};


//Template

const createTripCityListTemplate = (tripsData) => `<h1 class="trip-info__title">${getCityListString(tripsData)}</h1>`;


export default class TripCityList extends AbstractView {

  constructor(tripsData) {
    super();

    //Data
    this._tripsData = tripsData;

  }

  getTemplate() {
    return createTripCityListTemplate(this._tripsData);
  }

}

