const SevenWondersCalculator = require('../script');

describe('SevenWondersCalculator core scoring', () => {
    let calculator;

    beforeEach(() => {
        calculator = new SevenWondersCalculator({ autoInit: false });
    });

    test('calculateScienceScore maximizes wildcards for sets and individual points', () => {
        const result = calculator.calculateScienceScore(1, 1, 0, 1);

        expect(result.sets).toBe(1);
        expect(result.totalScore).toBe(10); // 1 set (7 pts) + 1^2 + 1^2 + 1^2
        expect(result.wildAssignment.script).toBe(1);
        expect(result.totals).toEqual({ gear: 1, mason: 1, script: 1 });
    });

    test('calculateScienceScore returns zero values when no symbols are present', () => {
        const result = calculator.calculateScienceScore(0, 0, 0, 0);

        expect(result.sets).toBe(0);
        expect(result.individualPoints).toBe(0);
        expect(result.totalScore).toBe(0);
    });

    test('calculateTotalScore excludes expansion points when toggles are off', () => {
        const scores = {
            militaryConflict: 5,
            coins: 8,
            debt: 2,
            wonders: 10,
            blueCards: 6,
            yellowCards: 4,
            purpleCards: 3,
            scienceCards: 0,
            scienceGear: 2,
            scienceMason: 1,
            scienceScript: 1,
            scienceFree: 0,
            navalCombat: 7,
            islands: 3,
            navalTrack: 2,
            leaders: 4,
            cityCards: 5,
            projects: 6
        };

        const total = calculator.calculateTotalScore(scores);

        expect(total).toBe(41); // Base scores only, no expansion toggles enabled
    });

    test('calculateTotalScore includes enabled expansion categories', () => {
        const scores = {
            militaryConflict: 5,
            coins: 8,
            debt: 2,
            wonders: 10,
            blueCards: 6,
            yellowCards: 4,
            purpleCards: 3,
            scienceCards: 0,
            scienceGear: 2,
            scienceMason: 1,
            scienceScript: 1,
            scienceFree: 0,
            navalCombat: 7,
            islands: 3,
            navalTrack: 2,
            leaders: 4,
            cityCards: 5,
            projects: 6
        };

        calculator.expansions.armada = true;
        calculator.expansions.leaders = true;
        calculator.expansions.cities = true;
        calculator.expansions.edifice = true;

        const total = calculator.calculateTotalScore(scores);

        expect(total).toBe(68); // Base 41 + armada 12 + leaders 4 + cities 5 + edifice 6
    });
});

