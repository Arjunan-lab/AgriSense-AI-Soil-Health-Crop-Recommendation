/**
 * Frontend Validation Utilities
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const Validators = {
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  },

  validatePassword(password: string): { isValid: boolean; message?: string } {
    if (!password || password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long.' };
    }
    return { isValid: true };
  },

  validateSoilData(data: {
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    ph?: number;
    temperature?: number;
    humidity?: number;
    rainfall?: number;
  }): ValidationResult {
    const errors: Record<string, string> = {};

    if (data.nitrogen !== undefined && (data.nitrogen < 0 || data.nitrogen > 140)) {
      errors.nitrogen = 'Nitrogen (N) should be between 0 and 140 kg/ha.';
    }
    if (data.phosphorus !== undefined && (data.phosphorus < 0 || data.phosphorus > 145)) {
      errors.phosphorus = 'Phosphorus (P) should be between 0 and 145 kg/ha.';
    }
    if (data.potassium !== undefined && (data.potassium < 0 || data.potassium > 205)) {
      errors.potassium = 'Potassium (K) should be between 0 and 205 kg/ha.';
    }
    if (data.ph !== undefined && (data.ph < 3.5 || data.ph > 10.0)) {
      errors.ph = 'pH level should be between 3.5 and 10.0.';
    }
    if (data.temperature !== undefined && (data.temperature < 0 || data.temperature > 60)) {
      errors.temperature = 'Temperature should be between 0°C and 60°C.';
    }
    if (data.humidity !== undefined && (data.humidity < 0 || data.humidity > 100)) {
      errors.humidity = 'Humidity should be between 0% and 100%.';
    }
    if (data.rainfall !== undefined && (data.rainfall < 0 || data.rainfall > 3500)) {
      errors.rainfall = 'Rainfall should be non-negative.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export default Validators;
