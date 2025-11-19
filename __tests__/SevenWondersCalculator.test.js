const SevenWondersCalculator = require('../src/calculator.js');

describe('SevenWondersCalculator core scoring', () => {
    let calculator;

    beforeEach(() => {
        calculator = new SevenWondersCalculator({ autoInit: false });
    });

    describe('calculateScienceScore', () => {
        test('maximizes wildcards for sets and individual points', () => {
            const result = calculator.calculateScienceScore(1, 1, 0, 1);

            expect(result.sets).toBe(1);
            expect(result.totalScore).toBe(10); // 1 set (7 pts) + 1^2 + 1^2 + 1^2
            expect(result.wildAssignment.script).toBe(1);
            expect(result.totals).toEqual({ gear: 1, mason: 1, script: 1 });
        });

        test('returns zero values when no symbols are present', () => {
            const result = calculator.calculateScienceScore(0, 0, 0, 0);

            expect(result.sets).toBe(0);
            expect(result.individualPoints).toBe(0);
            expect(result.totalScore).toBe(0);
        });

        test.each([
            {
                label: 'balanced symbols without wildcards',
                input: [2, 2, 5, 0],
                expected: { sets: 2, totals: { gear: 2, mason: 2, script: 5 }, totalScore: 47 }
            },
            {
                label: 'wildcards only should spread evenly',
                input: [0, 0, 0, 3],
                expected: { sets: 1, totals: { gear: 1, mason: 1, script: 1 }, totalScore: 10 }
            },
            {
                label: 'wildcards prefer balancing to unlock sets',
                input: [1, 0, 1, 1],
                expected: { sets: 1, totals: { gear: 1, mason: 1, script: 1 }, totalScore: 10 }
            },
            {
                label: 'wildcards stay in same symbol when no set possible',
                input: [5, 0, 0, 1],
                expected: { sets: 0, totals: { gear: 6, mason: 0, script: 0 }, totalScore: 36 }
            },
            {
                label: 'wildcards favor large n² bonus over imbalanced set',
                input: [0, 2, 0, 2],
                expected: { sets: 0, totals: { gear: 0, mason: 4, script: 0 }, totalScore: 16 }
            }
        ])('handles $label', ({ input, expected }) => {
            const [gear, mason, script, free] = input;
            const result = calculator.calculateScienceScore(gear, mason, script, free);

            expect(result.sets).toBe(expected.sets);
            expect(result.totals).toEqual(expected.totals);
            expect(result.totalScore).toBe(expected.totalScore);
        });
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

