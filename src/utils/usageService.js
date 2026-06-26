// src/utils/usageService.js
// Tracks usage via localStorage only (no database needed)

const FREE_LIMIT = 3;

export const getUsage = async (userId) => {
  const storageKey = userId ? `usage_${userId}` : 'guest_usage';
  const used = parseInt(localStorage.getItem(storageKey) || '0');
  return { 
    used, 
    limit: FREE_LIMIT, 
    remaining: Math.max(0, FREE_LIMIT - used), 
    isPremium: false 
  };
};

export const incrementUsage = async (userId) => {
  const storageKey = userId ? `usage_${userId}` : 'guest_usage';
  const used = parseInt(localStorage.getItem(storageKey) || '0') + 1;
  localStorage.setItem(storageKey, String(used));
};

export const canGenerate = async (userId) => {
  const { used, limit } = await getUsage(userId);
  return used < limit;
};
