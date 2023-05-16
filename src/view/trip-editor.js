//Parents
import AbstractView from './abstract.js';

//Supporting function
import { humanizeDate, DateFormat, getDifferenceDates, getObjectDateISO } from '../utils/date.js';

//Supporting const
import { TYPE_EVENT, CITY, UPDATE_ELEMENT, TypeTrip } from '../const/const.js';

//Library
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

////


//Template

////MainTemplate

const createEditPointEventTemplate = (tripData, typeTrip) => {
  const { base_price, date_from, date_to, destination, offers, type, city, allCurrentOffers, isDisabled, isSaving, isDeleting } = tripData;

  const isSubmitDisabled = (!date_from || !date_to || !base_price || !city);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTypesTripsListTemplate(TYPE_EVENT, type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city ? city : ''}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${createCityListTemplate(CITY)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(date_from, DateFormat.DAY_MONTH_YEAR_HOUR_MINUTE_24)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(date_to, DateFormat.DAY_MONTH_YEAR_HOUR_MINUTE_24)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${base_price ? base_price : ''}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled || isSubmitDisabled ? 'disabled' : ''}> ${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${typeTrip === TypeTrip.NEW ? 'Canel' : isDeleting ? 'Deleting...' : 'Delete'}</button>
      ${typeTrip === TypeTrip.NEW ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}

    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${createOffersTemplate(allCurrentOffers, offers)}
        </div>
      </section>
      ${createDestinationTemplate(destination)}
    </section>
  </form>
</li>`;
};


////TypeTemplate

const createTypesTripsListTemplate = (typesTrips, currentType) => {
  const isCheckedType = (type) => type === currentType ? 'checked' : '';

  return typesTrips.map((type) => `
  <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isCheckedType(type)}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>
  `).join('');
};


////OfferTemplate

const createOffersTemplate = (allCurrentOffers, checkedOffers) => {
  const checkedOffersTitle = checkedOffers.map(({ title }) => title);
  const isCheckedOffer = (currentOfferTitle) => checkedOffersTitle.find((title) => title === currentOfferTitle);
  const isChecked = (currentOfferTitle) => isCheckedOffer(currentOfferTitle) ? 'checked' : '';

  return allCurrentOffers.offers.map(({ title, price }) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}" type="checkbox" name="event-offer-${title}" value="${title}" ${isChecked(title)}>
      <label class="event__offer-label" for="event-offer-${title}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `).join('');
};


////DestinationTemplate

const createDestinationTemplate = (destinationData) => {
  if (destinationData.description === null || destinationData.pictures === null) {
    return '';
  }
  return `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destinationData.description}</p>
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${createDestinationImgTemplate(destinationData)}
    </div>
  </div>
</section>`;
};

const createDestinationImgTemplate = (destinationData) => {
  return destinationData.pictures.map(({ src, description }) => `
  <img class="event__photo" src="${src}" alt="${description}"></img>
  `).join('');
};


////CityListTemplate

const createCityListTemplate = (cities) => {
  return cities.map((city) => `
  <option value="${city}"></option>
  `).join('');
};


export default class EditorPoint extends AbstractView {
  constructor(tripData, offersData, destinationData, typeTrip = TypeTrip.OLD) {
    super();

    //Datepicker
    this._datepickerFrom = null;
    this._datepickerTo = null;

    //Variable
    this._typeTrip = typeTrip;

    //Data
    this._offersData = offersData;
    this._destinationData = destinationData;
    this._tripData = this.parseTripToData(tripData);


    //Handler
    this._onSubmitTrip = this._onSubmitTrip.bind(this);
    this._onClickCloseEditor = this._onClickCloseEditor.bind(this);
    this._onClickDeleteButton = this._onClickDeleteButton.bind(this);
    this._onChangeDateFrom = this._onChangeDateFrom.bind(this);
    this._onChangeDateTo = this._onChangeDateTo.bind(this);
    this._onCloseDatepicker = this._onCloseDatepicker.bind(this);


    //Function
    this._setInnerHandlers();

  }

  getTemplate() {
    return createEditPointEventTemplate(this._tripData, this._typeTrip);
  }


  //Datepicker

  setDatepickers() {
    this._setDatepickerTo();
    this._setDatepickerFrom();
  }

