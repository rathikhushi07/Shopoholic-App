import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, Product } from '@/contexts/CartContext';
import { Search, ShoppingCart, Heart, Star, Mic, Bell } from 'lucide-react-native';
import * as Speech from 'expo-speech';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 999,
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    rating: 4.8,
    description: 'Latest iPhone with Pro camera system',
  },
  {
    id: '2',
    name: 'AirPods Pro',
    price: 249,
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    rating: 4.7,
    description: 'Wireless earbuds with noise cancellation',
  },
  {
    id: '3',
    name: 'Nike Air Max',
    price: 129,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion',
    rating: 4.6,
    description: 'Comfortable running shoes',
  },
  {
    id: '4',
    name: 'MacBook Pro',
    price: 1299,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    rating: 4.9,
    description: 'Powerful laptop for professionals',
  },
  {
    id: '5',
    name: 'Samsung Watch',
    price: 299,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    rating: 4.5,
    description: 'Smart watch with health tracking',
  },
  {
    id: '6',
    name: 'Designer Backpack',
    price: 89,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion',
    rating: 4.4,
    description: 'Stylish and functional backpack',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🛍️' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'home', name: 'Home', icon: '🏠' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
];

function ProductCard({ product, onAddToCart, onAddToWishlist, isInWishlist }: {
  product: Product;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  isInWishlist: boolean;
}) {
  return (
    <View style={styles.productCard}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <View style={styles.ratingContainer}>
          <Star color="#FFA500" size={14} fill="#FFA500" />
          <Text style={styles.rating}>{product.rating}</Text>
        </View>
        <Text style={styles.productPrice}>${product.price}</Text>
        <View style={styles.productActions}>
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={onAddToWishlist}
          >
            <Heart
              color={isInWishlist ? "#EF4444" : "#64748B"}
              size={20}
              fill={isInWishlist ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={onAddToCart}
          >
            <ShoppingCart color="#FFFFFF" size={16} />
            <Text style={styles.addToCartText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [isListening, setIsListening] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleVoiceSearch = async () => {
    setIsListening(true);
    // Mock voice recognition for web compatibility
    setTimeout(() => {
      const mockVoiceQueries = ['iPhone', 'shoes', 'laptop', 'watch'];
      const randomQuery = mockVoiceQueries[Math.floor(Math.random() * mockVoiceQueries.length)];
      setSearchQuery(randomQuery);
      Speech.speak(`Searching for ${randomQuery}`);
      setIsListening(false);
    }, 2000);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Speech.speak(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      Alert.alert('Already in Wishlist', 'This item is already in your wishlist');
    } else {
      addToWishlist(product);
      Speech.speak(`${product.name} added to wishlist`);
    }
  };

  const getBudgetStatus = () => {
    if (!user) return { color: '#64748B', text: 'Budget: $0' };
    const remaining = user.budget - user.spent;
    const percentage = (user.spent / user.budget) * 100;
    
    if (percentage >= 90) return { color: '#EF4444', text: `Budget: $${remaining} left (${percentage.toFixed(0)}% used)` };
    if (percentage >= 70) return { color: '#F59E0B', text: `Budget: $${remaining} left (${percentage.toFixed(0)}% used)` };
    return { color: '#059669', text: `Budget: $${remaining} left (${percentage.toFixed(0)}% used)` };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}!</Text>
            <Text style={[styles.budgetText, { color: budgetStatus.color }]}>
              {budgetStatus.text}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#64748B" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
            onPress={handleVoiceSearch}
          >
            <Mic color={isListening ? "#FFFFFF" : "#64748B"} size={20} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categories}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Products' : 
             CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Products'}
          </Text>
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onAddToCart={() => handleAddToCart(item)}
                onAddToWishlist={() => handleAddToWishlist(item)}
                isInWishlist={isInWishlist(item.id)}
              />
            )}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productGrid}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  budgetText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  voiceButton: {
    padding: 8,
    borderRadius: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#2563EB',
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  productsContainer: {
    paddingBottom: 20,
  },
  productGrid: {
    paddingHorizontal: 20,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wishlistButton: {
    padding: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
});