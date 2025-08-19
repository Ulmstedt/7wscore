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
        this.selectedSuggestionIndex = -1; // Track selected suggestion for arrow key navigation
        this.currentSuggestions = []; // Store current suggestions for the active input
        this.activePlayerId = null; // Track which player input is currently active
        this.sortBy = 'time'; // 'time' or 'score'
        this.sortOrder = 'desc'; // 'asc' or 'desc'
        this.expansionFilters = {
            edifice: false,
            armada: false,
            cities: false,
            leaders: false,
            baseOnly: false
        };
        this.showExpansionFilters = false; // Track filter visibility
        this.init();
    }

    init() {
        this.bindEvents();
        this.syncExpansionStates(); // Sync expansion states with checkboxes
        // Start with three players by default
        for (let i = 0; i < 3; i++) {
            this.addPlayer();
        }
        this.renderAllCategoriesScoring();
    }

    bindEvents() {
        document.getElementById('addPlayer').addEventListener('click', () => this.addPlayer());
        document.getElementById('clearScores').addEventListener('click', () => this.clearScores());
        const clearAllBtn = document.getElementById('clearAll');
        if (clearAllBtn) clearAllBtn.addEventListener('click', () => this.clearAll());
        
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
        // Enforce minimum of 3 players
        if (this.players.length <= 3) {
            return;
        }
        this.players = this.players.filter(p => p.id !== playerId);
        this.renderPlayers();
        this.renderAllCategoriesScoring();
        this.updateResults();
    }

    clearAll() {
        // Keep minimum 3 players when clearing
        this.players = [];
        this.playerCounter = 1;
        for (let i = 0; i < 3; i++) {
            this.addPlayer();
        }
        this.renderPlayers();
        this.renderAllCategoriesScoring();
        this.updateResults();
    }

    clearScores() {
        // Reset all scores to 0 but keep players
        this.players.forEach(player => {
            // Reset all scoring categories to 0
            Object.keys(player.scores).forEach(category => {
                player.scores[category] = 0;
            });
            // Reset science symbols to 0
            if (player.scienceSymbols) {
                player.scienceSymbols.gear = 0;
                player.scienceSymbols.mason = 0;
                player.scienceSymbols.script = 0;
                player.scienceSymbols.wild = 0;
            }
        });
        
        // Re-render the scoring sections and update results
        this.renderAllCategoriesScoring();
        this.updateResults();
    }

    sendSuggestion() {
        const subject = encodeURIComponent('7 Wonders Score Calculator - Suggestion');
        const body = encodeURIComponent(`Hi!

I have a suggestion for the 7 Wonders Score Calculator:

[Please describe your suggestion here]

Thanks!`);
        const mailtoLink = `mailto:matte___93@hotmail.com?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
    }

    donate() {
        // Open PayPal donation page in a new window
        const paypalUrl = 'https://www.paypal.com/donate/?hosted_button_id=F2CB8PZHSYYZS';
        window.open(paypalUrl, '_blank');
    }

    updatePlayerScore(playerId, category, value) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            const parsedValue = parseInt(value) || 0;
            player.scores[category] = parsedValue;

            // Toggle negative styling on the input itself
            const inputElement = document.getElementById(`${category}-${playerId}`);
            if (inputElement) {
                inputElement.classList.toggle('negative-value', parsedValue < 0);
            }

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
             const minValue = (category === 'militaryConflict' || category === 'navalCombat') ? -999 : 0;
             if (newValue >= minValue) {
                 player.scores[category] = newValue;
                 
                 // Update the input field
                 const inputElement = document.getElementById(`${category}-${playerId}`);
                 if (inputElement) {
                     inputElement.value = newValue;
                     inputElement.classList.toggle('negative-value', newValue < 0);
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

     adjustScienceSymbol(playerId, symbolType, change) {
         const player = this.players.find(p => p.id === playerId);
         if (player) {
             const currentValue = player.scores[symbolType] || 0;
             const newValue = currentValue + change;
             
             // Check minimum value constraint (science symbols can't be negative)
             if (newValue >= 0) {
                 player.scores[symbolType] = newValue;
                 
                 // Update the input field
                 const inputElement = document.getElementById(`${symbolType}-${playerId}`);
                 if (inputElement) {
                     inputElement.value = newValue;
                 }
                 
                 // Re-render to update science display
                 this.renderAllCategoriesScoring();
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
            breakdown += ` (Wildcards: <img src="resources/Science-Gear.webp" alt="Gear" class="science-icon" style="display: inline; width: 16px; height: 16px;">+${gearWild} <img src="resources/Science-Mason.webp" alt="Mason" class="science-icon" style="display: inline; width: 16px; height: 16px;"> <img src="resources/Science-Script.webp" alt="Script" class="science-icon" style="display: inline; width: 16px; height: 16px;">+${scriptWild})`;
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
        const showRemoveButton = this.players.length > 3;
        card.innerHTML = `
            ${showRemoveButton ? `<button class="remove-player-btn" onclick="calculator.removePlayer(${player.id})" title="Remove player" tabindex="-1">×</button>` : ''}
            <div class="player-header">
                <input type="text" 
                       class="player-name" 
                       value="${player.name}" 
                       onchange="calculator.updatePlayerName(${player.id}, this.value)"
                       oninput="calculator.handlePlayerNameInput(${player.id}, this.value, this)"
                       onfocus="calculator.showPlayerNameSuggestions(${player.id}, this)"
                       onblur="calculator.hidePlayerNameSuggestions(${player.id})"
                       onkeydown="calculator.handlePlayerNameKeydown(${player.id}, event)"
                       tabindex="${index + 1}">
                <div class="player-name-suggestions" id="suggestions-${player.id}"></div>
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
                                     <div class="number-controls">
                                         <button type="button" class="decrease-btn" onclick="calculator.adjustScienceSymbol(${player.id}, 'scienceGear', -1)" title="Decrease by 1">−</button>
                                         <input type="number" 
                                                id="science-gear-${player.id}" 
                                                value="${gearCount}" 
                                                onchange="calculator.updateScienceSymbol(${player.id}, 'scienceGear', this.value)"
                                                placeholder="0"
                                                step="1"
                                                min="0">
                                         <button type="button" class="increase-btn" onclick="calculator.adjustScienceSymbol(${player.id}, 'scienceGear', 1)" title="Increase by 1">+</button>
                                     </div>
                                 </div>
                                 <div class="science-symbol">
                                     <label><img src="resources/Science-Mason.webp" alt="Mason" class="science-icon"></label>
                                     <div class="number-controls">
                                         <button type="button" class="decrease-btn" onclick="calculator.adjustScienceSymbol(${player.id}, 'scienceMason', -1)" title="Decrease by 1">−</button>
                                         <input type="number" 
                                                id="science-mason-${player.id}" 
                                                value="${masonCount}" 
                                                onchange="calculator.updateScienceSymbol(${player.id}, 'scienceMason', this.value)"
                                                placeholder="0"
                                                step="1"
                                                min="0">
                                         <button type="button" class="increase-btn" onclick="calculator.adjustScienceSymbol(${player.id}, 'scienceMason', 1)" title="Increase by 1">+</button>
                                     </div>
                                 </div>
                                 <div class="science-symbol">
                                     <label><img src="resources/Science-Script.webp" alt="Script" class="science-icon"></label>
                                     <div class="number-controls">
                                         <button type="button" class="decrease-btn" onclick="calculator.adjustScienceSymbol(${player.id}, 'scienceScript', -1)" title="Decrease by 1">−</button>
                                         <input type="number" 
                                                id="science-script-${player.id}" 
                                                value="${scriptCount}" 
                                                onchange="calculator.updateScienceSymbol(${player.id}, 'scienceScript', this.value)"
                                                placeholder="0"
                                                step="1"
                                                min="0">
                                         <button type="button" class="increase-btn" onclick="calculator.adjustScienceSymbol(${player.id}, 'scienceScript', 1)" title="Increase by 1">+</button>
                                     </div>
                                 </div>
                                 <div class="science-symbol">
                                     <label>🎲</label>
                                     <div class="number-controls">
                                         <button type="button" class="decrease-btn" onclick="calculator.adjustScienceSymbol(${player.id}, 'scienceFree', -1)" title="Decrease by 1">−</button>
                                         <input type="number" 
                                                id="science-free-${player.id}" 
                                                value="${freeCount}" 
                                                onchange="calculator.updateScienceSymbol(${player.id}, 'scienceFree', this.value)"
                                                placeholder="0"
                                                step="1"
                                                min="0">
                                         <button type="button" class="increase-btn" onclick="calculator.adjustScienceSymbol(${player.id}, 'scienceFree', 1)" title="Increase by 1">+</button>
                                     </div>
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
                                            class="${currentScore < 0 ? 'negative-value' : ''}"
                                            onchange="calculator.updatePlayerScore(${player.id}, '${category}', this.value)"
                                            ${category === 'coins' ? `oninput="calculator.updateCoinDisplay(${player.id}, this.value)"` : ''}
                                            ${category === 'debt' ? `oninput="calculator.updateDebtDisplay(${player.id}, this.value)"` : ''}
                                            placeholder="${categoryInfo.placeholder}"
                                            step="1"
                                            min="${(category === 'militaryConflict' || category === 'navalCombat') ? '-999' : '0'}">
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
        
        // Check if coins were used as tiebreaker
        const coinsUsedAsTiebreaker = playerResults.length > 1 && 
                                     playerResults[0].totalScore === playerResults[1].totalScore && 
                                     playerResults[0].scores.coins !== playerResults[1].scores.coins;
        
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
            const coinDisplay = coinsUsedAsTiebreaker ? ` (${winner.scores.coins} coins)` : '';
            resultsHTML += `
                <div class="winner">
                    🏆 Winner: ${winner.name} - ${winner.totalScore} points${coinDisplay}
                </div>
            `;
        }

        resultsHTML += '<div class="score-list">';
        playerResults.forEach((player, index) => {
            const isWinner = player.totalScore === winner.totalScore && player.scores.coins === winner.scores.coins;
            // Only show coins for players who tied for the highest score
            const coinDisplay = (coinsUsedAsTiebreaker && player.totalScore === winner.totalScore) ? ` (${player.scores.coins} coins)` : '';
            resultsHTML += `
                <div class="score-item ${isWinner ? 'winner-item' : ''}">
                    <span class="player-score">${index + 1}. ${player.name}</span>
                    <span class="score-value ${player.totalScore < 0 ? 'negative-total' : ''}">${player.totalScore} pts${coinDisplay}</span>
                </div>
            `;
        });
        resultsHTML += '</div>';

        resultsDiv.innerHTML = resultsHTML;
    }

    // Statistics Methods
    saveStatistics() {
        if (this.players.length === 0) {
            alert('No players to save statistics for!');
            return;
        }

        const gameData = {
            date: new Date().toISOString(),
            players: this.players.map(player => ({
                name: player.name,
                scores: { ...player.scores },
                totalScore: this.calculateTotalScore(player.scores)
            })),
            expansions: { ...this.expansions },
            winner: this.getCurrentWinner()
        };

        // Get existing statistics
        let stats = this.getStatistics();
        stats.games.push(gameData);

        // Save to localStorage
        localStorage.setItem('sevenWondersStats', JSON.stringify(stats));
        
        // Change button appearance to show success
        const saveButton = document.getElementById('saveStatsBtn');
        const originalText = saveButton.innerHTML;
        const originalClass = saveButton.className;
        
        saveButton.innerHTML = '✅ Statistics saved';
        saveButton.className = 'btn btn-success';
        
        // Revert button after 3 seconds
        setTimeout(() => {
            saveButton.innerHTML = originalText;
            saveButton.className = originalClass;
        }, 3000);
    }

    getStatistics() {
        const stored = localStorage.getItem('sevenWondersStats');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            games: []
        };
    }

    getCurrentWinner() {
        if (this.players.length === 0) return null;
        
        const playerResults = this.players.map(player => ({
            name: player.name,
            score: this.calculateTotalScore(player.scores),
            coins: player.scores.coins || 0
        }));

        // Sort by score (descending), then by coins (descending) for tiebreaker
        playerResults.sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score;
            }
            return b.coins - a.coins;
        });

        return playerResults[0];
    }

    showStatistics() {
        const stats = this.getStatistics();
        const modal = document.getElementById('statsModal');
        const content = document.getElementById('statsContent');

        if (stats.games.length === 0) {
            content.innerHTML = `
                <div class="stats-section">
                    <h3>No Statistics Available</h3>
                    <p>No games have been saved yet. Play a game and click "Save Statistics" to start tracking your progress!</p>
                </div>
            `;
        } else {
            content.innerHTML = this.generateStatisticsHTML(stats);
        }

        modal.style.display = 'block';
    }

    closeStatistics() {
        const modal = document.getElementById('statsModal');
        modal.style.display = 'none';
    }

    generateRecentGamesList(games, totalGames) {
        return games.map((game) => {
            const date = new Date(game.date).toLocaleDateString();
            const time = new Date(game.date).toLocaleTimeString();
            const players = game.players.map(p => p.name).join(', ');
            // Find the actual index of this game in the original stats.games array
            const stats = this.getStatistics();
            const gameIndex = stats.games.findIndex(g => g.date === game.date && g.winner.name === game.winner.name);
            return `
                <div class="game-entry" onclick="calculator.showGameDetails(${gameIndex})">
                    <div class="game-info">
                        <div class="game-date">${date} at ${time}</div>
                        <div class="game-players">${players}</div>
                    </div>
                    <div class="game-winner">
                        ${game.winner.name} (${game.winner.score})
                    </div>
                </div>
            `;
        }).join('');
    }

    setSortBy(sortType) {
        this.sortBy = sortType;
        
        // Update button states
        document.getElementById('sortByTime').classList.toggle('active', sortType === 'time');
        document.getElementById('sortByScore').classList.toggle('active', sortType === 'score');
        
        // Re-render statistics so sorting is applied to the list
        this.showStatistics();
    }

    toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
        
        // Update arrow icon
        const icon = document.getElementById('sortOrderIcon');
        icon.textContent = this.sortOrder === 'desc' ? '↓' : '↑';
        
        // Re-render statistics so sorting is applied to the list
        this.showStatistics();
    }

    setExpansionFilter(expansion, enabled) {
        // Enforce mutual exclusivity for Base Only
        if (expansion === 'baseOnly') {
            this.expansionFilters.baseOnly = enabled;
            if (enabled) {
                this.expansionFilters.leaders = false;
                this.expansionFilters.cities = false;
                this.expansionFilters.armada = false;
                this.expansionFilters.edifice = false;
            }
        } else {
            this.expansionFilters[expansion] = enabled;
            if (enabled && this.expansionFilters.baseOnly) {
                this.expansionFilters.baseOnly = false;
            }
        }

        // Re-render full statistics so all sections respect the filters
        this.showStatistics();
    }

    toggleExpansionFilters() {
        this.showExpansionFilters = !this.showExpansionFilters;
        this.showStatistics();
    }

    sortRecentGames() {
        const stats = this.getStatistics();
        if (!stats || !stats.games) return;

        const recentGamesContainer = document.getElementById('recentGamesList');

        // Get all games and apply expansion filters
        let filteredGames = this.getFilteredGames(stats.games);

        // Get the last 10 games from filtered results
        let recentGames = filteredGames.slice(-10);

        if (this.sortBy === 'score') {
            if (this.sortOrder === 'desc') {
                // Sort by winner's score (highest first)
                recentGames.sort((a, b) => b.winner.score - a.winner.score);
            } else {
                // Sort by winner's score (lowest first)
                recentGames.sort((a, b) => a.winner.score - b.winner.score);
            }
        } else {
            if (this.sortOrder === 'desc') {
                // Sort by time (newest first)
                recentGames.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else {
                // Sort by time (oldest first)
                recentGames.sort((a, b) => new Date(a.date) - new Date(b.date));
            }
        }

        // Update the display
        recentGamesContainer.innerHTML = this.generateRecentGamesList(recentGames, stats.games.length);
    }

    getFilteredGames(allGames) {
        return allGames.filter(game => {
            const hasActiveFilters = Object.values(this.expansionFilters).some(filter => filter);
            if (!hasActiveFilters) return true;
            if (!game.expansions) {
                // If Base Only is selected, treat missing expansions as base game
                return this.expansionFilters.baseOnly;
            }

            const selectedExpansions = Object.keys(this.expansionFilters).filter(expansion => this.expansionFilters[expansion]);
            const gameExpansions = Object.keys(game.expansions).filter(expansion => game.expansions[expansion] === true);

            // If Base Only is selected, include games with no enabled expansions
            if (this.expansionFilters.baseOnly) {
                return gameExpansions.length === 0;
            }

            // Otherwise, game must have EXACTLY the selected expansions (no more, no less)
            const nonBaseSelected = selectedExpansions.filter(e => e !== 'baseOnly');
            return nonBaseSelected.length === gameExpansions.length &&
                   nonBaseSelected.every(expansion => gameExpansions.includes(expansion));
        });
    }

    generateStatisticsHTML(stats) {
        const filteredGames = this.getFilteredGames(stats.games);
        const totalGames = filteredGames.length;
        const playerStats = this.calculatePlayerStatistics(filteredGames, stats.games);
        const overallStats = this.calculateOverallStatistics(filteredGames, stats.games);

        // Prepare recent games (filtered) and apply current sorting preferences
        let recentGames = filteredGames.slice(-10);
        if (this.sortBy === 'score') {
            if (this.sortOrder === 'desc') {
                recentGames.sort((a, b) => b.winner.score - a.winner.score);
            } else {
                recentGames.sort((a, b) => a.winner.score - b.winner.score);
            }
        } else {
            if (this.sortOrder === 'desc') {
                recentGames.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else {
                recentGames.sort((a, b) => new Date(a.date) - new Date(b.date));
            }
        }

        return `
            <div class="stats-section">
                <h3>📈 Overall Statistics</h3>
                <div class="recent-games-controls sort-right" style="margin-top: 8px;">
                    <div class="filters-button-container">
                        <button class="filters-btn" onclick="calculator.toggleExpansionFilters()">
                            🔍 Filters
                        </button>
                    </div>
                </div>
                <div class="expansion-filters" style="display: ${this.showExpansionFilters ? 'block' : 'none'};">
                    <div class="filter-label">Filter by expansions:</div>
                    <div class="filter-checkboxes">
                        <div class="filter-checkbox">
                            <input type="checkbox" id="filterBaseOnly" class="filter-checkbox-input" ${this.expansionFilters.baseOnly ? 'checked' : ''} onchange="calculator.setExpansionFilter('baseOnly', this.checked)">
                            <label for="filterBaseOnly" class="filter-checkbox-label">
                                <span class="filter-icon">🏛️</span>
                                <span class="filter-name">Base Only</span>
                            </label>
                        </div>
                        <div class="filter-checkbox">
                            <input type="checkbox" id="filterLeaders" class="filter-checkbox-input" ${this.expansionFilters.leaders ? 'checked' : ''} onchange="calculator.setExpansionFilter('leaders', this.checked)">
                            <label for="filterLeaders" class="filter-checkbox-label">
                                <span class="filter-icon">👑</span>
                                <span class="filter-name">Leaders</span>
                            </label>
                        </div>
                        <div class="filter-checkbox">
                            <input type="checkbox" id="filterCities" class="filter-checkbox-input" ${this.expansionFilters.cities ? 'checked' : ''} onchange="calculator.setExpansionFilter('cities', this.checked)">
                            <label for="filterCities" class="filter-checkbox-label">
                                <span class="filter-icon">🏙️</span>
                                <span class="filter-name">Cities</span>
                            </label>
                        </div>
                        <div class="filter-checkbox">
                            <input type="checkbox" id="filterArmada" class="filter-checkbox-input" ${this.expansionFilters.armada ? 'checked' : ''} onchange="calculator.setExpansionFilter('armada', this.checked)">
                            <label for="filterArmada" class="filter-checkbox-label">
                                <span class="filter-icon">⚓</span>
                                <span class="filter-name">Armada</span>
                            </label>
                        </div>
                        <div class="filter-checkbox">
                            <input type="checkbox" id="filterEdifice" class="filter-checkbox-input" ${this.expansionFilters.edifice ? 'checked' : ''} onchange="calculator.setExpansionFilter('edifice', this.checked)">
                            <label for="filterEdifice" class="filter-checkbox-label">
                                <span class="filter-icon">🏗️</span>
                                <span class="filter-name">Edifice</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${totalGames}</div>
                        <div class="stat-label">Total Games</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${overallStats.averageScore.toFixed(1)}</div>
                        <div class="stat-label">Average Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" ${overallStats.highestScoreOriginalIndex >= 0 ? `onclick="calculator.showGameDetails(${overallStats.highestScoreOriginalIndex})" style="cursor: pointer;"` : ''}>${overallStats.highestScore}</div>
                        <div class="stat-label">Highest Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" ${overallStats.lowestScoreOriginalIndex >= 0 ? `onclick="calculator.showGameDetails(${overallStats.lowestScoreOriginalIndex})" style="cursor: pointer;"` : ''}>${overallStats.lowestScore}</div>
                        <div class="stat-label">Lowest Score</div>
                    </div>
                </div>
            </div>

            <div class="stats-section">
                <h3>👥 Player Statistics</h3>
                ${Object.keys(playerStats).map(playerName => {
                    const player = playerStats[playerName];
                    return `
                        <div class="player-stats" onclick="calculator.togglePlayerStats(this, '${playerName}')">
                            <div class="player-stats-header">
                                <div class="player-stats-name">${playerName}</div>
                                <div class="player-stats-compact">
                                    <span class="compact-stat games-played">${player.gamesPlayed} games</span>
                                    <span class="compact-stat win-rate">${player.winRate.toFixed(1)}% win rate</span>
                                    <span class="compact-stat avg-score">${player.averageScore.toFixed(1)} avg</span>
                                </div>
                                <div class="player-stats-summary">
                                    <div class="player-stat-item">
                                        <div class="player-stat-value">${player.gamesPlayed}</div>
                                        <div class="player-stat-label">Games</div>
                                    </div>
                                    <div class="player-stat-item">
                                        <div class="player-stat-value">${player.wins}</div>
                                        <div class="player-stat-label">Wins</div>
                                    </div>
                                    <div class="player-stat-item">
                                        <div class="player-stat-value">${player.winRate.toFixed(1)}%</div>
                                        <div class="player-stat-label">Win Rate</div>
                                    </div>
                                    <div class="player-stat-item">
                                        <div class="player-stat-value">${player.averageScore.toFixed(1)}</div>
                                        <div class="player-stat-label">Avg Score</div>
                                    </div>
                                    <div class="player-stat-item">
                                        <div class="player-stat-value" ${player.highestScoreGameIndex >= 0 ? `onclick="calculator.showGameDetails(${player.highestScoreGameIndex}); event.stopPropagation();" style="cursor: pointer;"` : ''}>${player.highestScore}</div>
                                        <div class="player-stat-label">Best Score</div>
                                    </div>
                                    <div class="player-stat-item">
                                        <div class="player-stat-value" ${player.lowestScoreGameIndex >= 0 ? `onclick="calculator.showGameDetails(${player.lowestScoreGameIndex}); event.stopPropagation();" style="cursor: pointer;"` : ''}>${player.lowestScore}</div>
                                        <div class="player-stat-label">Lowest Score</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="stats-section">
                <div class="recent-games-header">
                    <h3>🎮 Recent Games</h3>
                </div>
                <div class="recent-games-controls sort-right">
                    <div class="sort-controls">
                        <div class="sort-buttons">
                            <button id="sortByTime" class="sort-btn ${this.sortBy === 'time' ? 'active' : ''}" onclick="calculator.setSortBy('time')">Date</button>
                            <button id="sortByScore" class="sort-btn ${this.sortBy === 'score' ? 'active' : ''}" onclick="calculator.setSortBy('score')">Score</button>
                        </div>
                        <button id="sortOrderBtn" class="sort-order-btn" onclick="calculator.toggleSortOrder()" title="Toggle sort order">
                            <span id="sortOrderIcon">${this.sortOrder === 'desc' ? '↓' : '↑'}</span>
                        </button>
                    </div>
                </div>
                <div class="recent-games" id="recentGamesList">
                    ${this.generateRecentGamesList(recentGames, stats.games.length)}
                </div>
            </div>

            <div class="stats-section" style="text-align: center;">
                <button class="clear-stats-btn" onclick="calculator.clearStatistics()">
                    🗑️ Clear All Statistics
                </button>
            </div>
        `;
    }

    calculatePlayerStatistics(games, allGamesReference = null) {
        const playerStats = {};

        games.forEach((game) => {
            game.players.forEach(player => {
                if (!playerStats[player.name]) {
                    playerStats[player.name] = {
                        gamesPlayed: 0,
                        wins: 0,
                        totalScore: 0,
                        highestScore: 0,
                        lowestScore: Infinity,
                        highestScoreGameIndex: -1,
                        lowestScoreGameIndex: -1
                    };
                }

                const stats = playerStats[player.name];
                stats.gamesPlayed++;
                stats.totalScore += player.totalScore;
                
                if (player.totalScore > stats.highestScore) {
                    stats.highestScore = player.totalScore;
                    stats.highestScoreGameIndex = allGamesReference ? allGamesReference.findIndex(g => g.date === game.date && g.winner.name === game.winner.name) : -1;
                }
                if (player.totalScore < stats.lowestScore) {
                    stats.lowestScore = player.totalScore;
                    stats.lowestScoreGameIndex = allGamesReference ? allGamesReference.findIndex(g => g.date === game.date && g.winner.name === game.winner.name) : -1;
                }

                if (game.winner && game.winner.name === player.name) {
                    stats.wins++;
                }
            });
        });

        // Calculate averages and percentages
        Object.keys(playerStats).forEach(playerName => {
            const stats = playerStats[playerName];
            stats.averageScore = stats.totalScore / stats.gamesPlayed;
            stats.winRate = (stats.wins / stats.gamesPlayed) * 100;
            if (stats.lowestScore === Infinity) {
                stats.lowestScore = 0;
                stats.lowestScoreGameIndex = -1;
            }
        });

        return playerStats;
    }

    calculateOverallStatistics(games, allGamesReference = null) {
        let totalScore = 0;
        let highestScore = 0;
        let lowestScore = Infinity;
        let totalPlayers = 0;
        let highestScoreOriginalIndex = -1;
        let lowestScoreOriginalIndex = -1;

        games.forEach((game) => {
            game.players.forEach(player => {
                totalScore += player.totalScore;
                if (player.totalScore > highestScore) {
                    highestScore = player.totalScore;
                    highestScoreOriginalIndex = allGamesReference ? allGamesReference.findIndex(g => g.date === game.date && g.winner.name === game.winner.name) : -1;
                }
                if (player.totalScore < lowestScore) {
                    lowestScore = player.totalScore;
                    lowestScoreOriginalIndex = allGamesReference ? allGamesReference.findIndex(g => g.date === game.date && g.winner.name === game.winner.name) : -1;
                }
                totalPlayers++;
            });
        });

        return {
            averageScore: totalPlayers > 0 ? (totalScore / totalPlayers) : 0,
            highestScore: highestScore,
            lowestScore: lowestScore === Infinity ? 0 : lowestScore,
            highestScoreOriginalIndex: highestScoreOriginalIndex,
            lowestScoreOriginalIndex: lowestScoreOriginalIndex
        };
    }

    clearStatistics() {
        if (confirm('Are you sure you want to clear all statistics? This action cannot be undone.')) {
            localStorage.removeItem('sevenWondersStats');
            this.closeStatistics();
            alert('All statistics have been cleared.');
        }
    }

    togglePlayerStats(element, playerName) {
        element.classList.toggle('expanded');
    }

    // Player Name Autocomplete Methods
    getPlayerNamesFromStats() {
        const stats = this.getStatistics();
        const playerNames = new Set();
        
        stats.games.forEach(game => {
            game.players.forEach(player => {
                if (player.name && player.name.trim()) {
                    playerNames.add(player.name.trim());
                }
            });
        });
        
        return Array.from(playerNames).sort();
    }

    handlePlayerNameInput(playerId, value, inputElement) {
        const suggestions = this.getPlayerNamesFromStats();
        const filteredSuggestions = suggestions.filter(name => 
            name.toLowerCase().includes(value.toLowerCase()) && 
            name.toLowerCase() !== value.toLowerCase()
        );
        
        this.currentSuggestions = filteredSuggestions;
        this.selectedSuggestionIndex = -1;
        this.activePlayerId = playerId;
        this.displayPlayerNameSuggestions(playerId, filteredSuggestions, value);
    }

    showPlayerNameSuggestions(playerId, inputElement) {
        const suggestions = this.getPlayerNamesFromStats();
        this.currentSuggestions = suggestions;
        this.selectedSuggestionIndex = -1;
        this.activePlayerId = playerId;
        this.displayPlayerNameSuggestions(playerId, suggestions, inputElement.value);
    }

    hidePlayerNameSuggestions(playerId) {
        // Small delay to allow clicking on suggestions
        setTimeout(() => {
            const suggestionsDiv = document.getElementById(`suggestions-${playerId}`);
            if (suggestionsDiv) {
                suggestionsDiv.innerHTML = '';
                suggestionsDiv.style.display = 'none';
            }
            // Reset selection state when hiding suggestions
            if (this.activePlayerId === playerId) {
                this.selectedSuggestionIndex = -1;
                this.activePlayerId = null;
                this.currentSuggestions = [];
            }
        }, 150);
    }

    displayPlayerNameSuggestions(playerId, suggestions, currentValue) {
        const suggestionsDiv = document.getElementById(`suggestions-${playerId}`);
        if (!suggestionsDiv) return;

        if (suggestions.length === 0 || !currentValue) {
            suggestionsDiv.innerHTML = '';
            suggestionsDiv.style.display = 'none';
            return;
        }

        const suggestionsHTML = suggestions.slice(0, 5).map(name => 
            `<div class="suggestion-item" onclick="calculator.selectPlayerName(${playerId}, '${name}')">${name}</div>`
        ).join('');

        suggestionsDiv.innerHTML = suggestionsHTML;
        suggestionsDiv.style.display = 'block';
    }

    selectPlayerName(playerId, name) {
        const inputElement = document.querySelector(`#suggestions-${playerId}`).previousElementSibling;
        if (inputElement) {
            inputElement.value = name;
            this.updatePlayerName(playerId, name);
        }
        this.hidePlayerNameSuggestions(playerId);
    }

    handlePlayerNameKeydown(playerId, event) {
        const suggestionsDiv = document.getElementById(`suggestions-${playerId}`);
        if (!suggestionsDiv || suggestionsDiv.style.display === 'none') {
            return; // No suggestions visible, let normal key handling work
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.navigateSuggestions(playerId, 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.navigateSuggestions(playerId, -1);
                break;
            case 'Enter':
                event.preventDefault();
                this.selectCurrentSuggestion(playerId);
                break;
            case 'Escape':
                event.preventDefault();
                this.hidePlayerNameSuggestions(playerId);
                break;
        }
    }

    navigateSuggestions(playerId, direction) {
        if (this.activePlayerId !== playerId) {
            this.activePlayerId = playerId;
            this.selectedSuggestionIndex = -1;
        }

        const maxIndex = this.currentSuggestions.length - 1;
        this.selectedSuggestionIndex += direction;

        if (this.selectedSuggestionIndex < -1) {
            this.selectedSuggestionIndex = maxIndex;
        } else if (this.selectedSuggestionIndex > maxIndex) {
            this.selectedSuggestionIndex = -1;
        }

        this.updateSuggestionHighlight(playerId);
    }

    selectCurrentSuggestion(playerId) {
        if (this.selectedSuggestionIndex >= 0 && this.selectedSuggestionIndex < this.currentSuggestions.length) {
            const selectedName = this.currentSuggestions[this.selectedSuggestionIndex];
            this.selectPlayerName(playerId, selectedName);
        }
    }

    updateSuggestionHighlight(playerId) {
        const suggestionsDiv = document.getElementById(`suggestions-${playerId}`);
        if (!suggestionsDiv) return;

        const suggestionItems = suggestionsDiv.querySelectorAll('.suggestion-item');
        suggestionItems.forEach((item, index) => {
            if (index === this.selectedSuggestionIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    removeGame(gameIndex) {
        const stats = this.getStatistics();
        if (gameIndex >= 0 && gameIndex < stats.games.length) {
            stats.games.splice(gameIndex, 1);
            localStorage.setItem('sevenWondersStats', JSON.stringify(stats));
            this.showStatistics(); // Refresh the statistics display
        }
    }

    showGameDetails(gameIndex) {
        const stats = this.getStatistics();
        if (stats && stats.games && stats.games[gameIndex]) {
            const game = stats.games[gameIndex];
            const date = new Date(game.date).toLocaleDateString();
            const time = new Date(game.date).toLocaleTimeString();
            
            // Sort players by score (winner first)
            const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore);
            
            // Generate enabled expansions display
            const enabledExpansions = [];
            if (game.expansions) {
                if (game.expansions.leaders) enabledExpansions.push('Leaders');
                if (game.expansions.cities) enabledExpansions.push('Cities');
                if (game.expansions.armada) enabledExpansions.push('Armada');
                if (game.expansions.edifice) enabledExpansions.push('Edifice');
            }
            
            const expansionsDisplay = enabledExpansions.length > 0 ? 
                `<div class="game-details-expansions">Enabled expansions: ${enabledExpansions.join(', ')}</div>` : 
                '<div class="game-details-expansions">Base game only</div>';
            
            const gameDetailsHTML = `
                <div class="modal" id="gameDetailsModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Game Details</h2>
                            <span class="close" onclick="calculator.closeGameDetails()">&times;</span>
                        </div>
                        <div class="modal-body">
                            <div class="game-details-header">
                                <div class="game-details-date">${date} at ${time}</div>
                                <div class="game-details-players">${game.players.length} players</div>
                                ${expansionsDisplay}
                            </div>
                            
                            <div class="game-details-scores">
                                ${sortedPlayers.map((player, index) => {
                                    const isWinner = index === 0;
                                    return `
                                        <div class="player-score-detail ${isWinner ? 'winner-detail' : ''}">
                                            <div class="player-score-header">
                                                <span class="player-rank">${index + 1}</span>
                                                <span class="player-name-detail">${player.name}</span>
                                                <span class="player-total-score ${player.totalScore < 0 ? 'negative-total' : ''}">${player.totalScore} pts</span>
                                            </div>
                                            <div class="player-score-breakdown">
                                                ${this.generateScoreBreakdown(player, game.expansions)}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                            
                            <button class="remove-game-details-btn" onclick="calculator.removeGame(${gameIndex}); calculator.closeGameDetails();">Remove Game</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to page
            document.body.insertAdjacentHTML('beforeend', gameDetailsHTML);
            
            // Show modal
            const modal = document.getElementById('gameDetailsModal');
            modal.style.display = 'block';
        }
    }

         generateScoreBreakdown(player, expansions = {}) {
         // Base categories (always shown)
         const baseCategories = [
             { key: 'militaryConflict', name: 'Military Conflict', icon: '<img src="resources/Strength-Military.webp" alt="Military Conflict" class="category-icon">' },
             { key: 'coins', name: 'Coins', icon: '<img src="resources/Coin-3.webp" alt="Coins" class="category-icon">' },
             { key: 'debt', name: 'Debt', icon: '💸' },
             { key: 'wonders', name: 'Wonders', icon: '<img src="resources/wonder.webp" alt="Wonders" class="category-icon">' },
             { key: 'blueCards', name: 'Blue Cards', icon: '<img src="resources/Victory-1.webp" alt="Blue Cards" class="category-icon">' },
             { key: 'yellowCards', name: 'Yellow Cards', icon: '🏪' },
             { key: 'purpleCards', name: 'Purple Cards', icon: '🏰' },
             { key: 'scienceCards', name: 'Science Cards', icon: '🔬' }
         ];

         // Expansion categories
         const armadaCategories = [
             { key: 'navalCombat', name: 'Naval Combat', icon: '<img src="resources/Strength-Naval1.webp" alt="Naval Combat" class="category-icon">' },
             { key: 'islands', name: 'Islands', icon: '🏝️' }
         ];
         const leadersCategories = [
             { key: 'leaders', name: 'Leaders', icon: '👑' }
         ];
         const citiesCategories = [
             { key: 'cityCards', name: 'Black Cards', icon: '🏙️' }
         ];
         const edificeCategories = [
             { key: 'projects', name: 'Projects', icon: '🏗️' }
         ];

         // Combine base categories with enabled expansion categories
         let categories = [...baseCategories];
         
         if (expansions.armada) {
             categories.push(...armadaCategories);
         }
         if (expansions.leaders) {
             categories.push(...leadersCategories);
         }
         if (expansions.cities) {
             categories.push(...citiesCategories);
         }
         if (expansions.edifice) {
             categories.push(...edificeCategories);
         }

                   return categories.map(category => {
              const score = player.scores[category.key] || 0;
              const scoreClass = score < 0 ? 'negative-score' : 'positive-score';
              
              // Determine CSS class for category styling to match main interface
              let categoryClass = '';
              switch(category.key) {
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
              
                             return `
                   <div class="score-category ${categoryClass}">
                       <span class="category-icon">${category.icon}</span>
                       <span class="category-name">${category.name}</span>
                       <span class="category-score ${scoreClass}">${score}</span>
                   </div>
               `;
          }).join('');
     }

    closeGameDetails() {
        const modal = document.getElementById('gameDetailsModal');
        if (modal) {
            modal.remove();
        }
    }
}

// Initialize the calculator when the page loads
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new SevenWondersCalculator();
    
    // Add modal close functionality
    const modal = document.getElementById('statsModal');
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            calculator.closeStatistics();
        }
        // Close game details modal when clicking outside
        const gameDetailsModal = document.getElementById('gameDetailsModal');
        if (event.target === gameDetailsModal) {
            calculator.closeGameDetails();
        }
    });
});
