import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setData(destinations) {
    this._destinations = destinations.slice();
  }

  getData() {
    return this._destinations;
  }
}
