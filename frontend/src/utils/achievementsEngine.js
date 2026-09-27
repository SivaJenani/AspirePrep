import { INITIAL_BADGES, BADGE_TIERS } from '../data/achievementsData';

/**
 * Evaluates all system badges against the current app store state & user stats.
 * Returns an array of badge objects enriched with:
 * - isUnlocked (boolean)
 * - currentProgress (number)
 * - percent (number 0-100)
 * - unlockedAt (ISO string or null)
 * - isClaimed (boolean)
 */
export function evaluateUserBadges({
    user,
    topicProgress = {},
    mistakes = [],
    flashcards = [],
    duelWins = 0,
    duelLosses = 0,
    userUnlockedState = {}
}) {
    const totalTestsCompleted = (user?.testsCompleted || 0) + (user?.mockTestsSubmitted || 0) + ((duelWins + duelLosses) > 0 ? 1 : 0);
    const streakDays = user?.streakDays || 1;
    const userXp = user?.xp || 0;

    const masteredTopicsCount = Object.values(topicProgress).filter(
        (t) => t.status === 'completed' || t.status === 'mastered'
    ).length;

    const masteredMistakesCount = mistakes.filter((m) => m.isMastered).length;

    const masteredFlashcardsCount = flashcards.filter(
        (f) => f.masteryStatus === 'mastered' || (f.timesReviewed && f.timesReviewed >= 2)
    ).length;

    const perfectScores = user?.perfectScoresCount || 0;
    const earlyBirdSessions = user?.earlyBirdSessions || 0;
    const nightOwlSessions = user?.nightOwlSessions || 0;
    const explainerCount = user?.videoExplainerCount || 0;

    return INITIAL_BADGES.map((badge) => {
        let currentProgress = 0;

        switch (badge.id) {
            case 'early_bird':
                currentProgress = earlyBirdSessions;
                break;
            case 'night_owl':
                currentProgress = nightOwlSessions;
                break;
            case 'streak_3':
            case 'streak_7':
            case 'streak_30':
                currentProgress = streakDays;
                break;
            case 'quiz_novice':
            case 'quiz_master':
                currentProgress = totalTestsCompleted;
                break;
            case 'perfect_score':
                currentProgress = perfectScores;
                break;
            case 'formula_wizard':
                currentProgress = masteredFlashcardsCount;
                break;
            case 'mistake_slayer':
                currentProgress = masteredMistakesCount;
                break;
            case 'duel_warrior':
                currentProgress = duelWins + duelLosses;
                break;
            case 'duel_champion':
                currentProgress = duelWins;
                break;
            case 'syllabus_explorer':
            case 'syllabus_titan':
                currentProgress = masteredTopicsCount;
                break;
            case 'xp_hundred':
            case 'xp_thousand':
                currentProgress = userXp;
                break;
            case 'explainer_scholar':
                currentProgress = explainerCount;
                break;
            default:
                currentProgress = userUnlockedState[badge.id]?.progress || 0;
                break;
        }

        const savedBadgeInfo = userUnlockedState[badge.id] || {};
        const isUnlockedByProgress = currentProgress >= badge.targetCount;
        const isUnlocked = isUnlockedByProgress || !!savedBadgeInfo.unlockedAt;

        const percent = Math.min(100, Math.round((currentProgress / badge.targetCount) * 100));

        return {
            ...badge,
            tierDetails: BADGE_TIERS[badge.tier] || BADGE_TIERS.BRONZE,
            currentProgress: Math.min(currentProgress, badge.targetCount),
            percent,
            isUnlocked,
            unlockedAt: savedBadgeInfo.unlockedAt || (isUnlockedByProgress ? new Date().toISOString() : null),
            isClaimed: !!savedBadgeInfo.isClaimed,
            isFeatured: !!savedBadgeInfo.isFeatured
        };
    });
}
