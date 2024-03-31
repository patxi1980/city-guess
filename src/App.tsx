import React from 'react';
import './App.css';
import jsonCities from './cities.json';

import {City, GameComponent} from "./Components/Game/Game";

let cities = jsonCities;

const prepareCities = (array: City[]) =>  {
//    array.sort(() => Math.random() - 0.5);

    let length = array.length;
    for (let i = length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    cities = cities.slice(0, 10);

    return cities;
}

cities = prepareCities(cities);

function App() {
  return (
      <div className="App">
        <GameComponent cities={cities} />
        <a href='https://mxd.codes/articles/how-to-create-a-web-map-with-open-layers-and-react'>Guide for open layers and react</a>
      </div>
  );
}

export default App;
