//Parents
import AbstractView from './abstract.js';

//Supporting function
import { humanizeDate, DateFormat, MeasureDate, getStringDate, getDifferenceDates, getObjectDateISO } from '../utils/date.js';

//Library
import he from 'he';

////

const isFavoriteClass = (isFavoite) => {
  return isFavoite ? 'event__favorite-btn--active' : '';
};


//Template

const createTripTemplate = (tripData) => {
  const { base_price, date_from, date_to, destination, is_favorite, offers, type, isSaving, isDisabled } = tripData;

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${getObjectDateISO(date_from)}">${humanizeDate(date_from, DateFormat.DAY_MONTH)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${he.encode(destination.name)}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${getObjectDateISO(date_from)}">${humanizeDate(date_from, DateFormat.HOUR_MINUTE_24)}</time>
        &mdash;
        <time class="event__end-time" datetime="${getObjectDateISO(date_to)}">${humanizeDate(date_to, DateFormat.HOUR_MINUTE_24)}</time>
      </p>
      <p class="event__duration">${getStringDate(getDifferenceDates(date_to, date_from, MeasureDate.MILLISECOND), MeasureDate.MILLISECOND)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${base_price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${createOffersTemplate(offers)}
    </ul>
    <button class="event__favorite-btn ${isFavoriteClass(is_favorite)}" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Add to favorite</span>
      ${createFavotiteIconTemplate(isSaving)}
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

const createFavotiteIconTemplate = (isSaving) => {
  if (isSaving) {
    return `<svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <defs>
        <linearGradient id="myG"  fy="0" gradientTransform="rotate(60 .5 .5)">

          <stop offset="0" stop-color="#ffd054">
          </stop>
          <stop offset=".25" stop-color="#ebebeb">
          <animate attributeName="offset" dur="1s" values="0;1;0"
            repeatCount="indefinite" />
          </stop>
          <stop offset="1" stop-color="#a77b02"/>

        </linearGradient>
      </defs>
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" fill="url(#myG)"/>
    </svg>`;
  } else {
    return `<svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>`;
  }
};

const createOffersTemplate = (offers) => {
  if (offers.length > 0) {
    return offers.map(({ title, price }) => `<li
    class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&nbsp;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
    </li>`).join('');
  }

  return '';
};


export default class PointEvent extends AbstractView {
  constructor(tripData) {
    super();

    //Data
    this._tripData = tripData;

    //Handler
    this._onClickOpenEditorButton = this._onClickOpenEditorButton.bind(this);
    this._onClickFavoriteButton = this._onClickFavoriteButton.bind(this);

  }

  getTemplate() {
    return createTripTemplate(this._tripData);
  }


  //Update

  _updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._tripData = JSON.parse(JSON.stringify(this._tripData));

    this._tripData = Object.assign(
      {},
      this._tripData,
      update,
    );

    this._updateElement();
  }


  //Handler

  restoreHandlers() {
    this.setClickOpenEditorButtonHandler(this._callback.clickOpenEditorButton);
    this.setClickFavoriteButtonHandler(this._callback.clickFavoriteButton);
  }

  setClickOpenEditorButtonHandler(callback) {
    this._callback.clickOpenEditorButton = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._onClickOpenEditorButton);
  }

  _onClickOpenEditorButton(evt) {
    evt.preventDefault();
    this._callback.clickOpenEditorButton();
  }

  setClickFavoriteButtonHandler(callback) {
    this._callback.clickFavoriteButton = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._onClickFavoriteButton);
  }

  _onClickFavoriteButton() {
    this._callback.clickFavoriteButton();
  }

}

