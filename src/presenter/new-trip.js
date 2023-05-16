//View
import TripEditorView from '../view/trip-editor.js';

//Supporting const
import { UserAction, UpdateType, State, TypeTrip, ViewAction, RenderPosition } from '../const/const.js';

//Supporting function
import { render, remove, replace } from '../utils/render.js';
import { getObjectDateISO } from '../utils/date.js';


////


//Function

const EMPTY_TRIP = {
  base_price: '',
  date_from: getObjectDateISO(),
  date_to: getObjectDateISO(),
  destination: {
    name: null,
    description: null,
    pictures: null,
  },
  is_favorite: false,
  type: 'taxi',
  offers: [],
};


export default class NewTrip {
  constructor(tripListContainer, onViewUpdateData, onTypeViewChange, onViewAction) {

    //Callback
    this._onViewUpdateData = onViewUpdateData;
    this._onTypeViewChange = onTypeViewChange;
    this._onViewAction = onViewAction;

    //Data
    this._tripData = EMPTY_TRIP;
    this._offersData = null;
    this._destinationData = null;

    //Container
    this._tripListContainer = tripListContainer;

    //Component
    this._tripEditorComponent = null;

    //Handler
    this._onSubmitTrip = this._onSubmitTrip.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onClickDeleteButton = this._onClickDeleteButton.bind(this);

  }

  init(offersData, destinationsData) {
    this._offersData = offersData;
    this._destinationsData = destinationsData;
  }

  //Render

  renderNewTrip() {
    this._onTypeViewChange(TypeTrip.NEW);
    this._onViewAction(ViewAction.OPEN_NEW_TRIP);
    const prevtripEditorComponent = this._tripEditorComponent;

    this._tripEditorComponent = new TripEditorView(this._tripData, this._offersData, this._destinationsData, TypeTrip.NEW);
    this._tripEditorComponent.setSubmitTripHandler(this._onSubmitTrip);
    this._tripEditorComponent.setClickDeleteButtonHandler(this._onClickDeleteButton);
    this._tripEditorComponent.setDatepickers();
    document.addEventListener('keydown', this._onEscKeyDown);

    if (prevtripEditorComponent === null) {
      render(this._tripListContainer, this._tripEditorComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripEditorComponent, prevtripEditorComponent);
    remove(prevtripEditorComponent);
  }


  //Remove

  removeNewTripEditor() {
    if (this._tripEditorComponent === null) {
      return;
    }

    this._tripEditorComponent.removeDatepickers();

    document.removeEventListener('keydown', this._onEscKeyDown);

    this._onViewAction(ViewAction.CLOSE_NEW_TRIP);

    remove(this._tripEditorComponent);
    this._tripEditorComponent = null;
  }


  //Handler

  _onSubmitTrip(trip) {
    this._onViewUpdateData(
      UserAction.ADD_TRIP,
      UpdateType.MINOR,
      trip,
    );
  }

  _onClickDeleteButton() {
    this.removeNewTripEditor();
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.removeNewTripEditor();
    }
  }


  //State

  setStateView(state) {

    const resetEditorState = () => {
      this._tripEditorComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._tripEditorComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.ABORTING:
        this._tripEditorComponent.shake(resetEditorState);
        break;
    }
  }

}
