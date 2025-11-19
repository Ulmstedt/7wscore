const SCORE_CATEGORIES = [
    'militaryConflict',
    'coins',
    'debt',
    'wonders',
    'blueCards',
    'yellowCards',
    'purpleCards',
    'scienceCards',
    'scienceGear',
    'scienceMason',
    'scienceScript',
    'scienceFree',
    'navalCombat',
    'islands',
    'navalTrack',
    'leaders',
    'cityCards',
    'projects'
];

function createDefaultScores() {
    return SCORE_CATEGORIES.reduce((scores, category) => {
        scores[category] = 0;
        return scores;
    }, {});
}

function createPlayer(id, name = `Player ${id}`) {
    return {
        id,
        name,
        scores: createDefaultScores()
    };
}

function resetPlayerScores(player) {
    if (!player || !player.scores) return;
    Object.assign(player.scores, createDefaultScores());
}

const exported = {
    createPlayer,
    resetPlayerScores,
    createDefaultScores
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
} else if (typeof window !== 'undefined') {
    window.PlayerFactory = exported;
}

