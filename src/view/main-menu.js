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

const createMainMenuTemplate = (currentMenuType, state) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn ${currentMenuType === 'table' ? 'trip-tabs__btn--active' : ''}" href="#" data-type-filter="table" ${isDisabled(state)}>Table</a>
  <a class="trip-tabs__btn ${currentMenuType === 'stats' ? 'trip-tabs__btn--active' : ''}" href="#"data-type-filter="stats" ${isDisabled(state)}>Stats</a>
</nav>`;
};


export default class MainMenu extends AbstractView {
  constructor(currentMenuType, state) {
    super();

    //Variable
    this._currentMenuType = currentMenuType;
    this._state = state;

    //Handler
    this._onChangeTypeMenu = this._onChangeTypeMenu.bind(this);

  }

  getTemplate() {
    return createMainMenuTemplate(this._currentMenuType, this._state);
  }


  //Handler

  setChangeTypeMenuHandler(callback) {
    this._callback.changeTypeMenu = callback;
    this.getElement().addEventListener('click', this._onChangeTypeMenu);
  }

  _onChangeTypeMenu(evt) {
    evt.preventDefault();
    this._callback.changeTypeMenu(evt.target.dataset.typeFilter);
  }

}
