//Parents
import AbstractView from './abstract.js';

//Supporting const
import { SortType, State } from '../const/const.js';

////


//Function

const isDisabled = (state) => {
  if (state === State.DISABLED) {
    return 'disabled';
  }

  return '';
};

const isChecked = (currentSortType, itemSortType) => currentSortType === itemSortType ? 'checked' : '';


//Template

const createTripSortTemplate = (currentSortType, state) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${isDisabled(state)} ${isChecked(currentSortType, SortType.DAY)}>
    <label class="trip-sort__btn" for="sort-day">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${isDisabled(state)} ${isChecked(currentSortType, SortType.TIME)}>
    <label class="trip-sort__btn" for="sort-time">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${isDisabled(state)} ${isChecked(currentSortType, SortType.PRICE)}>
    <label class="trip-sort__btn" for="sort-price">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn" for="sort-offer">Offers</label>
  </div>
</form>`;
};


export default class TripSort extends AbstractView {
  constructor(currentSortType, state) {
    super();

    //Variable
    this._state = state;
    this._currentSortType = currentSortType;

    //Handler
    this._onChangeSortType = this._onChangeSortType.bind(this);

  }

  getTemplate() {
    return createTripSortTemplate(this._currentSortType, this._state);
  }

  setChangeSortTypeHandler(callback) {
    this._callback.onChangeSortType = callback;
    this.getElement().addEventListener('change', this._onChangeSortType);
  }


  //Handler

  _onChangeSortType(evt) {
    this._callback.onChangeSortType(evt.target.value);
  }

}

