/**
 * Date formatter (e.g. July 18, 2026 at 05:05 PM)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Decimal/Number formatter (e.g., formats numbers to fixed decimals)
 */
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  return Number(num).toFixed(decimals);
};

/**
 * Probability formatter (displays percentage representation)
 */
export const formatProbability = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  return `${Number(val).toFixed(1)}%`;
};

/**
 * File size formatter (e.g., B, KB, MB)
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Confidence level color class resolver (Emerald, Lime, Blue, Amber, Red)
 */
export const getConfidenceColorClass = (confidence) => {
  if (confidence >= 95) {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  } else if (confidence >= 90) {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
  } else if (confidence >= 75) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  } else if (confidence >= 50) {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  } else {
    return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
  }
};

/**
 * Soil health score color class resolver (Emerald, Amber, Red)
 */
export const getHealthScoreColorClass = (score) => {
  if (score >= 80) {
    return 'text-emerald-600 dark:text-emerald-400';
  } else if (score >= 50) {
    return 'text-amber-500 dark:text-amber-400';
  } else {
    return 'text-rose-600 dark:text-rose-400';
  }
};

/**
 * Normalizes digits string helper
 */
export const normalizeDigits = (str) => {
  if (str === null || str === undefined) return '';
  return String(str);
};

/**
 * Returns emoji icon for crop name
 */
export const getCropIcon = (cropName) => {
  if (!cropName) return '🌱';
  const name = String(cropName).toLowerCase();
  if (name.includes('rice') || name.includes('paddy')) return '🌾';
  if (name.includes('wheat')) return '🌾';
  if (name.includes('maize') || name.includes('corn')) return '🌽';
  if (name.includes('cotton')) return '☁️';
  if (name.includes('apple')) return '🍎';
  if (name.includes('banana')) return '🍌';
  if (name.includes('grape')) return '🍇';
  if (name.includes('orange')) return '🍊';
  if (name.includes('mango')) return '🥭';
  if (name.includes('potato')) return '🥔';
  return '🌱';
};
