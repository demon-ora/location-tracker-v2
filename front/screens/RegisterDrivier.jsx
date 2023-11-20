import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import Instance from '../utils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';

const RegisterDriver = ({ setLogin , setSignup , setToken , checkLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [job, setJob] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [error, setError] = useState(null);
const routes = [
    "Lele to Lagankhel",
    "Ratnapark to Gongabu",
    "Lagankhel to Ratnapark",
    "Jawlakhel to Ratnapark",
    "Lagankhel to Naya Buspark",
]
  const handleRegistration = async () => {
    if (password !== cpassword) {
      setError("Passwords do not match");
      return;
    }

    const user = { name, email,job, password, cpassword };
    Instance.post('/register-driver', user )
      .then((response) => {
         if (response.data.token) { 
            setLogin(false);
            setSignup(false);
            setSignup({
                user : false ,
                driver : false ,
              });
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
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Text style={{ color: 'white' , fontSize : 20 , marginBottom : 20 }}>Register </Text>
      <TextInput 
      placeholderTextColor = 'white'
        style = {styles.input} placeholder="Name" value={name} onChangeText={setName} />
     
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

<TextInput 
      placeholderTextColor = 'white'
        style = {styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <Text style={{ color: 'white' , fontSize : 20 , marginBottom : 20 }}>Select Route </Text>
     
        <SelectDropdown
        style = {styles.input}
	        data={routes}
        onSelect={(selectedItem, index) => {
            setJob(index)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem
        }}
        rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item
        }}
    />
      <Button title="Register" onPress={handleRegistration} />
      <Text
        style={{ color: 'white' , fontSize : 20 , marginTop : 20 }}
      >
       Already have an account?
      </Text>
      <Button title="Register as user" onPress={() => changeStater() } />
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

export default RegisterDriver;
