import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Minus, Plus, Trash2, CreditCard, ShoppingBag } from 'lucide-react-native';
import * as Speech from 'expo-speech';

function CartItem({ item, onUpdateQuantity, onRemove }: {
  item: any;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity - 1)}
          >
            <Minus color="#64748B" size={16} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity + 1)}
          >
            <Plus color="#64748B" size={16} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Trash2 color="#EF4444" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { user, updateSpent } = useAuth();

  const handleCheckout = () => {
    const total = getTotalPrice();
    if (!user) {
      Alert.alert('Error', 'Please sign in to checkout');
      return;
    }

    if (user.spent + total > user.budget) {
      Alert.alert(
        'Budget Exceeded',
        `This purchase would exceed your budget by $${((user.spent + total) - user.budget).toFixed(2)}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue Anyway', onPress: () => processCheckout(total) }
        ]
      );
    } else {
      processCheckout(total);
    }
  };

  const processCheckout = (total: number) => {
    updateSpent(total);
    clearCart();
    Speech.speak(`Order completed. Thank you for your purchase of $${total.toFixed(2)}`);
    Alert.alert(
      'Order Completed!',
      `Thank you for your purchase of $${total.toFixed(2)}`,
      [{ text: 'OK' }]
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#2563EB', '#1D4ED8']}
          style={styles.header}
        >
          <Text style={styles.title}>Shopping Cart</Text>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <ShoppingBag color="#64748B" size={64} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add some items to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        style={styles.header}
      >
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.subtitle}>{totalItems} items</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cart.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
            onRemove={() => removeFromCart(item.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
        {user && (
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetText}>
              Budget: ${user.budget - user.spent - totalPrice} remaining after purchase
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <CreditCard color="#FFFFFF" size={20} />
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
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
    color: '#E2E8F0',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
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
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginHorizontal: 16,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  totalPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  budgetInfo: {
    marginBottom: 16,
  },
  budgetText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
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