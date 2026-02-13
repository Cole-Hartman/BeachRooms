import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFavorites } from '@/hooks/use-favorites';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { favorites, isLoading, error, removeFavorite, refetch } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await supabase.auth.signOut();
            router.replace('/login');
          } catch {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  const handleRemoveFavorite = async (classroomId: string, roomName: string) => {
    Alert.alert('Remove Saved Room', `Remove ${roomName} from saved rooms?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeFavorite(classroomId);
          } catch {
            Alert.alert('Error', 'Failed to remove room. Please try again.');
          }
        },
      },
    ]);
  };

  const renderFavorites = () => {
    if (isLoading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={tintColor} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={24} color="#dc3545" />
          <ThemedText style={styles.emptyText}>{error}</ThemedText>
        </View>
      );
    }

    if (favorites.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={32} color={iconColor} />
          <ThemedText style={[styles.emptyText, { color: iconColor }]}>
            No saved rooms yet
          </ThemedText>
          <ThemedText style={[styles.emptySubtext, { color: iconColor }]}>
            Save rooms from the home screen to see them here
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.favoritesList}>
        {favorites.map((fav) => {
          const roomName = `${fav.classroom.building.code} ${fav.classroom.room_number}`;
          return (
            <View key={fav.id} style={[styles.favoriteItem, { borderColor: iconColor }]}>
              <View style={styles.favoriteInfo}>
                <ThemedText style={styles.roomName}>{roomName}</ThemedText>
                <ThemedText style={[styles.buildingName, { color: iconColor }]}>
                  {fav.classroom.building.name}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveFavorite(fav.classroom.id, roomName)}
                style={styles.removeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={24} color="#dc3545" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={tintColor}
            colors={[tintColor]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Profile</ThemedText>
        </View>

        {/* User Info Section */}
        <View style={[styles.section, { borderColor: iconColor }]}>
          <View style={styles.userInfo}>
            <View style={[styles.avatarContainer, { backgroundColor: tintColor }]}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            <View style={styles.userDetails}>
              <ThemedText style={styles.userEmail}>{user?.email || 'Guest'}</ThemedText>
              <ThemedText style={[styles.userLabel, { color: iconColor }]}>
                CSULB Student
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Saved Rooms Section */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Saved Rooms</ThemedText>
          <ThemedText style={[styles.sectionCount, { color: iconColor }]}>
            {favorites.length} {favorites.length === 1 ? 'room' : 'rooms'}
          </ThemedText>
        </View>
        {renderFavorites()}

        {/* Settings Section */}
        <View style={[styles.settingsSection, { marginTop: 32 }]}>
          <TouchableOpacity
            style={[styles.signOutButton, { borderColor: '#dc3545' }]}
            onPress={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? (
              <ActivityIndicator size="small" color="#dc3545" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="#dc3545" />
                <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
  },
  userLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionCount: {
    fontSize: 14,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  favoritesList: {
    gap: 8,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  favoriteInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
  },
  buildingName: {
    fontSize: 14,
    marginTop: 2,
  },
  removeButton: {
    marginLeft: 12,
  },
  settingsSection: {
    gap: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 12,
  },
  signOutText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
});
