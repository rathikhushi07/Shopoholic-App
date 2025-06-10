import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import {
  User,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Edit3,
  Save,
  PieChart,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut, updateBudget } = useAuth();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(user?.budget.toString() || '');

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleUpdateBudget = () => {
    const budget = parseFloat(newBudget);
    if (isNaN(budget) || budget <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount');
      return;
    }
    updateBudget(budget);
    setIsEditingBudget(false);
    Alert.alert('Success', 'Budget updated successfully');
  };

  const getBudgetStatus = () => {
    if (!user) return { percentage: 0, color: '#64748B', status: 'Unknown' };
    const percentage = (user.spent / user.budget) * 100;
    if (percentage >= 90) return { percentage, color: '#EF4444', status: 'Critical' };
    if (percentage >= 70) return { percentage, color: '#F59E0B', status: 'Warning' };
    return { percentage, color: '#059669', status: 'Good' };
  };

  const budgetStatus = getBudgetStatus();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please sign in to view profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <User color="#FFFFFF" size={32} />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <View style={styles.budgetTitleContainer}>
              <PieChart color="#059669" size={24} />
              <Text style={styles.budgetTitle}>Monthly Budget</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditingBudget(!isEditingBudget)}
            >
              {isEditingBudget ? (
                <Save color="#2563EB\" size={20} />
              ) : (
                <Edit3 color="#64748B" size={20} />
              )}
            </TouchableOpacity>
          </View>

          {isEditingBudget ? (
            <View style={styles.budgetEditContainer}>
              <TextInput
                style={styles.budgetInput}
                value={newBudget}
                onChangeText={setNewBudget}
                keyboardType="numeric"
                placeholder="Enter budget amount"
              />
              <TouchableOpacity
                style={styles.saveBudgetButton}
                onPress={handleUpdateBudget}
              >
                <Text style={styles.saveBudgetText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.budgetInfo}>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Total Budget</Text>
                <Text style={styles.budgetValue}>${user.budget}</Text>
              </View>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Spent</Text>
                <Text style={styles.budgetSpent}>${user.spent}</Text>
              </View>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Remaining</Text>
                <Text style={[styles.budgetRemaining, { color: budgetStatus.color }]}>
                  ${user.budget - user.spent}
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(budgetStatus.percentage, 100)}%`,
                        backgroundColor: budgetStatus.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: budgetStatus.color }]}>
                  {budgetStatus.percentage.toFixed(0)}% used • {budgetStatus.status}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <DollarSign color="#2563EB" size={24} />
            <Text style={styles.statValue}>${user.spent}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp color="#059669" size={24} />
            <Text style={styles.statValue}>
              ${((user.spent / new Date().getDate()) || 0).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Avg/Day</Text>
          </View>
        </View>

        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingItem}>
            <Settings color="#64748B" size={20} />
            <Text style={styles.settingText}>App Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <LogOut color="#EF4444" size={20} />
            <Text style={[styles.settingText, { color: '#EF4444' }]}>Sign Out</Text>
          </TouchableOpacity>
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
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#D1FAE5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
  },
  budgetEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginRight: 12,
  },
  saveBudgetButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveBudgetText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  budgetInfo: {
    gap: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  budgetValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  budgetSpent: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  budgetRemaining: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});