// src/utils/usageService.js
// Tracks usage via Supabase + localStorage fallback

import { supabase } from '../lib/supabase';

const FREE_LIMIT = 3;

export const getUsage = async (userId) => {
  if (!userId) {
    const used = parseInt(localStorage.getItem('guest_usage') || '0');
    return { used, limit: FREE_LIMIT, remaining: Math.max(0, FREE_LIMIT - used), isPremium: false };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('usage_count, is_premium')
      .eq('id', userId)
      .single();

    if (error || !data) throw error;

    const isPremium = data.is_premium || false;
    const used = data.usage_count || 0;
    const limit = isPremium ? Infinity : FREE_LIMIT;
    return { used, limit, remaining: isPremium ? Infinity : Math.max(0, limit - used), isPremium };
  } catch {
    const used = parseInt(localStorage.getItem(`usage_${userId}`) || '0');
    return { used, limit: FREE_LIMIT, remaining: Math.max(0, FREE_LIMIT - used), isPremium: false };
  }
};

export const incrementUsage = async (userId) => {
  if (!userId) {
    const used = parseInt(localStorage.getItem('guest_usage') || '0') + 1;
    localStorage.setItem('guest_usage', String(used));
    return;
  }

  const storageKey = `usage_${userId}`;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('usage_count')
      .eq('id', userId)
      .single();

    const newCount = (data?.usage_count || 0) + 1;
    await supabase.from('profiles').upsert({ id: userId, usage_count: newCount });
    localStorage.setItem(storageKey, String(newCount));
  } catch {
    const used = parseInt(localStorage.getItem(storageKey) || '0') + 1;
    localStorage.setItem(storageKey, String(used));
  }
};

export const canGenerate = async (userId) => {
  const { used, limit, isPremium } = await getUsage(userId);
  if (isPremium) return true;
  return used < limit;
};
