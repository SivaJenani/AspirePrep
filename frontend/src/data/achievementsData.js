export const BADGE_TIERS = {
    BRONZE: { name: 'Bronze', color: 'from-amber-700 to-amber-900', border: 'border-amber-600/50', badgeBg: 'bg-amber-950/40 text-amber-300', xp: 50 },
    SILVER: { name: 'Silver', color: 'from-slate-400 to-slate-600', border: 'border-slate-400/50', badgeBg: 'bg-slate-800/60 text-slate-200', xp: 150 },
    GOLD: { name: 'Gold', color: 'from-amber-400 to-yellow-600', border: 'border-amber-400/60', badgeBg: 'bg-amber-500/20 text-amber-300', xp: 300 },
    PLATINUM: { name: 'Platinum', color: 'from-cyan-400 to-blue-600', border: 'border-cyan-400/60', badgeBg: 'bg-cyan-500/20 text-cyan-300', xp: 500 },
    LEGENDARY: { name: 'Legendary', color: 'from-fuchsia-500 via-purple-500 to-indigo-600', border: 'border-fuchsia-500/80', badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300', xp: 1000 }
};

export const BADGE_CATEGORIES = [
    { id: 'all', label: 'All Badges' },
    { id: 'habits', label: 'Study Habits' },
    { id: 'mastery', label: 'Practice & Mastery' },
    { id: 'speed', label: 'Duels & Speed' },
    { id: 'milestone', label: 'Milestones & XP' }
];

export const INITIAL_BADGES = [
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Completed a study session or practice set early in the morning before 8:00 AM.',
        category: 'habits',
        tier: 'BRONZE',
        iconName: 'SunMedium',
        targetCount: 1,
        unit: 'early morning session',
        rewardXp: 50,
        hint: 'Study early between 5 AM and 8 AM to wake up your brain!'
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Logged focused study time late at night after 10:00 PM.',
        category: 'habits',
        tier: 'BRONZE',
        iconName: 'Moon',
        targetCount: 1,
        unit: 'late night session',
        rewardXp: 50,
        hint: 'Complete practice or formula reviews after 10 PM.'
    },
    {
        id: 'streak_3',
        title: 'Consistency Cadet',
        description: 'Maintained a continuous 3-day study streak.',
        category: 'habits',
        tier: 'BRONZE',
        iconName: 'Flame',
        targetCount: 3,
        unit: 'days streak',
        rewardXp: 100,
        hint: 'Log in and study 3 days in a row.'
    },
    {
        id: 'streak_7',
        title: 'Streak Sentinel',
        description: 'Maintained an unbroken 7-day study streak.',
        category: 'habits',
        tier: 'SILVER',
        iconName: 'Flame',
        targetCount: 7,
        unit: 'days streak',
        rewardXp: 250,
        hint: 'Keep your momentum going for a full week!'
    },
    {
        id: 'streak_30',
        title: 'Iron Will Scholar',
        description: 'Achieved an extraordinary 30-day continuous study streak.',
        category: 'habits',
        tier: 'LEGENDARY',
        iconName: 'Crown',
        targetCount: 30,
        unit: 'days streak',
        rewardXp: 1000,
        hint: 'Complete 30 consecutive days of focused prep.'
    },
    {
        id: 'quiz_novice',
        title: 'Quiz Starter',
        description: 'Completed your first official practice set or mock test.',
        category: 'mastery',
        tier: 'BRONZE',
        iconName: 'Award',
        targetCount: 1,
        unit: 'test completed',
        rewardXp: 50,
        hint: 'Take any practice quiz from the Practice Hub or Mock Tests.'
    },
    {
        id: 'quiz_master',
        title: 'Quiz Master',
        description: 'Completed 10 practice sets or mock tests.',
        category: 'mastery',
        tier: 'SILVER',
        iconName: 'Zap',
        targetCount: 10,
        unit: 'tests completed',
        rewardXp: 300,
        hint: 'Finish 10 total practice sessions or mock test papers.'
    },
    {
        id: 'perfect_score',
        title: 'Sharp Shooter',
        description: 'Achieved 100% accuracy in a practice set or speed quiz.',
        category: 'mastery',
        tier: 'GOLD',
        iconName: 'Target',
        targetCount: 1,
        unit: '100% score',
        rewardXp: 400,
        hint: 'Answer all questions correctly in any practice session.'
    },
    {
        id: 'formula_wizard',
        title: 'Formula Wizard',
        description: 'Mastered 10 formula deck flashcards using spaced repetition.',
        category: 'mastery',
        tier: 'SILVER',
        iconName: 'Sparkles',
        targetCount: 10,
        unit: 'flashcards mastered',
        rewardXp: 200,
        hint: 'Review flashcards in Formula Deck & Mnemonics.'
    },
    {
        id: 'mistake_slayer',
        title: 'Mistake Slayer',
        description: 'Mastered 5 incorrect questions in your Mistake Notebook.',
        category: 'mastery',
        tier: 'SILVER',
        iconName: 'ShieldCheck',
        targetCount: 5,
        unit: 'mistakes conquered',
        rewardXp: 250,
        hint: 'Retest incorrect answers in the Mistake Notebook.'
    },
    {
        id: 'duel_warrior',
        title: 'Duel Warrior',
        description: 'Participated in your first 1v1 Speed Duel match.',
        category: 'speed',
        tier: 'BRONZE',
        iconName: 'Swords',
        targetCount: 1,
        unit: 'duel match',
        rewardXp: 75,
        hint: 'Battle a friend or bot in 1v1 Speed Duel.'
    },
    {
        id: 'duel_champion',
        title: 'Duel Champion',
        description: 'Won 5 Speed Duel battles against opponents.',
        category: 'speed',
        tier: 'GOLD',
        iconName: 'Trophy',
        targetCount: 5,
        unit: 'duel victories',
        rewardXp: 450,
        hint: 'Win 5 speed duel quizzes in the Speed Duel Arena.'
    },
    {
        id: 'syllabus_explorer',
        title: 'Syllabus Explorer',
        description: 'Completed or mastered 5 topics in your exam syllabus.',
        category: 'milestone',
        tier: 'BRONZE',
        iconName: 'BookOpen',
        targetCount: 5,
        unit: 'topics completed',
        rewardXp: 150,
        hint: 'Mark topics as Completed or Mastered in Syllabus Database.'
    },
    {
        id: 'syllabus_titan',
        title: 'Syllabus Titan',
        description: 'Completed or mastered 20 topics across your target exam.',
        category: 'milestone',
        tier: 'PLATINUM',
        iconName: 'GraduationCap',
        targetCount: 20,
        unit: 'topics mastered',
        rewardXp: 600,
        hint: 'Advance your syllabus completion to 20+ topics.'
    },
    {
        id: 'xp_hundred',
        title: 'Rising Aspirant',
        description: 'Accumulated 250 total XP across all activities.',
        category: 'milestone',
        tier: 'BRONZE',
        iconName: 'TrendingUp',
        targetCount: 250,
        unit: 'XP',
        rewardXp: 100,
        hint: 'Earn XP by completing quizzes, duels, and syllabus topics.'
    },
    {
        id: 'xp_thousand',
        title: 'Master Scholar',
        description: 'Crossed 1,000 total XP milestone on AspirePrep.',
        category: 'milestone',
        tier: 'GOLD',
        iconName: 'Medal',
        targetCount: 1000,
        unit: 'XP',
        rewardXp: 500,
        hint: 'Reach 1,000 XP through continuous prep.'
    },
    {
        id: 'explainer_scholar',
        title: '3D Explainer Scholar',
        description: 'Generated or studied a 3D Concept Video Explainer.',
        category: 'milestone',
        tier: 'SILVER',
        iconName: 'Video',
        targetCount: 1,
        unit: '3D explainer generated',
        rewardXp: 150,
        hint: 'Use the AI 3D Concept Video Explainer tool.'
    }
];
