import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

// Mock data for available rooms
const MOCK_ROOMS = [
  { id: '1', building: 'VEC', room: '330', available: true, capacity: 40 },
  { id: '2', building: 'ECS', room: '302', available: true, capacity: 35 },
  { id: '3', building: 'LA5', room: '101', available: true, capacity: 60 },
  { id: '4', building: 'HC', room: '120', available: false, capacity: 25 },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">BeachRooms</ThemedText>
        <ThemedText style={styles.subtitle}>Find empty classrooms at CSULB</ThemedText>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={[styles.searchBar, { borderColor: iconColor }]}>
        <Ionicons name="search" size={20} color={iconColor} />
        <ThemedText style={[styles.searchText, { color: iconColor }]}>
          Search buildings or rooms...
        </ThemedText>
      </TouchableOpacity>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: tintColor }]}>
          <ThemedText style={styles.statNumber} lightColor="#fff" darkColor="#fff">
            {MOCK_ROOMS.filter((r) => r.available).length}
          </ThemedText>
          <ThemedText style={styles.statLabel} lightColor="#fff" darkColor="#fff">
            Available Now
          </ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#6c757d' }]}>
          <ThemedText style={styles.statNumber} lightColor="#fff" darkColor="#fff">
            {MOCK_ROOMS.length}
          </ThemedText>
          <ThemedText style={styles.statLabel} lightColor="#fff" darkColor="#fff">
            Total Rooms
          </ThemedText>
        </View>
      </View>

      {/* Available Rooms List */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Available Now</ThemedText>
      </View>

      <ScrollView style={styles.roomList} showsVerticalScrollIndicator={false}>
        {MOCK_ROOMS.filter((room) => room.available).map((room) => (
          <TouchableOpacity key={room.id} style={styles.roomCard}>
            <View style={styles.roomInfo}>
              <ThemedText type="defaultSemiBold">
                {room.building} {room.room}
              </ThemedText>
              <ThemedText style={{ color: iconColor }}>Capacity: {room.capacity}</ThemedText>
            </View>
            <View style={[styles.availableBadge, { backgroundColor: '#28a745' }]}>
              <ThemedText style={styles.badgeText}>Open</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 24,
  },
  searchText: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  roomList: {
    flex: 1,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    marginBottom: 12,
  },
  roomInfo: {
    gap: 4,
  },
  availableBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
