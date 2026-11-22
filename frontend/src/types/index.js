/**
 * types/index.js
 * --------------
 * JSDoc type definitions used across the application.
 * These serve as lightweight documentation and IDE hints (no TypeScript).
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} email
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {string|null} token
 * @property {boolean} isAuthenticated
 * @property {boolean} loading
 * @property {function} login
 * @property {function} logout
 */

/**
 * @typedef {Object} AnalysisHistory
 * @property {string} analysis_id
 * @property {string} soil_type
 * @property {string} recommended_crop
 * @property {number} soil_health_score
 * @property {string} soil_health_class
 * @property {string} soil_fertility
 * @property {string} nutrient_deficiency
 * @property {number} confidence_level
 * @property {string} created_at
 */

/**
 * @typedef {Object} DashboardData
 * @property {number} total_analyses
 * @property {number} avg_health_score
 * @property {string} most_recommended_crop
 * @property {AnalysisHistory[]} recent_analyses
 */

/**
 * @typedef {Object} SystemHealth
 * @property {string} status
 * @property {string} database
 * @property {string} tensorflow_model
 * @property {string} catboost_model
 * @property {string} jwt_config
 */

/**
 * @typedef {Object} ModelInfo
 * @property {Object} image_classifier
 * @property {Object} catboost_models
 */

/**
 * @typedef {Object} NavItem
 * @property {string} name
 * @property {string} path
 * @property {import('lucide-react').LucideIcon} icon
 */

export {};   // Make this a module (JSDoc-only file)
