//Parents
import AbstractView from './abstract.js';

//Supporting const
import { State } from '../const/const.js';

////


//Function

const isDisabled = (state) => {
  if (state === State.DISABLED) {
    return 'disabled';
  }

  return '';
};


//Template

const createNewTripButtonTemplate = (state) => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isDisabled(state)}>New event</button>`;
};


export default class NewTripButton extends AbstractView {

  constructor(state) {
    super();

    //Variable
    this._state = state;

    //Handler
    this._onClickNewTripButton = this._onClickNewTripButton.bind(this);
  }

  getTemplate() {
    return createNewTripButtonTemplate(this._state);
  }

  //Handler

  setClickNewTripButtonHandler(callback) {
    this._callback.clickNewTripButton = callback;
    this.getElement().addEventListener('click', this._onClickNewTripButton);
  }

  _onClickNewTripButton(evt) {
    evt.preventDefault();
    this._callback.clickNewTripButton();
  }

}
