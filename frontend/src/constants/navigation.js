/**
 * constants/navigation.js
 * -----------------------
 * Centralised navigation config consumed by both Sidebar and AppRoutes.
 */

import {
  LayoutDashboard,
  Sprout,
  History,
  Activity,
  User,
  Settings,
  Info,
} from 'lucide-react';

export const NAV_ITEMS = [
  { name: 'Dashboard',         path: '/dashboard', icon: LayoutDashboard },
  { name: 'Complete Analysis', path: '/analysis',  icon: Sprout },
  { name: 'History',           path: '/history',   icon: History },
  { name: 'System Status',     path: '/system',    icon: Activity },
  { name: 'Profile',           path: '/profile',   icon: User },
  { name: 'Settings',          path: '/settings',  icon: Settings },
  { name: 'About',             path: '/about',     icon: Info },
];

export const AUTH_PATHS = ['/login', '/register'];
