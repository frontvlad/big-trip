//Parents
import AbstractView from './abstract.js';

////


//Template

const createTripListTemplate = () => '<ul class="trip-events__list"></ul>';


export default class TripList extends AbstractView {

  getTemplate() {
    return createTripListTemplate();
  }

}
