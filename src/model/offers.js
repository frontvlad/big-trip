import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setData(offers) {
    this._offers = offers.slice();
  }

  getData() {
    return this._offers;
  }
}
