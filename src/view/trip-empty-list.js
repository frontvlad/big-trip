//Parents
import AbstractView from './abstract.js';

////


//Template

const createTripEmptyListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';


export default class TripEmptyList extends AbstractView {

  getTemplate() {
    return createTripEmptyListTemplate();
  }

}
