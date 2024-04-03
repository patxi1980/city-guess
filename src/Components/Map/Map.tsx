import React, { useContext, useEffect, useRef } from 'react';
import {Feature, Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import {OGCMapTile} from "ol/source";
import {fromLonLat} from 'ol/proj.js';
import * as olExtent from 'ol/extent';
import {LineString, Point} from "ol/geom";
import {Icon, Style} from 'ol/style.js';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {GameContext, GameContextType} from "../Game/GameContext";

interface MapComponentProps {
    onChangeScore: any,
}

const initMap = (gameContext: GameContextType, onChangeScore: any) =>  {
    const rasterLayer = new TileLayer({
        source: new OGCMapTile({
            url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
            crossOrigin: '',
        }),
    })

    const iconFeatureUser = new Feature({
        geometry: new Point([0, 0]),
        name: 'icon-user'
    });

    const iconStyleUser = new Style({
        image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        }),
    });

    const iconFeatureCity = new Feature({
        geometry: new Point([0, 0]),
        name: 'icon-city'
    });

    const iconStyleCity = new Style({
        image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        }),
    });

    iconFeatureUser.setStyle(iconStyleUser);
    iconFeatureCity.setStyle(iconStyleCity);

    const vectorSource = new VectorSource({
        features: [iconFeatureUser, iconFeatureCity],
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    const defaultCoordinates = [-3.902496927433447, 39.859293765063946];

    const newMap = new Map({
        layers: [rasterLayer, vectorLayer],
        view: new View({
            center: fromLonLat(defaultCoordinates),
            zoom: 6,
        }),
        interactions: [],
        controls: [],

    });

    newMap.on('loadend', function() {
        const leftTopCord = fromLonLat([-14.171880997799288, 44.49539323310686]);
        const rightBottomCord  = fromLonLat([4.820812930361028, 34.902218267988]);
        const extent = olExtent.boundingExtent([leftTopCord, rightBottomCord]);
        newMap.getView().fit(extent);
    })

    newMap.on('singleclick', function (event) {
        console.log('single click');
        console.log(gameContext);
        let currentCity = gameContext.game.currentCity;
        const coordinate = event.coordinate;
        console.log(gameContext.game.currentCity.coords.toString());
        let lineString = new LineString([coordinate, fromLonLat(currentCity.coords)])

        iconFeatureUser.setGeometry(new Point(coordinate));
        iconFeatureCity.setGeometry(new Point(fromLonLat(currentCity.coords)));

        let length = lineString.getLength();
        let distanceInKms = Math.trunc(Math.round((length / 1000) * 100) / 100);

        onChangeScore(distanceInKms);
    })

    return newMap;
};

export const MapComponent = (({onChangeScore}: MapComponentProps) => {

    const gameContext = useContext(GameContext);
    const mapElement = useRef<HTMLDivElement>(null!);

    let newMap: any = null;
    newMap = React.useMemo(() => {
        if (newMap === null) {
            return initMap(gameContext, onChangeScore);
        }
        return newMap;
    }, [newMap, gameContext, onChangeScore]);

    useEffect(() => {
        if (gameContext.game.cityPos === 0) {
            newMap.setTarget(mapElement.current);
        }
    }, );

    return (
        <div id="map" className="mapComponent" ref={mapElement} />
    )
});
