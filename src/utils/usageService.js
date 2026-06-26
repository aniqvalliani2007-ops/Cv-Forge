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
    // Try to get existing profile
    let { data, error } = await supabase
      .from('profiles')
      .select('usage_count, is_premium')
      .eq('id', userId)
      .single();

    // If profile doesn't exist, create it
    if (error && error.code === 'PGRST116') {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, usage_count: 0, is_premium: false })
        .select()
        .single();
      
      if (!insertError && newProfile) {
        data = newProfile;
        error = null;
      }
    }

    if (error || !data) {
      // Fallback to localStorage
      const used = parseInt(localStorage.getItem(`usage_${userId}`) || '0');
      return { used, limit: FREE_LIMIT, remaining: Math.max(0, FREE_LIMIT - used), isPremium: false };
    }

    const isPremium = data.is_premium || false;
    const used = data.usage_count || 0;
    const limit = isPremium ? Infinity : FREE_LIMIT;
    return { used, limit, remaining: isPremium ? Infinity : Math.max(0, limit - used), isPremium };
  } catch (err) {
    console.error('getUsage error:', err);
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
    // Try to get current usage
    let { data, error } = await supabase
      .from('profiles')
      .select('usage_count')
      .eq('id', userId)
      .single();

    // If profile doesn't exist, create it with count 1
    if (error && error.code === 'PGRST116') {
      await supabase.from('profiles').insert({ id: userId, usage_count: 1, is_premium: false });
      localStorage.setItem(storageKey, '1');
      return;
    }

    // Update existing profile
    const newCount = (data?.usage_count || 0) + 1;
    await supabase.from('profiles').update({ usage_count: newCount }).eq('id', userId);
    localStorage.setItem(storageKey, String(newCount));
  } catch (err) {
    console.error('incrementUsage error:', err);
    const used = parseInt(localStorage.getItem(storageKey) || '0') + 1;
    localStorage.setItem(storageKey, String(used));
  }
};

export const canGenerate = async (userId) => {
  const { used, limit, isPremium } = await getUsage(userId);
  if (isPremium) return true;
  return used < limit;
};
