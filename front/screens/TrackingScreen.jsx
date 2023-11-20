import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrackingScreen = () => {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setUserLocation({ latitude, longitude });

      // Save the location to the server
      saveLocation();
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  useEffect(() => {
    // Call getLocation initially
    getLocation();

    // Set up an interval to call getLocation every 10 seconds
    const locationInterval = setInterval(getLocation, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(locationInterval);
  }, []);

  const saveLocation = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (userLocation) {
      try {
        const response = await fetch('http://localhost:3000/locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify(userLocation),
        });

        if (response.ok) {
          console.log('Location saved successfully');
        } else {
          console.error('Error saving location to the backend');
        }
      } catch (error) {
        console.error('Network error while saving location:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');

      const response = await fetch('http://localhost:3000/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Logout was successful, navigate to the login screen
        navigation.navigate('Login');
      } else {
        console.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Network error while logging out:', error);
    }
  };

  return (
    <View>
      <MapView
        style={{ width: '100%', height: 300 }}
        region={{
          latitude: userLocation ? userLocation.latitude : 0,
          longitude: userLocation ? userLocation.longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocation && <Marker coordinate={userLocation} title="You" />}
        {/* Add markers for other users' locations here */}
      </MapView>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="View Locations" onPress={() => navigation.navigate('LocationList')} />
      {userLocation && (
        <View>
          <Text>Latitude: {userLocation.latitude}</Text>
          <Text>Longitude: {userLocation.longitude}</Text>
        </View>
      )}
    </View>
  );
};

export default TrackingScreen;
