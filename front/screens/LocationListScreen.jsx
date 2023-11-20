import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Instance from '../utils/axios';
import {routeMapping } from '../allroutes';
import  { socket } from '../utils/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';


const LocationListScreen = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ permission , setPermission ] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [myLocation, setMyLocation] = useState([]);
  const [user , setUser] = useState(null);
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
          }
      }
      
    )
  } , [] )

  useEffect(() => {
    AsyncStorage.getItem('user').then((value) => {
      setUser(value);
    })
  }, [])

  useEffect(() => {
    socket.emit('busMove' , {
      user : user ,
      location : myLocation
    })
  }, [myLocation]);

  useEffect(() => {
    fetchUserLocations();    
  }, [])

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
  const fetchUserLocations = () => {
    Instance.get('/locations')
    .then((response) => {
      setLocations(response.data);
      setLoading(false);
      setLoading(false);
      setError(false);
    })
    .catch((error) => {
      setLoading(false);
      setError('Error fetching locations. Please try again.');
    })
  }

  const handleLocationPress = (selectedLocation) => {
    navigation.navigate('MapScreen', { selectedLocation });
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationPress(item)}
    >
      <View
      style={styles.locationItemInner}
      >
        <Image
            style={{ width: 30 , height: 30 , marginRight : 10 }}
            source={require('../assets/busfront.png')}
          ></Image>
        <Text style={styles.locationText}>
          {
            routeMapping[item.job].name
          }
        </Text>
        <Image
            style={{ width: 30 , height: 30 , marginRight : 10 , marginLeft : 'auto' }}
            source={require('../assets/right-turn-sign-icon.webp')}
          ></Image>
      </View>
      
      <View
        style={{
          alignItems : 'start',
          justifyContent : 'center',
          borderTopWidth : 1,
          borderTopColor : '#ccc',
          padding : 5
      }}
      >
      <Text>
         Name : {item.name}  
       </Text>
      </View>
      
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchUserLocations} />
      </View>
    );
  }
 

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        keyExtractor={(item) => item._id}
        renderItem={renderLocationItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
 
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  locationItem:{
    marginBottom : 10,
    padding : 15,
    borderRadius : 20,
    marginLeft : 10,
    marginRight : 10,
    shadowColor : '#000',
    shadowOffset : { width : 1 , height : 2 },
    shadowOpacity : 0.26,
    backgroundColor : '#fff',
  },
  locationItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,

  },
  locationText: {
    fontSize: 18,
  },
});

export default LocationListScreen;
