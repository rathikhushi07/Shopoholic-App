import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart, Product } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingCart, Eye, Sparkles, Heart } from 'lucide-react-native';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

const VR_AISLES = [
  {
    id: 'electronics',
    name: 'Electronics Zone',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Latest gadgets and tech',
    products: [
      {
        id: 'vr1',
        name: 'VR Headset',
        price: 399,
        image: 'https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Electronics',
        rating: 4.8,
        description: 'Immersive virtual reality experience',
      },
      {
        id: 'vr2',
        name: 'Gaming Console',
        price: 499,
        image: 'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Electronics',
        rating: 4.9,
        description: 'Next-gen gaming console',
      },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion Avenue',
    image: 'https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Trendy clothes and accessories',
    products: [
      {
        id: 'vr3',
        name: 'Designer Jacket',
        price: 299,
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Fashion',
        rating: 4.7,
        description: 'Premium winter jacket',
      },
      {
        id: 'vr4',
        name: 'Luxury Watch',
        price: 799,
        image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Fashion',
        rating: 4.9,
        description: 'Swiss made timepiece',
      },
    ],
  },
  {
    id: 'home',
    name: 'Home & Living',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Everything for your home',
    products: [
      {
        id: 'vr5',
        name: 'Smart Speaker',
        price: 149,
        image: 'https://images.pexels.com/photos/4790267/pexels-photo-4790267.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Home',
        rating: 4.6,
        description: 'Voice-controlled smart speaker',
      },
      {
        id: 'vr6',
        name: 'Coffee Machine',
        price: 249,
        image: 'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Home',
        rating: 4.5,
        description: 'Professional coffee maker',
      },
    ],
  },
];

function VRAisle({ aisle, onEnter }: { aisle: any; onEnter: () => void }) {
  return (
    <TouchableOpacity style={styles.aisleCard} onPress={onEnter}>
      <Image source={{ uri: aisle.image }} style={styles.aisleImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.aisleGradient}
      >
        <View style={styles.aisleInfo}>
          <Text style={styles.aisleName}>{aisle.name}</Text>
          <Text style={styles.aisleDescription}>{aisle.description}</Text>
          <View style={styles.enterButton}>
            <Eye color="#FFFFFF" size={16} />
            <Text style={styles.enterButtonText}>Enter</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function VRProduct({ product, onAddToCart, onAddToWishlist, isInWishlist }: {
  product: Product;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  isInWishlist: boolean;
}) {
  const scaleValue = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onAddToCart();
  };

  return (
    <Animated.View style={[styles.vrProductCard, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity onPress={handlePress}>
        <Image source={{ uri: product.image }} style={styles.vrProductImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.vrProductGradient}
        >
          <View style={styles.vrProductInfo}>
            <Text style={styles.vrProductName}>{product.name}</Text>
            <Text style={styles.vrProductPrice}>${product.price}</Text>
            <View style={styles.vrProductActions}>
              <TouchableOpacity
                style={styles.vrWishlistButton}
                onPress={onAddToWishlist}
              >
                <Heart
                  color={isInWishlist ? "#EF4444" : "#FFFFFF"}
                  size={20}
                  fill={isInWishlist ? "#EF4444" : "transparent"}
                />
              </TouchableOpacity>
              <View style={styles.vrAddToCartButton}>
                <ShoppingCart color="#FFFFFF" size={16} />
                <Text style={styles.vrAddToCartText}>Tap to Add</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function VRExperience() {
  const [currentView, setCurrentView] = useState<'lobby' | 'aisle'>('lobby');
  const [selectedAisle, setSelectedAisle] = useState<any>(null);
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  const handleEnterAisle = (aisle: any) => {
    setSelectedAisle(aisle);
    setCurrentView('aisle');
    Speech.speak(`Welcome to ${aisle.name}`);
  };

  const handleExitAisle = () => {
    setCurrentView('lobby');
    setSelectedAisle(null);
    Speech.speak('Returning to VR lobby');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Speech.speak(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product: Product) => {
    addToWishlist(product);
    Speech.speak(`${product.name} added to wishlist`);
  };

  if (currentView === 'lobby') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#3730A3']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Sparkles color="#FFFFFF" size={32} />
            <Text style={styles.title}>VR Shopping Mall</Text>
            <Text style={styles.subtitle}>Choose your virtual destination</Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Virtual Aisles</Text>
          {VR_AISLES.map(aisle => (
            <VRAisle
              key={aisle.id}
              aisle={aisle}
              onEnter={() => handleEnterAisle(aisle)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E1B4B', '#312E81']}
        style={styles.aisleHeader}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleExitAisle}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <View style={styles.aisleHeaderContent}>
          <Text style={styles.aisleTitle}>{selectedAisle?.name}</Text>
          <Text style={styles.aisleSubtitle}>{selectedAisle?.description}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.vrAisleContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.vrSectionTitle}>Featured Products</Text>
        <View style={styles.vrProductGrid}>
          {selectedAisle?.products.map((product: Product) => (
            <VRProduct
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              onAddToWishlist={() => handleAddToWishlist(product)}
              isInWishlist={isInWishlist(product.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#C7D2FE',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    margin: 20,
    marginBottom: 16,
  },
  aisleCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
  },
  aisleImage: {
    width: '100%',
    height: '100%',
  },
  aisleGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  aisleInfo: {
    padding: 20,
  },
  aisleName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aisleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    marginBottom: 12,
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  aisleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  aisleHeaderContent: {
    flex: 1,
  },
  aisleTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  aisleSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#C7D2FE',
    marginTop: 4,
  },
  vrAisleContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  vrSectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    margin: 20,
    marginBottom: 16,
  },
  vrProductGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  vrProductCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 250,
  },
  vrProductImage: {
    width: '100%',
    height: '100%',
  },
  vrProductGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  vrProductInfo: {
    padding: 20,
  },
  vrProductName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vrProductPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#60A5FA',
    marginBottom: 12,
  },
  vrProductActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vrWishlistButton: {
    padding: 8,
  },
  vrAddToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  vrAddToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});