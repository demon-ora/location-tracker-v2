import React, { useEffect, useState, useRef } from 'react';
import { View , Text, Image } from 'react-native';
import MapView, { Marker, Polyline,animateToRegion,AnimatedRegion } from 'react-native-maps';
import * as Location from 'expo-location';
import Compass from '../models/Compass';
import Cards from '../models/Card';
import * as AllRoutes from '../allroutes.js';

import Instance from '../utils/axios.js';
import { socket } from '../utils/socket.js';
const MapScreen = ({ route }) => {
  const { selectedLocation  } = route.params;
  const [ busLocation , setBusLocation ] = useState([]);
  const [ permission , setPermission ] = useState(false);
  const [myLocation, setMyLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardShow , setCardShow] = useState(true);
  const mapRef = useRef(null);
  const [isRandom , setIsRandom] = useState(false);
  const [moveable , setMoveable] = useState(
    {
      latitude: 27.588139427118428,
      longitude: 85.32209020043484,
    }
  );

  useEffect(() => {
    AllRoutes.routeMapping.map((route) => {
      let jobid = parseInt(selectedLocation.job);
      let user = selectedLocation.email;
      socket.on('busMove' , (data) => {
        if(data.user === user){
          setBusLocation({
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          })
        }
      })
      setBusLocation({
        latitude: route.latitude,
        longitude: route.longitude,
      })
      if(route.id === jobid){
       setRecords( 
        AllRoutes.RouteLookup[route.code]
      )
      }
    })
  }, [selectedLocation])
  

  

  // random demo movements
  function  startmoving(rand){
    const len = records.length;
    let i = rand;
    let front = true ;
    setInterval(() => {
      if(i == len-1){
        front = false;
      }
      if(i == 0){
        front = true;
      }
      if(front){
        i++;
      }
      else{
        i--;
      }
      setBusLocation(records[i]);
    }, 100);
  }

 
  

  const [ records , setRecords ] = useState([])
  useEffect(() => {
   if(isRandom){
    if(records.length > 0){
      const len = records.length;
      const rand = Math.floor(Math.random() * len);
      setBusLocation(records[rand]);
      // for random movement
        setBusLocation(records[rand]);
      if(records[len]){
        // startmoving(rand)
      }
      startmoving(rand);
    }
   }
  }, [records , isRandom])

  useEffect(() => {
    getCurrentLocation();
  }, [route]);

  useEffect( () => {
    Location.getBackgroundPermissionsAsync().then((status) => { } );
    Location.hasServicesEnabledAsync().then((status) => {} );
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
          if(location){
            setMyLocation(
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }
            )
          //  if(location.mocked){
          //   console.log(
          //     {
          //       "latitude": location.coords.latitude,
          //       "longitude": location.coords.longitude,
          //     }
              
          //   );
          //   Instance.post('/write-to-file' , {
          //     "latitude": location.coords.latitude,
          //     "longitude": location.coords.longitude,
          //   })
          //   .then((res) => {
          //     console.log(res.data);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   })
          //  }
          }
      }
      
    )
  } , [] )


  useEffect(() => {
    getLocationPermission();
  } , []);
 async function getLocationPermission() {
   const { status } = await Location.requestForegroundPermissionsAsync();
   if (status !== 'granted') {
     return;
   }
   if(status === 'granted'){
     getCurrentLocation();
     setPermission(true);
   }
 }

  
  async function getCurrentLocation() {
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: 1 });
    const { latitude, longitude } = coords;
    setMyLocation
    ({
      latitude: latitude,
      longitude: longitude,
    })
 
    setLoading(false);
  }

  return <>
  {
    selectedLocation.latitude && selectedLocation.longitude && records && myLocation && busLocation  ?   
    <View style={{ flex: 1 }}>
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {myLocation.latitude && myLocation.longitude && (
        <Marker
          coordinate={{
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
          }}
          title="Your Location"
          description={`Latitude: ${myLocation.latitude}, Longitude: ${myLocation.longitude}`}
        >
          <Compass />
          </Marker>
      )}

     {
      busLocation.latitude && busLocation.longitude &&
       <Marker
       coordinate={{
         latitude: busLocation.latitude,
         longitude: busLocation.longitude,
       }}
       title="Selected Location"
       description={`Latitude: ${busLocation.latitude}, Longitude: ${busLocation.longitude}`}
     >
       <Image
       style={{ 
         height: 30,
         width: 30,
       }}
       source={require('../assets/bus.png')
     }
     />
       </Marker>

     }
        <Polyline
        coordinates={records}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[

          '#7F0000',
        ]}
        strokeWidth={6}
      />
    </MapView>
    {
      cardShow ? <Cards selectedLocation={selectedLocation} setCardShow={setCardShow} /> : null
    }
  </View> : 'Loading' 
  }
  </>
};

export default MapScreen;
