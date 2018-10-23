import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import ListPlaces from './components/ListPlaces.js';
import jwt from 'jwt-simple';

class App extends Component {
  constructor() {
    super();

    this.state = {
      formattedPlace: '',
      user: {},
      places: []
    };
    this.deletePlace = this.deletePlace.bind(this);
    this.logout = this.logout.bind(this);
  }

  logout() {
    window.localStorage.removeItem('token');
    this.setState({ user: {} });
  }

  getUser(token) {
    axios
      .get(`/api/get_user/${token}`)
      .then(response => this.setState({ user: response.data }))
      .then(() => this.getUsersPlaces())
      .catch(err => console.log(err));
  }

  getUsersPlaces() {
    axios
      .get('/api/places')
      .then(response => this.setState({ places: response.data }));
  }

  deletePlace(placeId) {
    axios.delete(`/api/places/${placeId}`).then(() =>
      this.setState({
        places: this.state.places.filter(place => place.id !== placeId)
      })
    );
  }

  addPlace(place) {
    axios.post(`/api/places/${place}`, this.state.user).then(response => {
      this.setState({ places: [...this.state.places, response.data] });
    });
  }

  setupGoogleAPI() {
    let input = document.getElementById('pac-input');
    let autoComplete = new window.google.maps.places.Autocomplete(input);

    autoComplete.addListener('place_changed', () => {
      let place = autoComplete.getPlace();
      this.addPlace(place.formatted_address);
    });
  }

  componentDidMount() {
    this.setupGoogleAPI();

    if (window.localStorage.getItem('token')) {
      this.getUser(window.localStorage.getItem('token'));
    }
  }

  render() {
    return (
      <div>
        {this.state.user.id ? (
          <div>
            Hello! {this.state.user.userName}
            <button onClick={this.logout}>LOGOUT</button>
          </div>
        ) : (
          <form action="/api/github/auth">
            <input type="submit" value="LOGIN WITH GITHUB" />
          </form>
        )}
        <br />
        <br />
        <div id="pac-container">
          <input
            disabled={this.state.user.id ? false : true}
            id="pac-input"
            type="text"
            placeholder="Enter a location"
          />
          <br />
          <br />
          {this.state.user.id ? (
            <ListPlaces
              deleteFunc={this.deletePlace}
              places={this.state.places}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
render(<App />, document.getElementById('root'));
