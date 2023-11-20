import React, { useEffect, useState } from 'react';
import { View, Text , Button , StyleSheet, TextInput } from 'react-native';



const Cards = ({selectedLocation , setCardShow}) => {

const [ cardDetails , setCardDetails ] = useState({})


return (
  <>
   <View style={styles.card}>
      <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View>
                <Text style={styles.cardHeaderTitle} >{selectedLocation.name}</Text>
                <Text>
                  some description
                </Text>
                <Text>
                  10km Away
                </Text>
                {/* input */}

                <TextInput 
                placeholder="Enter your name"
                keyboardType="numeric"
                   />
                   

            </View>
            <View>
              <Button title="Close" onPress={() => setCardShow(false)} />
            </View>
          </View>
      </View>
    </View>
  </>
);
};

const styles = StyleSheet.create({
cardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},
cardHeaderTitle: {
  fontSize: 20,
  fontWeight: 'bold',
},
cardBody: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
},
close :  {
  width: 40,
  height: 40,
  borderRadius: 40,
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 20,
  fontWeight: 'bold',
  color: 'black',
  backgroundColor: 'white',
},
card: {
  position: 'absolute',
  zIndex: 999,
  bottom: 0,
  width: '100%',
  padding: 20,
  // Add more styles as needed for your card
},
});

export default Cards;