//View
import TripSortView from '../view/trip-sort.js';
import TripListView from '../view/trip-list.js';
import NoTripListView from '../view/trip-empty-list.js';

//Presenter
import TripPresenter from '../presenter/trip.js';
import NewTripPresenter from '../presenter/new-trip.js';

//Supporting const
import { SortType, State, TypeTrip, RenderPosition } from '../const/const.js';

//Supporting function
import { render, remove, replace } from '../utils/render.js';
import { sortTrips } from '../utils/filtering-sorting.js';

////


export default class TripBoard {
  constructor(tripsContainer, onViewUpdateData, onViewAction) {

    //Callback
    this._onViewUpdateData = onViewUpdateData;
    this._onViewAction = onViewAction;

    //Variable
    this._currentSortType = SortType.DAY;

    //Data
    this._tripsData = null;
    this._sortedTripsData = null;
    this._offersData = null;
    this._destinationsData = null;

    //Container
    this._tripsContainer = tripsContainer;

    //Components
    this._tripSortComponent = null;
    this._tripListComponent = null;
    this._noTripComponent = null;

    //Handler
    this._onTypeViewChange = this._onTypeViewChange.bind(this);
    this._onChangeSortType = this._onChangeSortType.bind(this);


    //Presenter
    this._tripPresenter = {};
    this._newTripPresenter = null;

  }


  init(tripsData, offersData, destinationsData) {
    this._tripsData = tripsData;
    this._sortedTripsData = this._getSortTrips();
    this._offersData = offersData;
    this._destinationsData = destinationsData;
  }


  //Render

  renderTripBoard() {
    if (this._tripsData.length === 0) {
      this.removeTrips();

      this.renderTripSort(State.DISABLED);
      this._renderTripList();
      this._renderNoTripList();

      return;
    }

    if (this._noTripComponent !== null) {
      this._removeNoTripList();
    }

    this.renderTripSort();
    this._renderTripList();
    this.renderTrips();
  }

  renderTripSort(state = State.DEFAULT) {
    const prevTripSortComponent = this._tripSortComponent;

    this._tripSortComponent = new TripSortView(this._currentSortType, state);
    this._tripSortComponent.setChangeSortTypeHandler(this._onChangeSortType);

    if (prevTripSortComponent === null) {
      render(this._tripsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripSortComponent, prevTripSortComponent);
    remove(prevTripSortComponent);
  }

  _renderTripList() {
    if (this._tripListComponent !== null) {
      return;
    }

    this._tripListComponent = new TripListView();

    render(this._tripsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip(trip) {
    const newTrip = new TripPresenter(this._tripListComponent, this._onViewUpdateData, this._onTypeViewChange);
    newTrip.init(trip, this._offersData, this._destinationsData);
    newTrip.renderTrip();
    this._tripPresenter[trip.id] = newTrip;
  }

  renderTrips() {
    this._sortedTripsData.forEach((trip) => this._renderTrip(trip));
  }

  _renderNoTripList() {
    if (this._noTripComponent !== null) {
      return;
    }

    this._noTripComponent = new NoTripListView();

    render(this._tripsContainer, this._noTripComponent, RenderPosition.BEFOREEND);
  }

  renderNewTrip() {
    this._newTripPresenter = new NewTripPresenter(this._tripListComponent, this._onViewUpdateData, this._onTypeViewChange, this._onViewAction);
    this._newTripPresenter.init(this._offersData, this._destinationsData);
    this._newTripPresenter.renderNewTrip();
  }


  //Remove

  _removeNoTripList() {
    remove(this._noTripComponent);
    this._noTripComponent = null;
  }

  removeTripBoard() {
    this.removeTrips();

    this._removeNewTripEditor();

    remove(this._tripSortComponent);
    this._tripSortComponent = null;

    remove(this._tripListComponent);
    this._tripListComponent = null;

    remove(this._noTripComponent);
    this._noTripComponent = null;
  }

  removeTrips() {
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.removeTrip());
    this._tripPresenter = {};
  }

  _removeNewTripEditor() {
    if (this._newTripPresenter !== null) {
      this._newTripPresenter.removeNewTripEditor();
      this._newTripPresenter = null;
    }
  }

  //Handler

  _onChangeSortType(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._sortedTripsData = this._getSortTrips();

    this.removeTrips();
    this.renderTrips();
  }

  _onTypeViewChange(typeTrip) {
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => {
        presenter.resetView();
      });

    if (typeTrip === TypeTrip.OLD) {
      this._removeNewTripEditor();
    }
  }


  //Get

  _getSortTrips() {
    return sortTrips[this._currentSortType](this._tripsData);
  }


  //State

  setStaetViewNewTrip(state) {
    this._newTripPresenter.setStateView(state);
  }

  setStaetViewTrip(update, state) {
    this._tripPresenter[update.id].setStateView(state);
  }


  //Other

  updateTrip(updateData) {
    this._tripPresenter[updateData.id].init(updateData, this._offersData, this._destinationsData);
    this._tripPresenter[updateData.id].renderTrip();
  }

}
