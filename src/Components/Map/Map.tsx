import React, {useCallback, useContext, useEffect} from 'react';
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
import {GameContext} from "../Game/GameContext";

interface MapComponentProps {
    onChangeScore: any,
}

export const MapComponent = (({onChangeScore}: MapComponentProps) => {

    const gameContext = useContext(GameContext);

    const initMap = useCallback(() =>  {
        console.log('use memo new map');

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

        // const defaultCoordinates = [-3.902496927433447, 39.859293765063946];
        const defaultCoordinates = [-0.1064872527841283, 51.50534817904987];

        console.log('init map');

        const newMap = new Map({
            target: "map",
            layers: [rasterLayer, vectorLayer],
            view: new View({
                center: fromLonLat(defaultCoordinates),
                zoom: 6,
            }),
            interactions: [],
            controls: [],

        });

        console.log('map is loaded');


        if (newMap) {

            newMap.on('loadend', function() {
                console.log('map load end');
                const leftTopCord = fromLonLat([-14.171880997799288, 44.49539323310686]);
                const rightBottomCord  = fromLonLat([4.820812930361028, 34.902218267988]);
                const extent = olExtent.boundingExtent([leftTopCord, rightBottomCord]);
                let previousResolution = newMap.getView().getResolution();
                newMap.getView().fit(extent);
                newMap.getView().setResolution(previousResolution);
            })

            newMap.on('singleclick', function (event) {
                console.log('single click');
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
        }

        return newMap;
    }, [gameContext, onChangeScore]);


    const newMap2 = React.useMemo(() => {
        return initMap();
    }, [initMap]);

    // setMap(newMap);

    newMap2.setTarget("map");

    console.log(typeof newMap2);
    console.log(newMap2.getView());
    console.log('get target');
    console.log(newMap2.getTarget());

    useEffect(() => {
        console.log('use Effect');


    }, );

    return (
        <div id="map" className="mapComponent" />
    )
});
