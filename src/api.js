const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(linkData, authorization, data) {
    this._linkData = linkData;
    this._authorization = authorization;
    this._data = data;
  }

  getData() {
    return this._load({url: this._data})
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._linkData}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  updateData(trip) {
    return this._load({
      url: `points/${trip.id}`,
      method: Method.PUT,
      body: JSON.stringify(trip),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  addData(trip) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(trip),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  deleteData(trip) {
    return this._load({
      url: `points/${trip.id}`,
      method: Method.DELETE,
    });
  }


  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
