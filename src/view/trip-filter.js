//Parents
import AbstractView from './abstract.js';

//Supporting function
import { filterTrips } from '../utils/filtering-sorting.js';

//Supporting const
import { FilterType, State } from '../const/const.js';

////


//Function

const getFilterItems = (tripsData) => {
  return [
    {
      type: FilterType.EVERYTHING,
      name: 'Everything',
      count: filterTrips[FilterType.EVERYTHING](tripsData).length,
    },
    {
      type: FilterType.FUTURE,
      name: 'Future',
      count: filterTrips[FilterType.FUTURE](tripsData).length,
    },
    {
      type: FilterType.PAST,
      name: 'Past',
      count: filterTrips[FilterType.PAST](tripsData).length,
    },
    {
      type: FilterType.CURRENT,
      name: 'Current',
      count: filterTrips[FilterType.CURRENT](tripsData).length,
    },
  ];
};

const isDisabled = (state) => {
  if (state === State.DISABLED) {
    return 'disabled';
  }

  return '';
};


//Template

const createTripFilterItemListTemplate = (tripsData, currentFilterType, state) => {
  if (!tripsData) {
    tripsData = [];
  }

  const filterItems = getFilterItems(tripsData);
  const filterTemlate = filterItems.map((filter) => createTripFilterTemplate(filter, currentFilterType, state)).join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterTemlate}
</form>`;
};

const createTripFilterTemplate = (filter, currentFilterType, state) => {
  const {type, name, count} = filter;
  return `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''} ${isDisabled(state)}>
    <label class="trip-filters__filter-label" for="filter-${type}">${name} ${count}</label>
  </div>`;
};


export default class TripFilter extends AbstractView {
  constructor(tripsData, currentFilterType, state) {
    super();

    //Variable
    this._currentFilter = currentFilterType;
    this._state = state;

    //Data
    this._tripsData = tripsData;

    //Handler
    this._onChangeTypeFilter = this._onChangeTypeFilter.bind(this);

  }

  getTemplate() {
    return createTripFilterItemListTemplate(this._tripsData, this._currentFilter, this._state);
  }


  //Handler

  setChangeTypeFilterHandler(callback) {
    this._callback.changeTypeFilter = callback;
    this.getElement().addEventListener('change', this._onChangeTypeFilter);
  }

  _onChangeTypeFilter(evt) {
    evt.preventDefault();
    this._callback.changeTypeFilter(evt.target.value);
  }

}


