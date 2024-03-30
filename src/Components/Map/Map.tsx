import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import 'ol/ol.css';
//import {BingMaps, OGCMapTile} from "ol/source";
import {OGCMapTile} from "ol/source";
import {fromLonLat} from 'ol/proj.js';
import * as olExtent from 'ol/extent';
import {LineString} from "ol/geom";
import {City} from "../Game/Game";

interface MapComponentProps {
    onChangeScore: any,
}

let currentCity: City = {} as City;

export const MapComponent = forwardRef((props: MapComponentProps, ref) => {

    useImperativeHandle(ref, () => {
        return {
            updateCity: updateMapCity,
        }
    });

    const updateMapCity = (newCity: City) => {
        currentCity = newCity;
    }

    useEffect(() => {
        // const defaultLayer = new TileLayer({
        //     preload: Infinity,
        //     source: new BingMaps({
        //         key: 'AhUtDOf6zdSsMInl8K998jVZ-4fQkE7lELsHl-LOC1QOa-REIsx7hu4vk2c9jXCC',
        //         imagerySet: 'Aerial'
        //     }),
        // })

        const rasterLayer = new TileLayer({
            source: new OGCMapTile({
                url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
                crossOrigin: '',
            }),
        })

        // const osmLayer = new TileLayer({
        //     preload: Infinity,
        //     source: new OSM(),
        // })

        const defaultCoordinates = [-3.902496927433447, 39.859293765063946];

        const map = new Map({
            target: "map",
            layers: [rasterLayer],
            view: new View({
                center: fromLonLat(defaultCoordinates),
                zoom: 5,
            }),
            interactions: [],
            controls: [],
        });

        // const cityCoordinates = fromLonLat(props.city.coords);
        const leftTopCord = fromLonLat([-14.171880997799288, 44.49539323310686]);
        const rightBottomCord  = fromLonLat([4.820812930361028, 34.902218267988]);
        const extent = olExtent.boundingExtent([leftTopCord, rightBottomCord]);

        map.getView().fit(extent);

        map.on('singleclick', function(event) {
            const coordinate = event.coordinate;
            let lineString = new LineString([coordinate, fromLonLat(currentCity.coords)])

            let length = lineString.getLength();
            let distanceInKms = Math.trunc(Math.round((length / 1000) * 100) / 100);

            props.onChangeScore(distanceInKms);
        })

        return () => {
            map.setTarget()
        };
    }, []);


    return (
        <div id="map" className="mapComponent" />
    )
});
