//Api
import Api from '../api.js';

//Model
import TripsModel from '../model/trips.js';
import DestinationsModel from '../model/destinations.js';
import OffersModel from '../model/offers.js';

//View
import TripCityListView from '../view/trip-city-list.js';
import TripDateGapView from '../view/trip-date-gap.js';
import TripCostView from '../view/trip-cost.js';
import NewTripButtonView from '../view/new-trip-button.js';
import TripFilterView from '../view/trip-filter.js';
import MainMenuView from '../view/main-menu.js';
import StatisticsView from '../view/statistics.js';
import LoadingView from '../view/loading.js';

//Presenter
import TripBoardPresenter from '../presenter/trip-board.js';

//Supporting const
import { FilterType, MenuType, State, UpdateType, UserAction, ViewAction, AUTHORIZATION, LINK_DATA, DATA, RenderPosition } from '../const/const.js';

//Supporting function
import { render, remove, replace } from '../utils/render.js';
import { filterTrips } from '../utils/filtering-sorting.js';

////


export default class App {
  constructor() {

    //Variable
    this._currentFilterType = FilterType.EVERYTHING;
    this._currentMenuType = MenuType.TABLE;
    this._isLoading = true;

    //Data

    this._tripsData = null;
    this._filteredTripsData = null;
    this._offersData = null;
    this._destinationsData = null;

    //Container
    this._tripMainContainer = document.querySelector('.trip-main');
    this._tripInfoContainer = document.querySelector('.trip-info');
    this._tripInfoMainContainer = document.querySelector('.trip-info__main');
    this._tripControlFilterContainer = document.querySelector('.trip-controls__filters');
    this._tripControlNavigationContainer = document.querySelector('.trip-controls__navigation');
    this._tripBoardContainer = document.querySelector('.trip-events');

    //Components
    this._tripCityListComponent = null;
    this._tripDateGapComponent = null;
    this._tripCostComponent = null;
    this._newTripButtonComponent = null;
    this._tripFilterComponent = null;
    this._mainMenuComponent = null;
    this._statisticsComponent = null;
    this._loadingComponent = null;

    //Handler
    this._onClickNewTripButton = this._onClickNewTripButton.bind(this);
    this._onChangeTypeTripFilter = this._onChangeTypeTripFilter.bind(this);
    this._onChangeTypeMenu = this._onChangeTypeMenu.bind(this);
    this._onViewUpdateData = this._onViewUpdateData.bind(this);
    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);

    //Api
    this._apiTrips = null;
    this._apiDestinations = null;
    this._apiOffers = null;

    //Model
    this._tripsModel = null;
    this._offersModel = null;
    this._destinationsModel = null;

    //Function
    this._createModels();

