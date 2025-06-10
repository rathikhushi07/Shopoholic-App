import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart, Product } from '@/contexts/CartContext';
import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';

function WishlistItem({ item, onAddToCart, onRemove }: {
  item: Product;
  onAddToCart: () => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.wishlistItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Star color="#FFA500" size={16} fill="#FFA500" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
          <ShoppingCart color="#FFFFFF" size={16} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Trash2 color="#EF4444" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function WishlistScreen() {
  const { wishlist, addToCart, removeFromWishlist } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Speech.speak(`${product.name} added to cart`);
  };

  const handleRemove = (productId: string) => {
    const product = wishlist.find(p => p.id === productId);
    removeFromWishlist(productId);
    if (product) {
      Speech.speak(`${product.name} removed from wishlist`);
    }
  };

  if (wishlist.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#EC4899', '#DB2777']}
          style={styles.header}
        >
          <Text style={styles.title}>Wishlist</Text>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Heart color="#EC4899" size={64} />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtext}>Save items you love for later</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EC4899', '#DB2777']}
        style={styles.header}
      >
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.subtitle}>{wishlist.length} items saved</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.offersContainer}>
          <Text style={styles.offersTitle}>🎁 Special Offers</Text>
          <Text style={styles.offersText}>
            Get 20% off on wishlist items this week!
          </Text>
        </View>

        {wishlist.map(item => (
          <WishlistItem
            key={item.id}
            item={item}
            onAddToCart={() => handleAddToCart(item)}
            onRemove={() => handleRemove(item.id)}
          />
        ))}
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
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FECDD3',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  offersContainer: {
    backgroundColor: '#FEF3E2',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  offersTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#EA580C',
    marginBottom: 4,
  },
  offersText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#C2410C',
  },
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginLeft: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#EC4899',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
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
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
});