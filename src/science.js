function calculateScienceScore(scienceGear, scienceMason, scienceScript, scienceFree) {
    const symbols = [scienceGear || 0, scienceMason || 0, scienceScript || 0];
    const free = scienceFree || 0;

    let maxTotalScore = 0;
    let optimalAssignment = [0, 0, 0];

    for (let gearWild = 0; gearWild <= free; gearWild++) {
        for (let masonWild = 0; masonWild <= free - gearWild; masonWild++) {
            const scriptWild = free - gearWild - masonWild;

            const totalGear = symbols[0] + gearWild;
            const totalMason = symbols[1] + masonWild;
            const totalScript = symbols[2] + scriptWild;

            const sets = Math.min(totalGear, totalMason, totalScript);
            const setPoints = sets * 7;
            const individualPoints = (totalGear * totalGear) + (totalMason * totalMason) + (totalScript * totalScript);
            const totalScore = setPoints + individualPoints;

            if (totalScore > maxTotalScore) {
                maxTotalScore = totalScore;
                optimalAssignment = [gearWild, masonWild, scriptWild];
            }
        }
    }

    const [gearWild, masonWild, scriptWild] = optimalAssignment;
    const totalGear = symbols[0] + gearWild;
    const totalMason = symbols[1] + masonWild;
    const totalScript = symbols[2] + scriptWild;

    const sets = Math.min(totalGear, totalMason, totalScript);
    const setPoints = sets * 7;
    const individualPoints = (totalGear * totalGear) + (totalMason * totalMason) + (totalScript * totalScript);

    let breakdown = `Sets: ${sets}×7 + Individual: ${individualPoints}`;
    if (free > 0) {
        breakdown += ` (Wildcards: `;
        if (gearWild > 0) {
            breakdown += `<img src="resources/Science-Gear.webp" alt="Gear" class="science-icon" style="display: inline; width: 16px; height: 16px;">+${gearWild} `;
        }
        if (masonWild > 0) {
            breakdown += `<img src="resources/Science-Mason.webp" alt="Mason" class="science-icon" style="display: inline; width: 16px; height: 16px;">+${masonWild} `;
        }
        if (scriptWild > 0) {
            breakdown += `<img src="resources/Science-Script.webp" alt="Script" class="science-icon" style="display: inline; width: 16px; height: 16px;">+${scriptWild} `;
        }
        breakdown += `)`;
    }

    return {
        sets,
        individualPoints,
        totalScore: maxTotalScore,
        breakdown,
        baseSymbols: {
            gear: symbols[0],
            mason: symbols[1],
            script: symbols[2]
        },
        wildAssignment: {
            gear: gearWild,
            mason: masonWild,
            script: scriptWild
        },
        totals: {
            gear: totalGear,
            mason: totalMason,
            script: totalScript
        },
        freeSymbols: free
    };
}

const exported = { calculateScienceScore };

if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
} else if (typeof window !== 'undefined') {
    window.SevenWondersScoring = exported;
}

