# 7 Wonders Score Calculator

> **🎵 Vibe Coded** - This entire project was vibe coded using Cursor ✨

A modern, responsive web application for calculating end-game scores in the board game 7 Wonders and its expansions, with comprehensive statistics tracking and game history.

## 🎯 Features

### Core Game Scoring
- **Military Conflict** - Victory tokens with military icon
- **Coins** - Automatic conversion (1 point per 3 coins) with real-time display
- **Debt** - Negative points with visual feedback
- **Wonders** - Points from completed wonder stages
- **Blue Cards** - Civilian structures (points shown on card)
- **Yellow Cards** - Commercial structures (various bonuses)
- **Purple Cards** - Guilds (special scoring)
- **Science Cards** - Advanced scoring with automatic optimization:
  - Individual symbol counting (Gear, Mason, Script)
  - Wildcard optimization for maximum score
  - 7 points per set of 3 different symbols
  - n² points for each symbol type

### Expansion Support
- **Armada** - Naval Combat and Islands
- **Leaders** - Leader cards
- **Cities** - Black Cards
- **Edifice** - Projects

### Statistics & Game History
- **Save Statistics** - Store game results locally
- **Game History** - View all previous games with detailed breakdowns
- **Player Statistics** - Track individual player performance over time
- **Win Rates** - Calculate win percentages for each player
- **Average Scores** - Monitor scoring trends
- **Highest/Lowest Scores** - Click to view specific game details
- **Expansion Filtering** - Filter games by enabled expansions
- **Sorting Options** - Sort by date or score (ascending/descending)

### User Experience
- **Real-time scoring** - See points update as you type
- **Player management** - Add/remove players with custom names
- **Player name autocomplete** - Suggests names from previous games
- **Visual feedback** - Color-coded categories with game-themed icons
- **Responsive design** - Optimized for desktop, tablet, and mobile
- **Tie-breaking** - Automatic coin-based tiebreaker
- **Keyboard navigation** - Tab through player names efficiently
- **Mobile-friendly controls** - +/- buttons for easy score adjustment
- **Clear scores** - Reset all scores while keeping players

### Game Details & Analysis
- **Detailed Game View** - Click any game to see complete score breakdown
- **Category-by-category analysis** - View individual scoring for each player
- **Expansion tracking** - See which expansions were used in each game
- **Visual score representation** - Color-coded categories in game details
- **Game removal** - Delete individual games from history

## 🎮 How to Use

### Basic Scoring
1. **Setup Players**
   - Click "Add Player" to add players
   - Type custom names for each player (autocomplete available)
   - Use Tab to navigate between player names

2. **Enable Expansions**
   - Check the expansion boxes you're using
   - Scoring categories will appear automatically

3. **Enter Scores**
   - Fill in scores for each category
   - Use +/- buttons for easy adjustment (especially on mobile)
   - For Science Cards, enter individual symbols and wildcards
   - Points calculate automatically

4. **View Results**
   - Final scores appear at the bottom
   - Winner is highlighted
   - Ties are handled with coin tiebreaker

### Statistics & History
1. **Save Game**
   - Click "Save Statistics" after completing a game
   - Game data is stored locally in your browser

2. **View Statistics**
   - Click "Show Statistics" to see your gaming history
   - View overall statistics and individual player performance
   - Click on player entries to expand detailed stats

3. **Game Details**
   - Click any game in the "Recent Games" list
   - View complete score breakdown for all players
   - See which expansions were enabled

4. **Filtering & Sorting**
   - Use the "Filters" button to show expansion filter options
   - Sort games by date or score using the sorting buttons
   - Toggle ascending/descending order

## 🧮 Science Scoring Algorithm

The science scoring uses an advanced algorithm to maximize points:

- **Sets**: 7 points per complete set of 3 different symbols
- **Individual**: n² points for each symbol (where n = count of that symbol)
- **Wildcards**: Automatically assigned to maximize total score
- **Optimization**: Tests all possible wildcard distributions

Example: 2 Gear + 1 Mason + 3 wildcards = 2² + 4² + 0² + (1 set × 7) = 4 + 16 + 0 + 7 = 27 points

## 📊 Statistics Features

### Game Tracking
- **Automatic saving** - Games are stored with timestamps
- **Expansion tracking** - Records which expansions were used
- **Complete score breakdown** - Every category score is preserved
- **Player performance** - Individual statistics for each player

### Analysis Tools
- **Win rate calculation** - Percentage of games won by each player
- **Average score tracking** - Mean scores across all games
- **Highest/lowest scores** - Click to view specific games
- **Game filtering** - Filter by enabled expansions
- **Sorting options** - Date and score-based sorting

### Data Management
- **Local storage** - Data stays on your device
- **Game removal** - Delete individual games from history
- **Clear all data** - Option to reset all statistics
- **No data limits** - Store unlimited games

## 🎨 Design Features

- **Color-coded categories** - Each scoring type has a distinct gradient
- **Game icons** - Authentic images from the game
- **Responsive layout** - Adapts to any screen size
- **Mobile optimization** - Touch-friendly controls and compact layouts
- **Smooth animations** - Hover effects and transitions
- **Accessibility** - Keyboard navigation and clear visual hierarchy
- **Dark/light themes** - Automatic theme detection

## 📱 Mobile Experience

### Optimized Features
- **Touch-friendly buttons** - Larger tap targets for mobile
- **Compact layouts** - Efficient use of screen space
- **Simplified statistics** - Streamlined view on small screens
- **Easy score adjustment** - +/- buttons for number inputs
- **Responsive game history** - Optimized for mobile viewing

### Mobile-Specific Improvements
- **Hidden elements** - Non-essential stats hidden on mobile
- **Vertical layouts** - Stacked elements for narrow screens
- **Touch gestures** - Optimized for finger navigation
- **Readable text** - Appropriate font sizes for mobile

## 🔧 Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks or build tools required
- **ES6 Classes** - Modern JavaScript architecture
- **CSS Grid & Flexbox** - Responsive layout system
- **Local Storage** - Persistent game statistics
- **Progressive Enhancement** - Works without JavaScript (basic functionality)
- **Cross-browser compatibility** - Works on all modern browsers

## 🌟 Recent Updates

### Latest Features
- **Player name autocomplete** - Suggests names from previous games
- **Expansion filtering** - Filter games by enabled expansions
- **Mobile improvements** - Better touch controls and layouts
- **Game details modal** - Complete score breakdown view
- **Statistics persistence** - Automatic saving and loading
- **Clear scores button** - Reset scores without removing players

### Performance Improvements
- **Optimized rendering** - Faster UI updates
- **Efficient data storage** - Compact localStorage usage
- **Responsive design** - Better mobile experience
- **Accessibility enhancements** - Improved keyboard navigation

## 📝 License

This project is open source. Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Suggestions & Feedback
- Click the "Suggestions" button to send feedback
- Email: matte___93@hotmail.com

### Support the Project
- Click the "Donate" button to support development
- PayPal donations accepted

---

**Happy gaming! 🏛️⚔️🔬**
