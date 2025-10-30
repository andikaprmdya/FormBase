export interface MenuItem {
  title: string;
  icon: 'home' | 'information-circle' | 'document-text' | 'map' | 'settings' | 'list' | 'help-circle';
  onPress: () => void;
}

/**
 * Shared navigation menu items for side drawer
 * Used across all tab screens for consistent navigation
 * Returns: Records, Help, Map List (matching HomeScreen style)
 */
export const getStandardMenuItems = (navigation: any): MenuItem[] => [
  {
    title: 'Records',
    icon: 'list' as const,
    onPress: () => navigation.navigate('RecordsList'),
  },
  {
    title: 'Help',
    icon: 'help-circle' as const,
    onPress: () => navigation.navigate('Help'),
  },
  {
    title: 'Map List',
    icon: 'map' as const,
    onPress: () => navigation.navigate('MapList'),
  },
];
