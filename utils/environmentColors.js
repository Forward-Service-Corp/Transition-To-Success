/**
 * Returns Tailwind background color classes based on the environment
 * @param {string} environment - The current environment (development, testing, training, production, preview)
 * @returns {string} - Tailwind background color classes
 */
export function getEnvironmentBgColor(environment) {
  switch (environment) {
    case 'development':
      return 'dev';
    case 'testing':
      return 'staging';
    case 'training':
      return 'training';
    case 'staging':
      return 'staging';
    case 'production':
    default:
      return 'hidden';
  }
}
