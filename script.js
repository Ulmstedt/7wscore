class SevenWondersCalculator {
    constructor() {
        this.players = [];
        this.playerCounter = 1;
        this.expansions = {
            edifice: false,
            armada: false,
            cities: false,
            leaders: false
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.syncExpansionStates(); // Sync expansion states with checkboxes
        this.addPlayer(); // Start with one player
        this.renderAllCategoriesScoring();
    }

    bindEvents() {
        document.getElementById('addPlayer').addEventListener('click', () => this.addPlayer());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
        
        // Bind expansion toggles
        document.getElementById('edifice').addEventListener('change', (e) => {
            this.expansions.edifice = e.target.checked;
            this.renderAllCategoriesScoring();
        });
        document.getElementById('armada').addEventListener('change', (e) => {
            this.expansions.armada = e.target.checked;
            this.renderAllCategoriesScoring();
        });
        document.getElementById('cities').addEventListener('change', (e) => {
            this.expansions.cities = e.target.checked;
            this.renderAllCategoriesScoring();
        });
        document.getElementById('leaders').addEventListener('change', (e) => {
            this.expansions.leaders = e.target.checked;
            this.renderAllCategoriesScoring();
        });
    }

    syncExpansionStates() {
        // Check the actual checkbox states and sync with internal state
        const edificeCheckbox = document.getElementById('edifice');
        const armadaCheckbox = document.getElementById('armada');
        const citiesCheckbox = document.getElementById('cities');
        const leadersCheckbox = document.getElementById('leaders');
        
        if (edificeCheckbox) this.expansions.edifice = edificeCheckbox.checked;
        if (armadaCheckbox) this.expansions.armada = armadaCheckbox.checked;
        if (citiesCheckbox) this.expansions.cities = citiesCheckbox.checked;
        if (leadersCheckbox) this.expansions.leaders = leadersCheckbox.checked;
    }

    addPlayer() {
        const player = {
            id: this.playerCounter++,
            name: `Player ${this.playerCounter - 1}`,
            scores: {
                // Base game categories
                militaryConflict: 0,
                coins: 0,
                debt: 0,
                wonders: 0,
                blueCards: 0,
                yellowCards: 0,
                purpleCards: 0,
                scienceCards: 0,
                // Science symbols (gear, mason, script, free)
                scienceGear: 0,
                scienceMason: 0,
                scienceScript: 0,
                scienceFree: 0,
                // Armada expansion
                navalCombat: 0,
                islands: 0,
                // Leaders expansion
                leaders: 0,
                // Cities expansion
                cityCards: 0,
                // Edifice expansion
                projects: 0
            }
        };

        this.players.push(player);
        this.renderPlayers();
        this.renderAllCategoriesScoring();
        this.updateResults();
    }

    removePlayer(playerId) {
        this.players = this.players.filter(p => p.id !== playerId);
        this.renderPlayers();
        this.renderAllCategoriesScoring();
        this.updateResults();
    }

    clearAll() {
        this.players = [];
        this.playerCounter = 1;
        this.renderPlayers();
        this.renderAllCategoriesScoring();
        this.updateResults();
    }

    updatePlayerScore(playerId, category, value) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.scores[category] = parseInt(value) || 0;
            this.updateResults();
        }
    }

    updateScienceSymbol(playerId, symbolType, value) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.scores[symbolType] = parseInt(value) || 0;
            this.renderAllCategoriesScoring(); // Re-render to update science display
            this.updateResults();
        }
    }

    updateCoinDisplay(playerId, value) {
        const coinPoints = Math.floor((parseInt(value) || 0) / 3);
        const displayElement = document.getElementById(`coin-display-${playerId}`);
        if (displayElement) {
            displayElement.textContent = `= ${coinPoints} pts`;
        }
    }

         updateDebtDisplay(playerId, value) {
         const debtPoints = -(parseInt(value) || 0);
         const displayElement = document.getElementById(`debt-display-${playerId}`);
         if (displayElement) {
             displayElement.textContent = `= ${debtPoints} pts`;
         }
     }

     adjustScore(playerId, category, change) {
         const player = this.players.find(p => p.id === playerId);
         if (player) {
             const currentValue = player.scores[category] || 0;
             const newValue = currentValue + change;
             
             // Check minimum value constraints
             const minValue = category === 'militaryConflict' ? -999 : 0;
             if (newValue >= minValue) {
                 player.scores[category] = newValue;
                 
                 // Update the input field
                 const inputElement = document.getElementById(`${category}-${playerId}`);
                 if (inputElement) {
                     inputElement.value = newValue;
                 }
                 
                 // Update real-time displays
                 if (category === 'coins') {
                     this.updateCoinDisplay(playerId, newValue);
                 } else if (category === 'debt') {
                     this.updateDebtDisplay(playerId, newValue);
                 }
                 
                 this.updateResults();
             }
         }
     }

    calculateScienceScore(scienceGear, scienceMason, scienceScript, scienceFree) {
        // Science scoring: 7 points per set of 3 different symbols + n² points per symbol
        const symbols = [scienceGear || 0, scienceMason || 0, scienceScript || 0];
        const free = scienceFree || 0;
        
        // Find optimal wildcard assignment to maximize total score
        let maxTotalScore = 0;
        let optimalAssignment = [0, 0, 0];
        
        // Try all possible wildcard assignments
        for (let gearWild = 0; gearWild <= free; gearWild++) {
            for (let masonWild = 0; masonWild <= free - gearWild; masonWild++) {
                const scriptWild = free - gearWild - masonWild;
                
                const totalGear = symbols[0] + gearWild;
                const totalMason = symbols[1] + masonWild;
                const totalScript = symbols[2] + scriptWild;
                
                // Calculate sets with this assignment
                const sets = Math.min(totalGear, totalMason, totalScript);
                const setPoints = sets * 7;
                
                // Calculate n² points for each symbol (including wildcards)
                const individualPoints = (totalGear * totalGear) + (totalMason * totalMason) + (totalScript * totalScript);
                
                const totalScore = setPoints + individualPoints;
                
                if (totalScore > maxTotalScore) {
                    maxTotalScore = totalScore;
                    optimalAssignment = [gearWild, masonWild, scriptWild];
                }
            }
        }
        
        // Calculate final values with optimal assignment
        const [gearWild, masonWild, scriptWild] = optimalAssignment;
        const totalGear = symbols[0] + gearWild;
        const totalMason = symbols[1] + masonWild;
        const totalScript = symbols[2] + scriptWild;
        
        const sets = Math.min(totalGear, totalMason, totalScript);
        const setPoints = sets * 7;
        const individualPoints = (totalGear * totalGear) + (totalMason * totalMason) + (totalScript * totalScript);
        
        let breakdown = `Sets: ${sets}×7 + Individual: ${individualPoints}`;
        if (free > 0) {
            breakdown += ` (Wildcards: <img src="resources/Science-Gear.webp" alt="Gear" class="science-icon" style="display: inline; width: 16px; height: 16px;">+${gearWild} <img src="resources/Science-Mason.webp" alt="Mason" class="science-icon" style="display: inline; width: 16px; height: 16px;">+${masonWild} <img src="resources/Science-Script.webp" alt="Script" class="science-icon" style="display: inline; width: 16px; height: 16px;">+${scriptWild})`;
        }
        
        return {
            sets: sets,
            individualPoints: individualPoints,
            totalScore: maxTotalScore,
            breakdown: breakdown
        };
    }

    updatePlayerName(playerId, name) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.name = name;
            this.renderAllCategoriesScoring();
            this.updateResults();
        }
    }

    calculateTotalScore(scores) {
        // Calculate coin points (1 point per 3 coins)
        const coinPoints = Math.floor(scores.coins / 3);
        
        // Calculate science score
        const scienceScore = this.calculateScienceScore(
            scores.scienceGear || 0,
            scores.scienceMason || 0,
            scores.scienceScript || 0,
            scores.scienceFree || 0
        );
        
        let total = scores.militaryConflict + coinPoints - scores.debt + scores.wonders + 
                   scores.blueCards + scores.yellowCards + scores.purpleCards + scienceScore.totalScore;
        
        // Add Armada expansion scores if enabled
        if (this.expansions.armada) {
            total += scores.navalCombat + scores.islands;
        }
        
        // Add Leaders expansion scores if enabled
        if (this.expansions.leaders) {
            total += scores.leaders;
        }
        
        // Add Cities expansion scores if enabled
        if (this.expansions.cities) {
            total += scores.cityCards;
        }
        
        // Add Edifice expansion scores if enabled
        if (this.expansions.edifice) {
            total += scores.projects;
        }
        
        return total;
    }

    getCategoryInfo(category) {
        const categoryInfo = {
            // Base game categories
            militaryConflict: {
                name: 'Military Conflict',
                description: 'Victory tokens',
                placeholder: '0',
                icon: '<img src="resources/Strength-Military.webp" alt="Military Conflict" class="category-icon">'
            },
            coins: {
                name: 'Coins',
                description: 'Total coins (1 point per 3 coins)',
                placeholder: '0',
                icon: '<img src="resources/Coin-3.webp" alt="Coins" class="category-icon">'
            },
            debt: {
                name: 'Debt',
                description: 'Debt penalty points',
                placeholder: '0',
                icon: '💸'
            },
            wonders: {
                name: 'Wonders',
                description: 'Points from completed wonder stages',
                placeholder: '0',
                icon: '<img src="resources/wonder.webp" alt="Wonders" class="category-icon">'
            },
            blueCards: {
                name: 'Blue Cards',
                description: 'Civilian structures: points shown on card',
                placeholder: '0',
                icon: '<img src="resources/Victory-1.webp" alt="Blue Cards" class="category-icon">'
            },
            yellowCards: {
                name: 'Yellow Cards',
                description: 'Commercial structures: various bonuses',
                placeholder: '0',
                icon: '🏪'
            },
            purpleCards: {
                name: 'Purple Cards',
                description: 'Guilds: special scoring',
                placeholder: '0',
                icon: '🏰'
            },
            scienceCards: {
                name: 'Science Cards',
                description: 'Enter symbols',
                placeholder: '0',
                icon: '🔬'
            },
            // Armada expansion categories
            navalCombat: {
                name: 'Naval Combat',
                description: 'Naval combat victory points',
                placeholder: '0',
                icon: '<img src="resources/Strength-Naval1.webp" alt="Naval Combat" class="category-icon">'
            },
            islands: {
                name: 'Islands',
                description: 'Points from island exploration',
                placeholder: '0',
                icon: '🏝️'
            },
            // Leaders expansion categories
            leaders: {
                name: 'Leaders',
                description: 'Points from leader cards',
                placeholder: '0',
                icon: '👑'
            },
            // Cities expansion categories
            cityCards: {
                name: 'Black Cards',
                description: 'Points from city cards',
                placeholder: '0',
                icon: '🏙️'
            },
            // Edifice expansion categories
            projects: {
                name: 'Projects',
                description: 'Points from Edifice projects',
                placeholder: '0',
                icon: '🏗️'
            }
        };
        return categoryInfo[category];
    }

    renderPlayers() {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';

        this.players.forEach((player, index) => {
            const playerCard = this.createPlayerCard(player, index);
            playersList.appendChild(playerCard);
        });
    }

    createPlayerCard(player, index) {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <button class="remove-player-btn" onclick="calculator.removePlayer(${player.id})" title="Remove player" tabindex="-1">×</button>
            <div class="player-header">
                <input type="text" 
                       class="player-name" 
                       value="${player.name}" 
                       onchange="calculator.updatePlayerName(${player.id}, this.value)"
                       tabindex="${index + 1}">
            </div>
        `;
        return card;
    }

    renderAllCategoriesScoring() {
        const allCategoriesScoring = document.getElementById('allCategoriesScoring');
        
        if (this.players.length === 0) {
            allCategoriesScoring.innerHTML = '<p class="no-results">Add players to start scoring</p>';
            return;
        }

        const baseCategories = [
            'militaryConflict',
            'coins',
            'debt',
            'wonders',
            'blueCards',
            'scienceCards',
            'yellowCards',
            'purpleCards'
        ];

        // Define expansion categories
        const armadaCategories = ['navalCombat', 'islands'];
        const leadersCategories = ['leaders'];
        const citiesCategories = ['cityCards'];
        const edificeCategories = ['projects'];

        // Combine base categories with enabled expansion categories
        const categories = [...baseCategories];
        
        if (this.expansions.armada) {
            categories.push(...armadaCategories);
        }
        if (this.expansions.leaders) {
            categories.push(...leadersCategories);
        }
        if (this.expansions.cities) {
            categories.push(...citiesCategories);
        }
        if (this.expansions.edifice) {
            categories.push(...edificeCategories);
        }

        let html = '';
        
        categories.forEach(category => {
            const categoryInfo = this.getCategoryInfo(category);
            
            // Determine CSS class for category styling
            let categoryClass = '';
            switch(category) {
                case 'militaryConflict':
                    categoryClass = 'military-conflict';
                    break;
                case 'coins':
                    categoryClass = 'coins';
                    break;
                case 'debt':
                    categoryClass = 'debt';
                    break;
                case 'wonders':
                    categoryClass = 'wonders';
                    break;
                case 'blueCards':
                    categoryClass = 'blue-cards';
                    break;
                case 'yellowCards':
                    categoryClass = 'yellow-cards';
                    break;
                case 'purpleCards':
                    categoryClass = 'purple-cards';
                    break;
                case 'scienceCards':
                    categoryClass = 'science-cards';
                    break;
                case 'navalCombat':
                    categoryClass = 'naval-combat';
                    break;
                case 'islands':
                    categoryClass = 'islands';
                    break;
                case 'leaders':
                    categoryClass = 'leaders';
                    break;
                case 'cityCards':
                    categoryClass = 'black-cards';
                    break;
                case 'projects':
                    categoryClass = 'projects';
                    break;
            }
            
            html += `
                <div class="category-section">
                    <div class="category-header ${categoryClass}">
                        <div class="category-title">
                            <span class="category-icon">${categoryInfo.icon}</span>
                            <h3>${categoryInfo.name}</h3>
                        </div>
                        <p>${categoryInfo.description}</p>
                    </div>
                    <div class="scoring-inputs">
            `;

            this.players.forEach(player => {
                if (category === 'scienceCards') {
                    // Special handling for science cards with multiple symbol inputs
                    const gearCount = player.scores.scienceGear || 0;
                    const masonCount = player.scores.scienceMason || 0;
                    const scriptCount = player.scores.scienceScript || 0;
                    const freeCount = player.scores.scienceFree || 0;
                    
                    const scienceScore = this.calculateScienceScore(gearCount, masonCount, scriptCount, freeCount);
                    
                    html += `
                        <div class="scoring-row science-row">
                            <span class="player-label">${player.name}</span>
                            <div class="science-inputs">
                                                                 <div class="science-symbol">
                                     <label><img src="resources/Science-Gear.webp" alt="Gear" class="science-icon"></label>
                                     <input type="number" 
                                            id="science-gear-${player.id}" 
                                            value="${gearCount}" 
                                            onchange="calculator.updateScienceSymbol(${player.id}, 'scienceGear', this.value)"
                                            placeholder="0"
                                            step="1"
                                            min="0">
                                 </div>
                                 <div class="science-symbol">
                                     <label><img src="resources/Science-Mason.webp" alt="Mason" class="science-icon"></label>
                                     <input type="number" 
                                            id="science-mason-${player.id}" 
                                            value="${masonCount}" 
                                            onchange="calculator.updateScienceSymbol(${player.id}, 'scienceMason', this.value)"
                                            placeholder="0"
                                            step="1"
                                            min="0">
                                 </div>
                                 <div class="science-symbol">
                                     <label><img src="resources/Science-Script.webp" alt="Script" class="science-icon"></label>
                                     <input type="number" 
                                            id="science-script-${player.id}" 
                                            value="${scriptCount}" 
                                            onchange="calculator.updateScienceSymbol(${player.id}, 'scienceScript', this.value)"
                                            placeholder="0"
                                            step="1"
                                            min="0">
                                 </div>
                                 <div class="science-symbol">
                                     <label>🎲</label>
                                     <input type="number" 
                                            id="science-free-${player.id}" 
                                            value="${freeCount}" 
                                            onchange="calculator.updateScienceSymbol(${player.id}, 'scienceFree', this.value)"
                                            placeholder="0"
                                            step="1"
                                            min="0">
                                 </div>
                                <div class="science-score-display">
                                    <span class="score-display">= ${scienceScore.totalScore} pts</span>
                                    <span class="science-breakdown">${scienceScore.breakdown}</span>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    const currentScore = player.scores[category] || 0;
                    let displayScore, displayText;
                    
                    if (category === 'coins') {
                        displayScore = Math.floor(currentScore / 3);
                        displayText = `= ${displayScore} pts`;
                    } else if (category === 'debt') {
                        displayScore = -currentScore;
                        displayText = `= ${displayScore} pts`;
                    } else {
                        displayScore = currentScore;
                        displayText = 'pts';
                    }
                    
                                                              html += `
                         <div class="scoring-row">
                             <span class="player-label">${player.name}</span>
                             <div class="score-input">
                                 <div class="number-controls">
                                     <button type="button" class="decrease-btn" onclick="calculator.adjustScore(${player.id}, '${category}', -1)" title="Decrease by 1">−</button>
                                     <input type="number" 
                                            id="${category}-${player.id}" 
                                            value="${currentScore}" 
                                            onchange="calculator.updatePlayerScore(${player.id}, '${category}', this.value)"
                                            ${category === 'coins' ? `oninput="calculator.updateCoinDisplay(${player.id}, this.value)"` : ''}
                                            ${category === 'debt' ? `oninput="calculator.updateDebtDisplay(${player.id}, this.value)"` : ''}
                                            placeholder="${categoryInfo.placeholder}"
                                            step="1"
                                            min="${category === 'militaryConflict' ? '-999' : '0'}">
                                     <button type="button" class="increase-btn" onclick="calculator.adjustScore(${player.id}, '${category}', 1)" title="Increase by 1">+</button>
                                 </div>
                                 ${category === 'coins' ? 
                                     `<span class="score-display" id="coin-display-${player.id}">= ${Math.floor(currentScore / 3)} pts</span>` : 
                                     category === 'debt' ? 
                                     `<span class="score-display debt-display" id="debt-display-${player.id}">= -${currentScore} pts</span>` :
                                     `<span class="score-display">pts</span>`
                                 }
                             </div>
                         </div>
                     `;
                }
            });

            html += `
                    </div>
                </div>
            `;
        });

        allCategoriesScoring.innerHTML = html;
    }

    updateResults() {
        const resultsDiv = document.getElementById('results');
        
        if (this.players.length === 0) {
            resultsDiv.innerHTML = '<p class="no-results">Add players and scores to see results</p>';
            return;
        }

        // Calculate totals and sort players with coin tiebreaker
        const playerResults = this.players.map(player => ({
            ...player,
            totalScore: this.calculateTotalScore(player.scores)
        })).sort((a, b) => {
            // First sort by total score (descending)
            if (a.totalScore !== b.totalScore) {
                return b.totalScore - a.totalScore;
            }
            // If scores are equal, sort by coins (descending) as tiebreaker
            return b.scores.coins - a.scores.coins;
        });

        const winner = playerResults[0];
        const isTie = playerResults.length > 1 && 
                     playerResults[0].totalScore === playerResults[1].totalScore && 
                     playerResults[0].scores.coins === playerResults[1].scores.coins;

        let resultsHTML = '';
        
        if (isTie) {
            const winners = playerResults.filter(p => 
                p.totalScore === winner.totalScore && p.scores.coins === winner.scores.coins
            );
            const winnerNames = winners.map(w => w.name).join(' & ');
            resultsHTML += `
                <div class="winner">
                    🏆 Tie! ${winnerNames} - ${winner.totalScore} points (${winner.scores.coins} coins)
                </div>
            `;
        } else {
            resultsHTML += `
                <div class="winner">
                    🏆 Winner: ${winner.name} - ${winner.totalScore} points (${winner.scores.coins} coins)
                </div>
            `;
        }

        resultsHTML += '<div class="score-list">';
        playerResults.forEach((player, index) => {
            const isWinner = player.totalScore === winner.totalScore && player.scores.coins === winner.scores.coins;
            resultsHTML += `
                <div class="score-item ${isWinner ? 'winner-item' : ''}">
                    <span class="player-score">${index + 1}. ${player.name}</span>
                    <span class="score-value">${player.totalScore} pts (${player.scores.coins} coins)</span>
                </div>
            `;
        });
        resultsHTML += '</div>';

        resultsDiv.innerHTML = resultsHTML;
    }
}

// Initialize the calculator when the page loads
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new SevenWondersCalculator();
});
