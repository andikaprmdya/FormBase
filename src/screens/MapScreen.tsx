import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, Platform } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { TabParamList, RootStackParamList, Record, LocationValue } from '../types';
import { Button, Loading, ErrorView } from '../components';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SideDrawer } from '../components/SideDrawer';
import { recordAPI, formAPI } from '../services/api';
import { colors, spacing, typography } from '../theme';
import { getStandardMenuItems } from '../constants/navigationMenu';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MapTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface MarkerData {
  id: number;
  formName: string;
  fieldName: string;
  location: LocationValue;
  recordId: number;
}

const MapScreen: React.FC<Props> = ({ navigation }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationValue | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: -27.4705,
    longitude: 153.0260,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const menuItems = getStandardMenuItems(navigation);

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load map data including user location and all location markers from records
   * Requests location permission, fetches all forms and their records,
   * extracts location fields, and centers map on user or first marker
   */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const userLoc: LocationValue = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };
          setUserLocation(userLoc);
          setRegion({
            latitude: userLoc.lat,
            longitude: userLoc.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        } catch (err) {
          console.log('Could not get user location:', err);
        }
      }

      // Load all forms
      const forms = await formAPI.getAll();

      // Load records for each form and extract location data
      const allMarkers: MarkerData[] = [];

      for (const form of forms) {
        try {
          const records = await recordAPI.getByFormId(form.id);

          records.forEach((record: Record) => {
            Object.entries(record.values).forEach(([fieldName, value]) => {
              if (value && typeof value === 'object' && 'lat' in value && 'lng' in value) {
                allMarkers.push({
                  id: allMarkers.length,
                  formName: form.name,
                  fieldName,
                  location: value as LocationValue,
                  recordId: record.id,
                });
              }
            });
          });
        } catch (err) {
          console.log(`Failed to load records for form ${form.id}:`, err);
        }
      }

      setMarkers(allMarkers);

      // If we have markers but no user location, center on first marker
      if (allMarkers.length > 0 && !userLocation) {
        setRegion({
          latitude: allMarkers[0].location.lat,
          longitude: allMarkers[0].location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (err) {
      setError('Failed to load map data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (marker: MarkerData) => {
    Alert.alert(
      marker.formName,
      `${marker.fieldName}\nRecord ID: ${marker.recordId}\nLat: ${marker.location.lat.toFixed(6)}\nLng: ${marker.location.lng.toFixed(6)}`
    );
  };

  const handleCenterOnUser = async () => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userLoc: LocationValue = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        setUserLocation(userLoc);
        setRegion({
          latitude: userLoc.lat,
          longitude: userLoc.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (err) {
        Alert.alert('Error', 'Failed to get your location');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <ScreenWrapper title="Map" subtitle="View locations" onMenuPress={() => setDrawerVisible(true)}>
        <Loading message="Loading map data..." />
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper title="Map" subtitle="View locations" onMenuPress={() => setDrawerVisible(true)}>
        <ErrorView message={error} onRetry={loadData} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="Map" subtitle="View locations" onMenuPress={() => setDrawerVisible(true)}>
      <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.lat,
              longitude: userLocation.lng,
            }}
            title="Your Location"
            pinColor={colors.primary}
          />
        )}

        {/* Record location markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.location.lat,
              longitude: marker.location.lng,
            }}
            title={marker.formName}
            description={marker.fieldName}
            pinColor={colors.accent}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>

      {/* No location data overlay */}
      {markers.length === 0 && (
        <View style={styles.noDataOverlay}>
          <Card style={styles.noDataCard}>
            <Text style={styles.noDataIcon}>📍</Text>
            <Text style={styles.noDataText}>No Location Data</Text>
            <Text style={styles.noDataSubtext}>
              Records with location fields will appear here as markers
            </Text>
          </Card>
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.info}>
          <Text style={styles.infoText}>
            {markers.length} location {markers.length === 1 ? 'marker' : 'markers'}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Center on Me"
            onPress={handleCenterOnUser}
            variant="secondary"
            size="small"
            style={styles.button}
          />
          <Button
            title="Refresh"
            onPress={loadData}
            variant="secondary"
            size="small"
            style={styles.button}
          />
        </View>
      </View>
    </View>

      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        items={menuItems}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    bottom: Platform.OS === 'ios' ? 100 : 80, // Add bottom spacing for tab bar
  },
  info: {
    backgroundColor: 'rgba(10, 14, 39, 0.85)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
  },
  infoText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
  },
  noDataOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  noDataCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  noDataIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  noDataText: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  noDataSubtext: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default MapScreen;
