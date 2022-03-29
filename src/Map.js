
import React, { useEffect, useState } from 'react';
import { Circle, MapContainer, Polyline, TileLayer } from 'react-leaflet';
import GeoUtil from "leaflet-geometryutil";
import 'leaflet/dist/leaflet.css';


const pathToDraw25 = require('./dataset/randomPath25.json');
const pathToDraw250 = require('./dataset/randomPath250.json');
const pathToDraw1000 = require('./dataset/randomPath1000.json');

const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

function Map({ numberSelected }) {
  const [results, setResults] = useState([]);

  const canterMap = [41.890595072868464, 12.49228598077348];

  const containerStyle = {
    width: '90vw',
    height: '100vh',
  };

  useEffect(() => {
    setResults([]);
  }, [numberSelected]);


  const fillBlueOptions = { fillColor: 'blue' };

  const getPoints = (numberOfPoints) => {
    return numberOfPoints === 25 ? pathToDraw25 : numberOfPoints === 250 ? pathToDraw250 : pathToDraw1000;
  };

  let pathToDrawOrdered = getPoints(numberSelected).coordinates.map(point => { return point.map(p => { return [p[1], p[0]] }) });

  //function to get an array from array of arrays  
  function flatten(arr) {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }

  //get couple of coordinates
  let points = flatten(pathToDrawOrdered).reduce(function (result, value, index, array) {
    if (index % 2 === 0)
      result.push(array.slice(index, index + 2));
    return result;
  }, []);

  const getSegment = (latlng, polyline) => {
    // get layerpoint of user click
    const latlngs = polyline._latlngs;
    let segments = [];
    // get segments of polyline
    for (let i = 0; i < latlngs.length - 1; i++) {
      const pointToLineDistance = GeoUtil.distanceSegment(
        polyline._map,
        latlng,
        latlngs[i],
        latlngs[i + 1]
      );

      segments.push({
        index: i,
        pointToLineDistance,
        segment: [latlngs[i], latlngs[i + 1]]
      });
    }
    // sort segments by shortest distance
    segments.sort((a, b) =>
      a.pointToLineDistance < b.pointToLineDistance ? -1 : 1
    );
    // return first entry, which has shortest distance
    const shortestSegment = segments[0];
    return shortestSegment;
  };

  //function to get if an object is equal to another object
  function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };


  return (
    <MapContainer center={canterMap} zoom={6} style={containerStyle} attributionControl={false}>
      <TileLayer
        url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}@2x.png?key=nlNVO6EMWC90nbAoYLNp"
      />
      {pathToDrawOrdered.map((el, index) =>
        <Polyline pathOptions={{ color: colorArray[index] }} key={index} positions={el} eventHandlers={{
          click: (e) => {
            const closest = getSegment(e.latlng, e.sourceTarget);
            setResults([...results, closest]);
          }
        }} />
      )}
      {points.map((el, index) =>
        <Circle center={el} pathOptions={fillBlueOptions} key={index} radius={50} />
      )}
      {results.map((r, i) => (
        <Polyline key={`polyline-${i}`} positions={r.segment} color="green" eventHandlers={{
          click: (e) => {
            const closest = getSegment(e.latlng, e.sourceTarget);
            setResults([...results].filter(el => !isEqual(el.segment, closest.segment)));
          }
        }}/>
      ))}
    </MapContainer>
  )
}

export default Map;