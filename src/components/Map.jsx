/* global google */
import {useEffect} from 'react';
import '../styles/playground.css';

function Map() {
    useEffect(() => {
        async function initMap() {
            //  Request the needed libraries.
            const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
                window.google.maps.importLibrary('maps'),
                window.google.maps.importLibrary('marker'),
            ]);
            // Get the gmp-map element.
            const mapElement = document.querySelector('gmp-map');
            // Get the inner map.
            const innerMap = mapElement.innerMap;
            // Set map options.
            innerMap.setOptions({
                mapTypeControl: false,
                mapTypeId: 'satellite'
            });
            // Add a marker positioned at the map center (Uluru).
            const marker = new AdvancedMarkerElement({
                map: innerMap,
                position: mapElement.center,
                title: 'Park City, Utah'
            });
        }

initMap();
    }, []);
return (
    <gmp-map 
        center="40.3901,-111.3005"
        zoom="9" 
        map-id="DEMO_MAP_ID"
    />)
}


export default Map;