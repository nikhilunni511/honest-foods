import React, { Component, Fragment } from "react";
import * as axios from "axios";
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

export default class App extends Component {

  constructor() {
    super()
    this.state = {
      address: "",
      enableMap: false,
      origin: [0, 0],
      coordinates: []
    }
  }

  componentDidMount = () => {
    !!this.state.enableMap && this.loadMap()
  }

  getStores = async () => {
    axios.get('http://localhost:5000/api/v1/stores')
        .then(response => {
          console.log(response.data.data[0])
          if(!!response.data.success){
            const coordinates = response.data.data[0].location.coordinates;
            console.log(coordinates)
            const tempArray = [];
            for(let i = 0; i < coordinates.length; i+=2) {
              tempArray.push([coordinates[i], coordinates[i+1]]);
            }
            console.log("this is ok")
            this.setState({coordinates: tempArray, origin: [coordinates[0], coordinates[1]], enableMap: true}, () => this.loadMap(this.state))
          }
        });
  }

  loadMap = async ({coordinates, origin}) => {
    console.log("load map")
    mapboxgl.accessToken = 'pk.eyJ1IjoibmlraGlsdW5uaTUxMSIsImEiOiJja281amQxMXIwNTJqMm9sdHNpMjRta3p3In0.xVn-T1KhlrIbs2V5ENZXRQ';
    const map = new mapboxgl.Map({
      container: 'map', 
      style: 'mapbox://styles/mapbox/light-v10',
      center: origin, // starting position
      zoom: 11 // starting zoom
      });
      map.on('load', function () {
        console.log("map loading")
        console.log(origin, "\n", coordinates)
        map.addSource('maine', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              // These coordinates outline Maine.
              'coordinates': [coordinates]
            }
          }
        });
        map.addLayer({
          'id': 'maine',
          'type': 'fill',
          'source': 'maine', // reference the data source
          'layout': {},
          'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5
          }
        });
        // Add a black outline around the polygon.
        map.addLayer({
          'id': 'outline',
          'type': 'line',
          'source': 'maine',
          'layout': {},
          'paint': {
            'line-color': '#000',
            'line-width': 3
          }
        });
      });
  }

  submitForm = async (e) => {
    e.preventDefault()
    this.getStores();
  }

  changeAddress = async (e) => {
    this.setState({ address: e.target.value || '' })
  }

  render() {
    return (
      <Fragment>
        <div className="container my-3">
          <h1 className="display-4 text-center">
            Enter Location
    </h1>

          <form id="store-form" className="mb-4">
            <div className="form-group">
              <label htmlFor="store-address">Store Address</label>
              <input type="text" id="store-address" className="form-control" value={this.state.address} placeholder="Search..." onChange={(e) => this.changeAddress(e)} />
            </div>
            <button type="submit" className="btn btn-primary" onClick={(e) => this.submitForm(e)}>Submit</button>
            <a href="index.html" className="btn btn-secondary">Back</a>
          </form>
          {this.state.enableMap && <div
            id="map"
            style={{ width: '100%', height: '500px', borderRadius: '5px' }}
          >

          </div>}
          {!this.enableMap && <div><p>Not found</p></div>}
        </div>
      </Fragment>
    )
  }
}