  _setDatepickerFrom() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    this._datepickerFrom = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        time_24hr: true,
        enableTime: true,
        dateFormat: 'd/m/y/ H:i',
        defaultDate: this._tripData.date_from,
        onChange: this._onChangeDateFrom,
        onClose: this._onCloseDatepicker,
      },
    );
  }

  _setDatepickerTo() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        time_24hr: true,
        enableTime: true,
        dateFormat: 'd/m/y/ H:i',
        defaultDate: this._tripData.date_to,
        onChange: this._onChangeDateTo,
        onClose: this._onCloseDatepicker,
      },
    );
  }

  removeDatepickers() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }
  }


  //Data

  parseTripToData(data) {
    return Object.assign(
      {},
      data,
      {
        city: data.destination.name,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
        allCurrentOffers: this._offersData.find(({ type }) => type === data.type),
      },
    );
  }

  parseDataToTrip(data) {
    data = Object.assign(
      {},
      data,
    );

    delete data.city;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    delete data.allCurrentOffers;

    return data;
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

  updateData(update, updateElement = UPDATE_ELEMENT.UPDATE) {
    if (!update) {
      return;
    }

    this._tripData = JSON.parse(JSON.stringify(this._tripData));

    this._tripData = Object.assign(
      {},
      this._tripData,
      update,
    );
    if (updateElement) {
      this._updateElement();
    }
  }

  updateOfferData(update, isChecked) {
    this._tripData = JSON.parse(JSON.stringify(this._tripData));

    if (isChecked) {
      this._tripData.offers.push(update);
    } else {
      const deleteIndex = this._tripData.offers.findIndex(({ title }) => title === update.title);
      this._tripData.offers.splice(deleteIndex, 1);
    }
  }


  //Handler

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-list')
      .addEventListener('change', this._onChangeType.bind(this));

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('blur', this._onChangeCity.bind(this));

    this.getElement()
      .querySelector('.event__available-offers')
      .addEventListener('change', this._onChangeOffer.bind(this));

    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._onChangePrice.bind(this));
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this._setDatepickerTo();
    this._setDatepickerFrom();

    this.setSubmitTripHandler(this._callback.pointSubmit);
    this.setClickCloseEditorHandler(this._callback.clickCloseEditor);
    this.setClickDeleteButtonHandler(this._callback.clickDeleteButton);
  }

  setClickCloseEditorHandler(callback) {
    this._callback.clickCloseEditor = callback;
    const closeButton = this.getElement().querySelector('.event__rollup-btn');
    closeButton ? closeButton.addEventListener('click', this._onClickCloseEditor) : '';
  }

  _onClickCloseEditor(evt) {
    evt.preventDefault();
    this._callback.clickCloseEditor();
  }

  setClickDeleteButtonHandler(callback) {
    this._callback.clickDeleteButton = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._onClickDeleteButton);
  }

  _onClickDeleteButton(evt) {
    evt.preventDefault();
    this._callback.clickDeleteButton(this.parseDataToTrip(this._tripData));
  }

  setSubmitTripHandler(callback) {
    this._callback.pointSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._onSubmitTrip);
  }

  _onSubmitTrip(evt) {
    evt.preventDefault();
    this._callback.pointSubmit(this.parseDataToTrip(this._tripData));
  }

  _onChangeType(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: [],
      allCurrentOffers: this._offersData.find(({ type }) => type === evt.target.value),
    });
  }

  _onChangePrice(evt) {
    evt.preventDefault();
    this.updateData({
      base_price: Number(evt.target.value),
    });
  }

  _onChangeOffer(evt) {
    evt.preventDefault();
    const offerTitle = evt.target.value;
    const offerPrice = this._tripData.allCurrentOffers.offers.find(({ title }) => title === offerTitle).price;
    const isChecked = evt.target.checked;

    if (isChecked) {
      this.updateOfferData({
        title: offerTitle,
        price: Number(offerPrice),
      }, isChecked);
    } else {
      this.updateOfferData({
        title: offerTitle,
      }, isChecked);
    }
  }

  _onChangeCity(evt) {
    evt.preventDefault();

    const newDestination = this._destinationData.find(({ name }) => name === evt.target.value);
    if (newDestination) {
      this.updateData({
        city: evt.target.value,
        destination: newDestination,
      });
    } else {
      this.updateData({
        city: evt.target.value,
        destination: {
          description: null,
          name: evt.target.value,
          pictures: null,
        },
      });
    }
  }

  _onChangeDateFrom(userInput) {
    if (getDifferenceDates(this._tripData.date_to, userInput) < 0) {
      this.updateData({
        date_from: getObjectDateISO(userInput),
        date_to: getObjectDateISO(userInput),
      });
      return;
    }
    this.updateData({
      date_from: getObjectDateISO(userInput),
    }, UPDATE_ELEMENT.NO_UPDATE);
  }

  _onChangeDateTo(userInput) {
    if (getDifferenceDates(userInput, this._tripData.date_from) < 0) {
      userInput = this._tripData.date_from;
    }
    this.updateData({
      date_to: getObjectDateISO(userInput),
    }, UPDATE_ELEMENT.NO_UPDATE);
  }

  _onCloseDatepicker() {
    this._updateElement();
  }


  //Other

  reset(trip) {
    this.updateData(
      this.parseTripToData(trip),
    );
  }

}
