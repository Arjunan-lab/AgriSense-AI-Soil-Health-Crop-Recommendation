/**
 * utils/rbac.js
 * -------------
 * Enterprise Role-Based Access Control (RBAC) permissions manager.
 */

export const ROLES = {
  FARMER: 'Farmer',
  AGRONOMIST: 'Agronomist',
  ADMIN: 'Admin',
  SUPERADMIN: 'SuperAdmin',
};

export const PERMISSIONS = {
  RUN_ANALYSIS: 'run_analysis',
  VIEW_HISTORY: 'view_history',
  DOWNLOAD_REPORTS: 'download_reports',
  ACCESS_CHATBOT: 'access_chatbot',
  ACCESS_ADMIN_PORTAL: 'access_admin_portal',
  MANAGE_USERS: 'manage_users',
  EXPORT_ANALYTICS: 'export_analytics',
};

const ROLE_PERMISSIONS = {
  [ROLES.FARMER]: [
    PERMISSIONS.RUN_ANALYSIS,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.DOWNLOAD_REPORTS,
    PERMISSIONS.ACCESS_CHATBOT,
  ],
  [ROLES.AGRONOMIST]: [
    PERMISSIONS.RUN_ANALYSIS,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.DOWNLOAD_REPORTS,
    PERMISSIONS.ACCESS_CHATBOT,
    PERMISSIONS.EXPORT_ANALYTICS,
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.RUN_ANALYSIS,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.DOWNLOAD_REPORTS,
    PERMISSIONS.ACCESS_CHATBOT,
    PERMISSIONS.ACCESS_ADMIN_PORTAL,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.EXPORT_ANALYTICS,
  ],
  [ROLES.SUPERADMIN]: Object.values(PERMISSIONS),
};

export const hasPermission = (userRole = ROLES.FARMER, permission) => {
  const granted = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS[ROLES.FARMER];
  return granted.includes(permission);
};
