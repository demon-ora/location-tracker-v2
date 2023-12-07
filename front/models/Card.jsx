import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';

const Cards = ({ selectedLocation, setCardShow }) => {
  const [cardDetails, setCardDetails] = useState({});
  const [fairAmount, setFairAmount] = useState(null);

  const generateFair = () => {
    // Generate a random number between 20 and 50 for the fair amount
    const randomFair = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
    setFairAmount(randomFair);
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardHeaderTitle}>{selectedLocation.name}</Text>
              <Text>Some description</Text>
              {fairAmount !== null && (
                <Text>Your fair is {fairAmount} rupees</Text>
              )}
              <Text>10km Away</Text>
              {/* input */}
              {/* <TextInput
                placeholder="Enter your name"
                keyboardType="numeric"
              /> */}
              <Button title="Generate Fair" onPress={generateFair} />
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
  close: {
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
