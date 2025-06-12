/**
 * Returns Tailwind background color classes based on the environment
 * @param {string} environment - The current environment (development, testing, training, production, preview)
 * @returns {string} - Tailwind background color classes
 */
export function getEnvironmentBgColor(environment) {
  switch (environment) {
    case 'development':
      return 'visible bg-gray-800';
    case 'testing':
      return 'visible bg-indigo-700';
    case 'training':
      return 'visible bg-pink-600';
    case 'preview':
      return 'visible bg-pink-600';
    case 'production':
    default:
      return 'hidden';
  }
}
