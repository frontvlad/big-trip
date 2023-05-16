//Parents
import AbstractView from './abstract.js';

////


//Function

const getTotalPrice = (tripsData) => {
  if (!tripsData) {
    return '';
  }

  return tripsData.reduce((totalPrice, trip) => totalPrice + trip.base_price
    + trip.offers.reduce((totalOffersPrice, offer) => totalOffersPrice + offer.price, 0), 0);
};


//Template

const createTripCostTemplate = (tripsData) => {
  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(tripsData)}</span>
</p>`;
};


export default class TripCost extends AbstractView {
  constructor(tripsData) {
    super();

    //Data
    this._tripsData = tripsData;

  }

  getTemplate() {
    return createTripCostTemplate(this._tripsData);
  }
}
