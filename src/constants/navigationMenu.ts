export interface MenuItem {
  title: string;
  icon: 'home' | 'information-circle' | 'document-text' | 'map' | 'settings' | 'list' | 'help-circle';
  onPress: () => void;
}

/**
 * Shared navigation menu items for side drawer
 * Used across FormListScreen, MapScreen, and AboutScreen
 * Returns the standard menu items: Home, About, Forms
 */
export const getStandardMenuItems = (navigation: any): MenuItem[] => [
  {
    title: 'Home',
    icon: 'home' as const,
    onPress: () => navigation.navigate('HomeTab'),
  },
  {
    title: 'About',
    icon: 'information-circle' as const,
    onPress: () => navigation.navigate('AboutTab'),
  },
  {
    title: 'Forms',
    icon: 'document-text' as const,
    onPress: () => navigation.navigate('FormsTab'),
  },
];
