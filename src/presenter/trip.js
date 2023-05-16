//View
import TripView from '../view/trip.js';
import TripEditorView from '../view/trip-editor.js';

//Supporting const
import { UserAction, UpdateType, State, TypeView, TypeTrip, RenderPosition } from '../const/const.js';

//Supporting function
import { render, replace, remove } from '../utils/render.js';

////


export default class Trip {
  constructor(tripListContainer, onViewUpdateData, onTypeViewChange) {

    //Callback
    this._onTypeViewChange = onTypeViewChange;
    this._onViewUpdateData = onViewUpdateData;

    //Variable
    this._typeView = TypeView.DEFAULT;

    //Data
    this._tripData = null;
    this._offersData = null;
    this._destinationData = null;

    //Container
    this._tripListContainer = tripListContainer;

    //Component
    this._tripComponent = null;
    this._tripEditorComponent = null;

    //Handler
    this._onClickOpenEditorButton = this._onClickOpenEditorButton.bind(this);
    this._onSubmitTrip = this._onSubmitTrip.bind(this);
    this._onClickCloseEditorButton = this._onClickCloseEditorButton.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onClickFavoriteButton = this._onClickFavoriteButton.bind(this);
    this._onClickDeleteButton = this._onClickDeleteButton.bind(this);

  }

  init(tripData, offersData, destinationsData) {
    this._tripData = tripData;
    this._offersData = offersData;
    this._destinationData = destinationsData;
  }


  //Create

  _createTrip() {
    this._tripComponent = new TripView(this._tripData);

    this._tripComponent.setClickOpenEditorButtonHandler(this._onClickOpenEditorButton);
    this._tripComponent.setClickFavoriteButtonHandler(this._onClickFavoriteButton);
  }

  _createTripEditor() {
    this._tripEditorComponent = new TripEditorView(this._tripData, this._offersData, this._destinationData);

    this._tripEditorComponent.setSubmitTripHandler(this._onSubmitTrip);
    this._tripEditorComponent.setClickCloseEditorHandler(this._onClickCloseEditorButton);
    this._tripEditorComponent.setClickDeleteButtonHandler(this._onClickDeleteButton);
  }

  //Render

  renderTrip() {
    const prevTripComponent = this._tripComponent;
    const prevEditorComponent = this._tripEditorComponent;

    this._createTrip();
    this._createTripEditor();

    if (prevTripComponent === null || prevEditorComponent === null) {
      render(this._tripListContainer, this._tripComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._typeView === TypeView.DEFAULT) {
      replace(this._tripComponent, prevTripComponent);
    }

    if (this._typeView === TypeView.EDITING) {
      replace(this._tripEditorComponent, prevEditorComponent);
      this._typeView = TypeView.DEFAULT;
    }

    remove(prevTripComponent);
    remove(prevEditorComponent);
  }


  //Remove

  removeTrip() {
    this._tripEditorComponent.removeDatepickers();

    document.removeEventListener('keydown', this._onEscKeyDown);

    remove(this._tripComponent);
    this._tripComponent = null;

    remove(this._tripEditorComponent);
    this._tripEditorComponent = null;
  }


  //Handler

  _onSubmitTrip(trip) {
    this._onViewUpdateData(
      UserAction.UPDATE_TRIP,
      UpdateType.MINOR,
      trip,
    );
  }

  _onClickDeleteButton(trip) {
    document.removeEventListener('keydown', this._onEscKeyDown);

    this._onViewUpdateData(
      UserAction.DELETE_TRIP,
      UpdateType.MINOR,
      trip,
    );
  }

  _onClickFavoriteButton() {
    this._onViewUpdateData(
      UserAction.UPDATE_TRIP,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._tripData,
        { is_favorite: !this._tripData.is_favorite }),
    );
  }

  _onClickOpenEditorButton() {
    this._replaceTripToEditor();
  }

  _onClickCloseEditorButton() {
    this._tripEditorComponent.reset(this._tripData);
    this._replaceEditorToTrip();
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._tripEditorComponent.reset(this._tripData);
      this._replaceEditorToTrip();
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

    const resetTripState = () => {
      this._tripComponent.updateData({
        isDisabled: false,
        isSaving: false,
      });
    };

    switch (state) {
      case State.SAVING:
        if (this._typeView === TypeView.DEFAULT) {
          this._tripComponent.updateData({
            isDisabled: true,
            isSaving: true,
          });

          return;
        }

        this._tripEditorComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });

        break;

      case State.DELETING:
        this._tripEditorComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });

        break;

      case State.ABORTING:
        if (this._typeView === TypeView.DEFAULT) {
          this._tripComponent.shake(resetTripState);
        } else {
          this._tripEditorComponent.shake(resetEditorState);
        }

        break;
    }
  }


  //Other

  _replaceTripToEditor() {
    replace(this._tripEditorComponent, this._tripComponent);
    this._tripEditorComponent.setDatepickers();

    document.addEventListener('keydown', this._onEscKeyDown);

    this._onTypeViewChange(TypeTrip.OLD);
    this._typeView = TypeView.EDITING;
  }

  _replaceEditorToTrip() {
    replace(this._tripComponent, this._tripEditorComponent);

    this._tripEditorComponent.removeDatepickers();

    document.removeEventListener('keydown', this._onEscKeyDown);

    this._typeView = TypeView.DEFAULT;
  }

  resetView() {
    if (this._typeView !== TypeView.DEFAULT) {
      this._replaceEditorToTrip();
    }
  }

}
