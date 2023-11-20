
import LocationListScreen from './screens/LocationListScreen'; // Import the new screen
import MapScreen from './screens/MapScreen'; // Import the new screen
import TrackingScreen from './screens/TrackingScreen';
import { Button, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();


export default function Navigation({
  setToken,
  setLogin,
  setSignup,
  setMainPage,
  checkLogin
}){
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const options = 
    {
      headerRight: () => (
        <Button
        style = {{ marginLeft : 'auto' }}
          title="Logout"
          onPress={async () => {
            try {
                await AsyncStorage.removeItem('jwtToken');
                setToken(false);
                setLogin(true);
                setSignup({
                  user : false ,
                  driver : false ,
                });
                setMainPage(false);
                checkLogin();
            } catch(e) {
                console.log(e);
            }
        }}
        />
      ),
    }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LocationList">
        <Stack.Screen 
          name="Bus Location"
          options={
            options
          }
          component={LocationListScreen} />
        <Stack.Screen name="MapScreen" 
        options={
            options
          }
        component={MapScreen} />
        <Stack.Screen name="Tracking" 
        options={
            options
          }
        component={TrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}