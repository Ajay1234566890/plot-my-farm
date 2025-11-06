/**
 * MapLibre Test Screen
 * Test the MapLibre + OpenStreetMap integration
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Map, Users, UserCheck } from 'lucide-react-native';
import MapLibreView from '@/components/MapLibreView';
import { NearbyUser } from '@/services/map-service';
import { RADIUS_PRESETS } from '@/utils/haversine';

export default function MapTestScreen() {
  const router = useRouter();
  const [showFarmers, setShowFarmers] = useState(true);
  const [showBuyers, setShowBuyers] = useState(true);
  const [selectedRadius, setSelectedRadius] = useState(RADIUS_PRESETS.DEFAULT);
  const [selectedUser, setSelectedUser] = useState<NearbyUser | null>(null);

  const handleUserPress = (user: NearbyUser) => {
    setSelectedUser(user);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MapLibre Test</Text>
        <View style={styles.backButton} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapLibreView
          showFarmers={showFarmers}
          showBuyers={showBuyers}
          radiusInMeters={selectedRadius}
          onUserPress={handleUserPress}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Filter toggles */}
          <TouchableOpacity
            style={[styles.filterButton, showFarmers && styles.filterButtonActive]}
            onPress={() => setShowFarmers(!showFarmers)}
          >
            <Text style={[styles.filterIcon, showFarmers && styles.filterIconActive]}>🌾</Text>
            <Text style={[styles.filterText, showFarmers && styles.filterTextActive]}>
              Farmers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, showBuyers && styles.filterButtonActive]}
            onPress={() => setShowBuyers(!showBuyers)}
          >
            <Text style={[styles.filterIcon, showBuyers && styles.filterIconActive]}>🛒</Text>
            <Text style={[styles.filterText, showBuyers && styles.filterTextActive]}>
              Buyers
            </Text>
          </TouchableOpacity>

          {/* Radius presets */}
          {Object.entries(RADIUS_PRESETS).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.radiusButton,
                selectedRadius === value && styles.radiusButtonActive
              ]}
              onPress={() => setSelectedRadius(value)}
            >
              <Text style={[
                styles.radiusText,
                selectedRadius === value && styles.radiusTextActive
              ]}>
                {value / 1000}km
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected user info */}
      {selectedUser && (
        <View style={styles.userInfo}>
          <View style={styles.userInfoHeader}>
            <Text style={styles.userInfoIcon}>
              {selectedUser.role === 'farmer' ? '🌾' : '🛒'}
            </Text>
            <View style={styles.userInfoDetails}>
              <Text style={styles.userInfoName}>
                {selectedUser.full_name || 'Unknown User'}
              </Text>
              <Text style={styles.userInfoRole}>
                {selectedUser.role === 'farmer' ? 'Farmer' : 'Buyer'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedUser(null)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.userInfoStats}>
            <View style={styles.userInfoStat}>
              <Map size={16} color="#6b7280" />
              <Text style={styles.userInfoStatText}>{selectedUser.distanceFormatted}</Text>
            </View>
            {selectedUser.location && (
              <View style={styles.userInfoStat}>
                <Users size={16} color="#6b7280" />
                <Text style={styles.userInfoStatText}>{selectedUser.location}</Text>
              </View>
            )}
            {selectedUser.is_verified && (
              <View style={styles.userInfoStat}>
                <UserCheck size={16} color="#16a34a" />
                <Text style={[styles.userInfoStatText, { color: '#16a34a' }]}>Verified</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  mapContainer: {
    flex: 1,
  },
  controls: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#16a34a',
  },
  filterIcon: {
    fontSize: 16,
  },
  filterIconActive: {
    fontSize: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTextActive: {
    color: 'white',
  },
  radiusButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  radiusButtonActive: {
    backgroundColor: '#3b82f6',
  },
  radiusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  radiusTextActive: {
    color: 'white',
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  userInfoDetails: {
    flex: 1,
  },
  userInfoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  userInfoRole: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  closeButton: {
    fontSize: 24,
    color: '#9ca3af',
    paddingHorizontal: 8,
  },
  userInfoStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  userInfoStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userInfoStatText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

