import React from 'react';

import { Button, ImageBackground, Text, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Navigation from '../Navigation';
import RegistrationScreen from '../screens/RegistrationScreen';
import RegisterDriver from '../screens/RegisterDrivier';



function RouteHandler() {
    const [ login , setLogin ] = React.useState();
    const [ signup , setSignup ] = React.useState({
        user : true,
        driver : false,
    });
    const [ token , setToken ] = React.useState('');
    const [ mainPage , setMainPage ] = React.useState(false);

    const checkLogin = async () => {
        try {
            const value = await AsyncStorage.getItem('jwtToken');
            if(value !== null) {
                setToken(true);
                setLogin(false);
                setSignup(false);
                setMainPage(true);
            }else{
                setToken(false);
                setLogin(true);
                setSignup(false);
                setMainPage(false);
            }
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        checkLogin();
    },[token]);


    
  return (
   <>
     <View style={styles.top}>
    </View>
        {
            login || signup ? 
            <ImageBackground 
            source={require('../assets/bg-bus.png')}
            style={styles.container}>
            {
                    login ? 
                    <LoginScreen 
                        setLogin={setLogin}
                        setSignup={setSignup}
                        setToken={setToken}
                        checkLogin={checkLogin}
                    /> : null
            }
            {
                signup.user ? 
                <RegistrationScreen 
                    setLogin={setLogin}
                    setSignup={setSignup}
                    setToken={setToken}
                    checkLogin={checkLogin}
                /> : null
            }

            {
                signup.driver ? 
                <RegisterDriver 
                    setLogin={setLogin}
                    setSignup={setSignup}
                    setToken={setToken}
                    checkLogin={checkLogin}
                /> : null
            }
            </ImageBackground> :  
            <>
               {
                    mainPage && token ?
                    <>

                    <Navigation
                        setToken={setToken}
                        setLogin={setLogin}
                        setSignup={setSignup}
                        setMainPage={setMainPage}
                        checkLogin={checkLogin}
                    />
                    </>
                    : setLogin(true)


               }
            </>

        }
    
   </>
  );
}

export default RouteHandler;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width:'100%',
        height:'100%',

    },
    logout : {
        color : 'white',
        backgroundColor : 'green',
    },
  });

  
// styles
// Path: styles/loginScreen.js
 