    //Presenter
    this._tripBoardPresenter = new TripBoardPresenter(this._tripBoardContainer, this._onViewUpdateData, this._onViewAction);

  }


  //Render

  renderApp() {
    this._renderTripCityList();
    this._renderTripDateGap();
    this._renderTripCost();

    if (this._isLoading) {
      this._renderTripFilter(State.DISABLED);
      this._renderNewTripButton(State.DISABLED);
      this._renderMainMenu(State.DISABLED);
      this._renderLoading();
      return;
    }

    this._removeLoading();

    if (this._currentMenuType === MenuType.TABLE) {
      this._renderTripFilter();
      this._renderNewTripButton();
      this._renderMainMenu();

      this._removeStatistics();

      this._tripBoardPresenter.init(this._filteredTripsData, this._offersData, this._destinationsData);
      this._tripBoardPresenter.renderTripBoard();

      this._toggleLine();

      return;
    }

    this._renderTripFilter(State.DISABLED);
    this._renderNewTripButton(State.DISABLED);
    this._renderMainMenu(State.DISABLED);

    this._tripBoardPresenter.removeTripBoard();

    this._renderStatistics();

    this._toggleLine();
  }

  _renderStatistics() {
    const prevStatisticsComponent = this._statisticsComponent;

    this._statisticsComponent = new StatisticsView(this._tripsData);

    if (prevStatisticsComponent === null) {
      render(this._tripBoardContainer, this._statisticsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._statisticsComponent, prevStatisticsComponent);
    remove(prevStatisticsComponent);
  }

  _renderLoading() {
    if (this._loadingComponent === null) {
      this._loadingComponent = new LoadingView();
      render(this._tripBoardContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    render(this._tripBoardContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripCityList() {
    const prevTripCityListComponent = this._tripCityListComponent;

    this._tripCityListComponent = new TripCityListView(this._tripsData);

    if (prevTripCityListComponent === null) {
      render(this._tripInfoMainContainer, this._tripCityListComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripCityListComponent, prevTripCityListComponent);
    remove(prevTripCityListComponent);
  }

  _renderTripDateGap() {
    const prevTripDateGap = this._tripDateGapComponent;

    this._tripDateGapComponent = new TripDateGapView(this._tripsData);

    if (prevTripDateGap === null) {
      render(this._tripInfoMainContainer, this._tripDateGapComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._tripDateGapComponent, prevTripDateGap);
    remove(prevTripDateGap);
  }

  _renderTripCost() {
    const prevTripCost = this._tripCostComponent;

    this._tripCostComponent = new TripCostView(this._tripsData);

    if (prevTripCost === null) {
      render(this._tripInfoContainer, this._tripCostComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._tripCostComponent, prevTripCost);
    remove(prevTripCost);
  }

  _renderNewTripButton(state = State.DEFAULT) {
    const prevNewTripButtonComponent = this._newTripButtonComponent;

    this._newTripButtonComponent = new NewTripButtonView(state);
    this._newTripButtonComponent.setClickNewTripButtonHandler(this._onClickNewTripButton);

    if (prevNewTripButtonComponent === null) {
      render(this._tripMainContainer, this._newTripButtonComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._newTripButtonComponent, prevNewTripButtonComponent);
    remove(prevNewTripButtonComponent);
  }

  _renderTripFilter(state = State.DEFAULT) {
    const prevTripFilter = this._tripFilterComponent;

    this._tripFilterComponent = new TripFilterView(this._tripsData, this._currentFilterType, state);
    this._tripFilterComponent.setChangeTypeFilterHandler(this._onChangeTypeTripFilter);

    if (prevTripFilter === null) {
      render(this._tripControlFilterContainer, this._tripFilterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._tripFilterComponent, prevTripFilter);
    remove(prevTripFilter);
  }

  _renderMainMenu(state = State.DEFAULT) {
    const prevMainMenu = this._mainMenuComponent;

    this._mainMenuComponent = new MainMenuView(this._currentMenuType, state);
    this._mainMenuComponent.setChangeTypeMenuHandler(this._onChangeTypeMenu);

    if (prevMainMenu === null) {
      render(this._tripControlNavigationContainer, this._mainMenuComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._mainMenuComponent, prevMainMenu);
    remove(prevMainMenu);
  }


  //Remove

  _removeStatistics() {
    remove(this._statisticsComponent);
    this._statisticsComponent = null;
  }

  _removeLoading() {
    remove(this._loadingComponent);
  }

  //Handler

  _onClickNewTripButton() {
    this._tripBoardPresenter.renderNewTrip();
  }

  _onChangeTypeTripFilter(typeFilter) {
    if (typeFilter === this._currentFilterType) {
      return;
    }

    this._currentFilterType = typeFilter;
    this._filteredTripsData = this._getFilteredTripsData();

    this._renderTripFilter();

    this._tripBoardPresenter.init(this._filteredTripsData, this._offersData, this._destinationsData);
    this._tripBoardPresenter.removeTripBoard();
    this._tripBoardPresenter.renderTripBoard();
  }

  _onChangeTypeMenu(typeMenu) {
    if (typeMenu === this._currentMenuType) {
      return;
    }

    this._currentMenuType = typeMenu;
    this._toggleLine();

    if (this._currentMenuType === MenuType.TABLE) {
      this._renderTripFilter();
      this._renderNewTripButton();
      this._renderMainMenu();

      this._removeStatistics();

      this._tripBoardPresenter.init(this._filteredTripsData, this._offersData, this._destinationsData);
      this._tripBoardPresenter.renderTripBoard();

      return;
    }

    this._tripBoardPresenter.removeTripBoard();

    this._renderTripFilter(State.DISABLED);
    this._renderNewTripButton(State.DISABLED);
    this._renderMainMenu(State.DISABLED);

    this._renderStatistics();
  }


  //Model

  _createModels() {
    this._apiTrips = new Api(LINK_DATA, AUTHORIZATION, DATA.TRIPS);
    this._apiDestinations = new Api(LINK_DATA, AUTHORIZATION, DATA.DESTINATIONS);
    this._apiOffers = new Api(LINK_DATA, AUTHORIZATION, DATA.OFFERS);

    this._tripsModel = new TripsModel();
    this._tripsModel.addObserver(this._onModelEvent);
    this._offersModel = new OffersModel();
    this._destinationsModel = new DestinationsModel();


    Promise.all([this._apiTrips.getData(), this._apiDestinations.getData(), this._apiOffers.getData()])
      .then(([tripsData, destinationsData, offersData]) => {
        this._destinationsModel.setData(destinationsData);
        this._offersModel.setData(offersData);
        this._tripsModel.setData(UpdateType.INIT, tripsData);
      })
      .catch(() => {
        this._destinationsModel.setData([]);
        this._offersModel.setData([]);
        this._tripsModel.setData(UpdateType.INIT, []);
      });
  }

  _onModelEvent(updateType, data) {
    this._tripsData = this._getTripsData();
    this._filteredTripsData = this._getFilteredTripsData();
    this._offersData = this._getOffersData();
    this._destinationsData = this._getDestinationsData();

    switch (updateType) {
      case UpdateType.PATCH:
        this._tripBoardPresenter.init(this._filteredTripsData, this._offersData, this._destinationsData);
        this._tripBoardPresenter.updateTrip(data);
        break;

      case UpdateType.MINOR:
        this._renderTripCityList();
        this._renderTripDateGap();
        this._renderTripFilter();
        this._renderTripCost();

        this._tripBoardPresenter.init(this._filteredTripsData, this._offersData, this._destinationsData);
        this._tripBoardPresenter.removeTripBoard();
        this._tripBoardPresenter.renderTripBoard();

        break;

      case UpdateType.INIT:
        this._isLoading = false;
        this._removeLoading();
        this.renderApp();

        break;
    }
  }


  //Callback

  _onViewUpdateData(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TRIP:
        this._tripBoardPresenter.setStaetViewTrip(update, State.SAVING);

        this._apiTrips.updateData(update)
          .then((response) => {
            this._tripsModel.updateData(updateType, response);
          })
          .catch(() => {
            this._tripBoardPresenter.setStaetViewTrip(update, State.ABORTING);
          });
        break;

      case UserAction.ADD_TRIP:
        this._tripBoardPresenter.setStaetViewNewTrip(State.SAVING);

        this._apiTrips.addData(update)
          .then((response) => {
            this._tripsModel.addData(updateType, response);
          })
          .catch(() => {
            this._tripBoardPresenter.setStaetViewNewTrip(State.ABORTING);
          });
        break;

      case UserAction.DELETE_TRIP:
        this._tripBoardPresenter.setStaetViewTrip(update, State.DELETING);

        this._apiTrips.deleteData(update)
          .then(() => {
            this._tripsModel.deleteData(updateType, update);
          })
          .catch(() => {
            this._tripBoardPresenter.setStaetViewTrip(update, State.ABORTING);
          });
        break;
    }
  }

  _onViewAction(viewAction) {
    switch (viewAction) {
      case ViewAction.OPEN_NEW_TRIP:
        this._renderNewTripButton(State.DISABLED);
        break;

      case ViewAction.CLOSE_NEW_TRIP:
        this._renderNewTripButton(State.DEFAULT);
        break;
    }
  }


  //Get

  _getTripsData() {
    return this._tripsModel.getData();
  }

  _getFilteredTripsData() {
    const tripsData = this._tripsModel.getData();
    return filterTrips[this._currentFilterType](tripsData);
  }

  _getDestinationsData() {
    return this._destinationsModel.getData();
  }

  _getOffersData() {
    return this._offersModel.getData();
  }

  //Other

  _toggleLine() {
    if (this._currentMenuType === MenuType.TABLE) {
      document.querySelector('.page-main .page-body__container').classList.remove('page-body__container--line-hidden');
      return;
    }

    document.querySelector('.page-main .page-body__container').classList.add('page-body__container--line-hidden');
  }

}
