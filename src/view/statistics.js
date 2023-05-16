//Parents
import AbstractView from './abstract.js';

//Supporting const
import { TYPE_EVENT } from '../const/const.js';

//Supporting function
import { getDifferenceDates, getStringDate } from '../utils/date.js';

//Library
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

////


//Function

const BAR_HEIGHT = 55;

const getTotalDurationByType = (tripsData, typeTrip) => {
  return tripsData.slice().filter(({ type }) => type === typeTrip).reduce((totalPrice, { date_to, date_from }) => totalPrice + getDifferenceDates(date_to, date_from), 0);
};

const getDurationStatistics = (tripsData) => {
  const durationStatistics = TYPE_EVENT.map((type) => {
    return {
      type,
      duration: getTotalDurationByType(tripsData, type),
    };
  });

  return durationStatistics.filter(({ duration }) => duration > 0).sort((a, b) => b.duration - a.duration);
};

const getTotalBasePriceByType = (tripsData, typeTrip) => {
  return tripsData.slice().filter(({ type }) => type === typeTrip).reduce((totalPrice, item) => totalPrice + item.base_price, 0);
};

const getBasePriceStatistics = (tripsData) => {
  const priceStatistics = TYPE_EVENT.map((type) => {
    return {
      type,
      price: getTotalBasePriceByType(tripsData, type),
    };
  });

  return priceStatistics.filter(({ price }) => price > 0).sort((a, b) => b.price - a.price);
};

const getTotalCountByType = (tripsData, typeTrip) => {
  return tripsData.slice().filter(({ type }) => type === typeTrip).length;
};

const getCountStatistics = (tripsData) => {
  const countStatistics = TYPE_EVENT.map((type) => {
    return {
      type,
      count: getTotalCountByType(tripsData, type),
    };
  });

  return countStatistics.filter(({ count }) => count > 0).sort((a, b) => b.count - a.count);
};


//Chart

const renderMoneyChart = (moneyCtx, tripsData) => {
  const moneyStatistics = getBasePriceStatistics(tripsData);
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: moneyStatistics.map(({ type }) => type.toUpperCase()),
      datasets: [{
        data: moneyStatistics.map(({ price }) => price),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 35,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderCountChart = (countCtx, tripsData) => {
  const countStatistics = getCountStatistics(tripsData);
  return new Chart(countCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: countStatistics.map(({ type }) => type.toUpperCase()),
      datasets: [{
        data: countStatistics.map(({ count }) => count),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'COUNT',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 35,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeChart = (timeCtx, tripsData) => {
  const timeStatistics = getDurationStatistics(tripsData);
  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: timeStatistics.map(({ type }) => type.toUpperCase()),
      datasets: [{
        data: timeStatistics.map(({ duration }) => duration),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getStringDate(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 35,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 100,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


//Template

const createStatisticsTemplate = () => {
  return `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item">
    <canvas class="statistics__chart statistics__chart--money" id="money" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart statistics__chart--count" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart statistics__chart--time" id="time-spend" width="900"></canvas>
  </div>
</section>`;
};


export default class Statistics extends AbstractView {
  constructor(tripsData) {
    super();

    //Chart
    this._priceChart = null;
    this._countChart = null;
    this._timeChart = null;

    //Data
    this._tripsData = tripsData;

    //Function
    this._setCharts();

  }

  getTemplate() {
    return createStatisticsTemplate();
  }


  //Chart

  _setCharts() {
    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const countCtx = this.getElement().querySelector('.statistics__chart--count');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');
    moneyCtx.height = BAR_HEIGHT * 5;
    countCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;
    this._priceChart = renderMoneyChart(moneyCtx, this._tripsData);
    this._priceChart = renderCountChart(countCtx, this._tripsData);
    this._priceChart = renderTimeChart(timeCtx, this._tripsData);
  }

}
