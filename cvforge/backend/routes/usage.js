const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Get user usage
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('profiles')
            .select('usage_count, is_premium')
            .eq('id', userId)
            .single();

        if (error) throw error;

        // Get monthly count
        const { data: monthlyCount } = await supabase
            .rpc('get_monthly_generation_count', { p_user_id: userId });

        const remaining = data.is_premium ? 'Unlimited' : Math.max(0, 3 - (monthlyCount || 0));

        res.json({
            used: monthlyCount || 0,
            limit: data.is_premium ? 'Unlimited' : 3,
            remaining,
            isPremium: data.is_premium || false,
            totalGenerations: data.usage_count || 0
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's recent CVs
router.get('/recent/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 5 } = req.query;

        const { data, error } = await supabase
            .rpc('get_recent_cvs', { p_user_id: userId, p_limit: parseInt(limit) });

        if (error) throw error;

        res.json({ success: true, cvs: data });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;