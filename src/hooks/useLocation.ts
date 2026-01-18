/**
 * Location hook for accessing device GPS
 * Handles permissions and provides current location
 */

import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export interface UseLocationResult {
  location: LocationCoords | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<LocationCoords | null>;
}

export function useLocation(options?: {
  /** Whether to start fetching location immediately */
  autoFetch?: boolean;
  /** Whether to watch for location updates (vs one-time fetch) */
  watch?: boolean;
}): UseLocationResult {
  const { autoFetch = false, watch = false } = options || {};

  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);

  // Check current permission status
  const checkPermission = useCallback(async () => {
    // On web, we handle permissions differently
    if (Platform.OS === "web") {
      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        if (result.state === "granted") {
          setPermissionStatus(Location.PermissionStatus.GRANTED);
        } else if (result.state === "denied") {
          setPermissionStatus(Location.PermissionStatus.DENIED);
        } else {
          setPermissionStatus(Location.PermissionStatus.UNDETERMINED);
        }
      } catch {
        // Fallback - assume undetermined
        setPermissionStatus(Location.PermissionStatus.UNDETERMINED);
      }
      return;
    }

    const { status } = await Location.getForegroundPermissionsAsync();
    setPermissionStatus(status);
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setError(null);

    if (Platform.OS === "web") {
      // Web handles permissions via browser
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          }
        );
        setPermissionStatus(Location.PermissionStatus.GRANTED);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        return true;
      } catch (e: any) {
        if (e.code === 1) {
          // Permission denied
          setPermissionStatus(Location.PermissionStatus.DENIED);
          setError("Location permission denied");
        } else {
          setError(e.message || "Failed to get location");
        }
        return false;
      }
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);

    if (status !== Location.PermissionStatus.GRANTED) {
      setError("Location permission denied");
      return false;
    }

    return true;
  }, []);

  // Fetch current location
  const refreshLocation =
    useCallback(async (): Promise<LocationCoords | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Check permission first
        if (permissionStatus !== Location.PermissionStatus.GRANTED) {
          const granted = await requestPermission();
          if (!granted) {
            setIsLoading(false);
            return null;
          }
        }

        if (Platform.OS === "web") {
          // Use browser geolocation
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
              });
            }
          );
          const coords: LocationCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(coords);
          setIsLoading(false);
          return coords;
        }

        // Use expo-location for native
        const result = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords: LocationCoords = {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
          accuracy: result.coords.accuracy,
        };

        setLocation(coords);
        setIsLoading(false);
        return coords;
      } catch (e: any) {
        setError(e.message || "Failed to get location");
        setIsLoading(false);
        return null;
      }
    }, [permissionStatus, requestPermission]);

  // Auto-fetch on mount if requested
  useEffect(() => {
    checkPermission();

    if (autoFetch) {
      refreshLocation();
    }
  }, [autoFetch, checkPermission, refreshLocation]);

  // Watch location changes if requested
  useEffect(() => {
    if (!watch || permissionStatus !== Location.PermissionStatus.GRANTED) {
      return;
    }

    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      if (Platform.OS === "web") {
        // Web uses different API
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (err) => {
            setError(err.message);
          },
          { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 50, // Update every 50 meters
        },
        (loc) => {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy,
          });
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [watch, permissionStatus]);

  return {
    location,
    isLoading,
    error,
    permissionStatus,
    requestPermission,
    refreshLocation,
  };
}
