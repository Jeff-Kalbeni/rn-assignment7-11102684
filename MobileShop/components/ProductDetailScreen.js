import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function ProductDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;


  const addToCart = async (product) => {
    try {
      if (!product) {
        throw new Error("Product is undefined");
      }

      let cart = await AsyncStorage.getItem('cart');
      cart = cart ? JSON.parse(cart) : [];
      cart.push(product);
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error adding to cart: ", error);
    }
  }

  return(
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>${item.price}</Text>
      <Button title="Add to Cart" onPress={() => addToCart(product)} />
      <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },description: {
    fontSize: 16,
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 16,
  },
});
