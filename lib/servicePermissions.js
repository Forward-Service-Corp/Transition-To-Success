/**
 * Utility functions for service management permissions
 */

/**
 * Check if a user can manage services
 * @param {Object} user - User object with level and canManageServices fields
 * @returns {boolean} - True if user can manage services
 */
export function canUserManageServices(user) {
    if (!user) return false;
    
    // Admins always have access
    if (user.level === 'admin') {
        return true;
    }
    
    // Coaches need explicit permission
    if (user.level === 'coach') {
        return user.canManageServices === true;
    }
    
    return false;
}
