import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCartItems = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      if( cart !== null){
        const parsedCart = JSON.parse(cart);
        setCartItems(parsedCart);
        calculateTotalPrice(parsedCart);
    }
  } catch (error) {
      console.log(error);
    }
   
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      let cart = await AsyncStorage.getItem('cart');
      cart = cart ? JSON.parse(cart) : [];
      const updatedCart = cart.filter((item) => item.id !== productId);
      setCartItems(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      calculateTotalPrice(updatedCart);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>${item.price}</Text>
              <Button title="Remove from Cart" onPress={() => removeFromCart(item.id)} />
            </View>
          </View>
        )}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <Text style={{ fontSize: 15, paddingTop: 5 }}>EST. TOTAL</Text>
        <Text style={{ color: 'orange', fontSize: 20 }}>${totalPrice.toFixed(2)}</Text>
      </View>

      <View>
          <TouchableOpacity style={styles.button}>
              <Image source={require('../assets/shopping bag.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  product: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },button: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 1,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonImage: {
    right: 5,
    height: 24,
    width: 24,
    tintColor: '#fff'
  }
});
