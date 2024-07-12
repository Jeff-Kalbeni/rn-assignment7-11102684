import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Sidebar = ({ isOpen, toggleSideBar }) => {
  const SidebarWidth = 250;
  const position = React.useRef(new Animated.Value(-SidebarWidth)).current;

  React.useEffect(() => {
    Animated.timing(position, {
      toValue: isOpen? 0 : -SidebarWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return(
    <Animated.View style={[styles.sidebar, {transform: [{ translateX: position,  }]}, {height: 1000}]}>
        <TouchableOpacity onPress={() => toggleSideBar(false)} style={styles.closeButton}>
          <Image source={require('../assets/Close.png')} style={styles.closeIcon}/>
        </TouchableOpacity>
          
        <Text style={styles.title}>Caleb Setordzi</Text>
        <View style={styles.underline}></View>
        <Text style={styles.menuItem}>Store</Text>
        <Text style={styles.menuItem}>Locations</Text>
        <Text style={styles.menuItem}>Blog</Text>
        <Text style={styles.menuItem}>Jewelry</Text>
        <Text style={styles.menuItem}>Electronic</Text>
        <Text style={styles.menuItem}>Clothing</Text>
    </Animated.View>
  )

};

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const navigation = useNavigation();

  const toggleSideBar = (isOpen) => {
    setIsSidebarOpen(isOpen);
  }

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
            .then((res)=>res.json())
            .then((json)=>{
              // console.log(json);
              setProducts(json);
              setLoading(false);
            })
            .catch(error => {
              console.error(error);
              setLoading(false);
            })
  }, []);


//         name={item.title}

  
  const addToCart = async (product) => {
    try {
      let cart = await AsyncStorage.getItem('cart');
      cart = cart ? JSON.parse(cart) : [];
      cart.push(product);
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.log(error);
    }
  };


  if (loading) {
    return(
      <View style={styles.loader}>
        <ActivityIndicator size='large' color='#000ff'/>
      </View>
    )
  }

  const truncateDescription = (description, charLimit) => {
    if (description.length > charLimit) {
      return description.slice(0, charLimit) + '...';
    }
    return description;
  };

  return (
    <SafeAreaView style={styles.container}>
        <View  style={styles.header}>
          <TouchableOpacity 
          onPress={() => toggleSideBar(true)}
          style={{zIndex: 100}}
          >
            {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} toggleSideBar={toggleSideBar}/>}
            <Image source={require('../assets/Menu.png')}/>
          </TouchableOpacity>
          <Image source={require('../assets/Logo.png')}/>
          <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            <Image source={require('../assets/Search.png')}/>
            <Image style={{marginLeft: 5}} source={require('../assets/shopping bag.png')}/>
          </View>
        </View>

        <View style={styles.Store}>
          <Text style={styles.storeText}>Our Store</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            <View style={styles.storyIcon}>
                <Image source={require('../assets/Listview.png')}/>
            </View>

            <View style={[styles.storyIcon, {marginLeft: 5,}]}>
            <Image source={require('../assets/Filter.png')}/>
            </View>
          </View>
        </View>

        <View style={{flex: 1}}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View onPress={() => navigation.navigate('ProductDetail', { product: item })}
              style={{flex:1}}>
                <View style={styles.product}>
                  <Image source={{uri: item.image}} style={styles.image}/>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text>{truncateDescription(item.description, 40)}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                  {/* <Button title="Add to Cart" onPress={() => addToCart(item)} /> */}
                    <TouchableOpacity title="Add to Cart" onPress={() => addToCart(item)}
                      style={{backgroundColor: '#0096FF',
                        width: 100,
                        flexDirection: 'row',
                        marginLeft: 20,
                        borderRadius: 5,
                        height: 25,
                        justifyContent:'center'
                      }}>
                      <Image 
                        style={{padding: 5}}
                      source={require('../assets/Plus.png')}/>
                    </TouchableOpacity>
                    
                </View>
              </View>
            )}
            numColumns= {numColumns}
          />
        </View>
        <View style={styles.navigationButtons}>
          <Button title="View Cart" onPress={() => navigation.navigate('Cart')} />
        </View>
        <StatusBar style="auto" />
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    // alignItems: 'center',
    padding: 5,
    marginTop: 30,
    paddingTop: 20,
  },
  product: {
    flex: 1,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,
    paddingLeft: 10,
  },
  Store: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    paddingRight: 5,
    paddingLeft: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 16,
  },
  storyIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(211, 211, 211, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loader: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    zIndex: 1000,
    height: '1000',
    backgroundColor: '#fff',
  },
  storeText: {
    fontSize: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  price: {
    color: 'orange',
    fontSize: 17,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
    width: '100%',
    height: 50,
  },
  menuItem: {
    fontSize: 22,
    marginTop: 15,
    paddingLeft: 10
  },
  underline: {
    width: 160,
    marginLeft: 20,
    backgroundColor: 'orange',
    height: 2,
    marginTop: 5,
    borderRadius: 1,
  },
  navigationButtons: {
    marginTop: 20,
    position: 'absolute',
    bottom: 2,
    left: 120
  },
});
