import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Instance from '../utils/axios';

const LoginScreen = ({setLogin , setSignup , setToken , checkLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ permission , setPermission ] = useState(false);

const [error, setError] = useState(null);
  const handleLogin = async () => {
    const user = { email, password };

    try {
      Instance.post('/login', user )
      .then((response) => {
        if (response.data.token) { 
          setLogin(false);
          setSignup({
            user : true ,
            driver : false ,
          });
          setToken(true); 
          checkLogin();

          AsyncStorage.setItem('jwtToken', response.data.token)
          AsyncStorage.setItem('user', email)
       }
    }).catch
    (error => {
      setError("Login failed. Please try again.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    })

      // if(email === "admin" && password === "admin"){
      //   AsyncStorage.setItem('jwtToken', "admin")
      //   setLogin(true)
      // }


     
    } catch (error) {
      // Handle network errors
     
    }
  };


  const changeState = () => {
      setLogin(false);
      setSignup({
        user : true ,
        driver : false ,
      });
      setToken(false);
  }

  return (
    <View

      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#2f2f2f'  , 
        padding : 10     ,
        borderRadius : 10 ,
        
      }}
    
    >
      {
        error && <Text style={{ color: 'red' }}>{error}</Text>
      }
      <Text style={{ color: 'white' , fontSize : 20 , marginBottom : 20 }}>Login</Text>
      <TextInput
      placeholderTextColor = 'white'

        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style = {styles.input}
      />
      <TextInput
      placeholderTextColor = 'white'

        placeholder="Password"
        value={password}
        style = {styles.input}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        style={{ color: 'white' , fontSize : 20 , marginTop : 20 }}
      >
        Don't have an account?
      </Text>
      <Button title="Register" onPress={() => changeState()} />
    </View>
  );
};

const styles = StyleSheet.create({
  input : {
    borderBottomWidth : 1 ,
    color : 'white' ,
    width : 300 , padding : 10 , borderRadius : 10 , marginBottom : 10 }
  },

)

export default LoginScreen;
