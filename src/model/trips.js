import Observer from '../utils/observer.js';

export default class Trips extends Observer {
  constructor() {
    super();
    this._trips = [];
  }

  setData(updateType, trips) {
    this._trips = trips.slice();

    this._notify(updateType);
  }

  getData() {
    return this._trips;
  }

  updateData(updateType, update) {
    const index = this._trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting trip');
    }

    this._trips = [
      ...this._trips.slice(0, index),
      update,
      ...this._trips.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addData(updateType, update) {
    this._trips = [
      update,
      ...this._trips,
    ];

    this._notify(updateType, update);
  }

  deleteData(updateType, update) {
    const index = this._trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting trip');
    }

    this._trips = [
      ...this._trips.slice(0, index),
      ...this._trips.slice(index + 1),
    ];

    this._notify(updateType);
  }

}
