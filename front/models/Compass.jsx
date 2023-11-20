import React, { useEffect, useState } from 'react';
import { Text, View , Image } from 'react-native';
import { Gyroscope , Magnetometer } from 'expo-sensors';

export default Compass = () => {
 
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [compassData, setCompassData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const subscription = Gyroscope.addListener((data) => {
      setGyroscopeData(data);
    });
    const subscriptions = Magnetometer.addListener((data) => {
      setCompassData(data);
    });
    return () => {
      subscription.remove();
      subscriptions.remove();
    };
  }, []);


  const calculateHeading = (magneticField) => {
    const { x, y } = magneticField;
    const heading = Math.atan2(y, x) * (180 / Math.PI) - 45;
    
    return heading >= 0 ? heading : 360 + heading;
    
  };
  

  return (
    
 

   <>
        
        <Image
          style={{ 
            height: 100,
            width: 100,
            transform: [{
            rotate: `${calculateHeading(compassData).toFixed(2)}deg`
            }]
          }}
          source={require('../assets/point.png')
        }
        />
   </>

  );
}