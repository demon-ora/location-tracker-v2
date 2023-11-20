import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import Instance from '../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationScreen = ({ setLogin , setSignup , setToken , checkLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegistration = async () => {
    if (password !== cpassword) {
      setError("Passwords do not match");
      return;
    }

    const user = { name, email, password, cpassword };
    Instance.post('/register', user )
      .then((response) => {
         if (response.data.token) { 
            setLogin(false);
            setSignup({
              user : false ,
              driver : false ,
            });
            setToken(true); 
            checkLogin();
            AsyncStorage.setItem('jwtToken', response.data.token)
            AsyncStorage.setItem('user', email)
         }
    }).catch 
    (error => {
      setError("Registration failed. Please try again.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    })

  };
  const changeState = () => {
    setLogin(true);
    setSignup({
      user : false ,
      driver : false ,
    });
    setToken(false);
}
const changeStater = () => {
  setLogin(false);
  setSignup({
    user : false ,
    driver : true ,
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
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Text style={{ color: 'white' , fontSize : 20 , marginBottom : 20 }}>Register </Text>
      <TextInput 
      placeholderTextColor = 'white'
        style = {styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput 
      placeholderTextColor = 'white'
        style = {styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
    
      <TextInput 
      placeholderTextColor = 'white'
        style = {styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput 
      placeholderTextColor = 'white'
      style = {styles.input}
        placeholder="Confirm Password"
        value={cpassword}
        onChangeText={setCpassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegistration} />
      <Text
        style={{ color: 'white' , fontSize : 20 , marginTop : 20 }}
      >
       Already have an account?
      </Text>
      <Button title="Register as Driver" onPress={() => changeStater() } />
      <Button title="Login" onPress={() => changeState() } />
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

export default RegistrationScreen;
