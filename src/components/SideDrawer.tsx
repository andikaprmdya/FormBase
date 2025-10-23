import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

interface MenuItem {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  visible,
  onClose,
  items,
}) => {
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          tension: 280,
          friction: 30,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: -DRAWER_WIDTH,
          tension: 280,
          friction: 30,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Overlay */}
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX }],
              paddingTop: insets.top,
            },
          ]}
        >
          <BlurView
            intensity={Platform.OS === 'ios' ? 50 : 90}
            tint="dark"
            style={styles.blurContainer}
          >
            <View style={styles.drawerOverlay} />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>FormBase</Text>
                <Text style={styles.headerSubtitle}>Navigation</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <View style={styles.closeIconContainer}>
                  <Ionicons name="close" size={24} color={colors.primary} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    item.onPress();
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name={item.icon}
                        size={22}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <View style={styles.menuItemGlow} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
              <Text style={styles.footerText}>Mobile Data Collection</Text>
              <View style={styles.footerDivider} />
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
  },
  blurContainer: {
    flex: 1,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 39, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 240, 255, 0.15)',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: 4,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  headerSubtitle: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  menuItem: {
    marginBottom: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(20, 30, 60, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.15)',
    borderRadius: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.text,
    flex: 1,
  },
  menuItemGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.2,
    marginBottom: spacing.md,
  },
  footerText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
