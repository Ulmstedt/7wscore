# 7 Wonders Score Calculator

> **🎵 Vibe Coded** - This entire project was vibe coded using Cursor ✨

A modern, responsive web application for calculating end-game scores in the board game 7 Wonders and its expansions.

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

### User Experience
- **Real-time scoring** - See points update as you type
- **Player management** - Add/remove players with custom names
- **Visual feedback** - Color-coded categories with game-themed icons
- **Responsive design** - Works on desktop, tablet, and mobile
- **Tie-breaking** - Automatic coin-based tiebreaker
- **Keyboard navigation** - Tab through player names efficiently

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch" → "main" → "/ (root)"
4. Your site will be live at `https://yourusername.github.io/7wscore/`

### Option 2: Local Development
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start scoring!

### Option 3: Other Hosting Services
- **Netlify**: Drag and drop the folder to [netlify.com](https://netlify.com)
- **Vercel**: Import repository to [vercel.com](https://vercel.com)
- **Firebase**: Use Firebase CLI to deploy
- **Surge**: Run `surge` in the project directory

## 📁 Project Structure

```
7wscore/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Application logic and scoring algorithms
├── resources/          # Game icons and images
│   ├── Coin-3.webp
│   ├── wonder.webp
│   ├── Strength-Military.webp
│   ├── Strength-Naval1.webp
│   ├── Victory-1.webp
│   ├── Science-Gear.webp
│   ├── Science-Mason.webp
│   └── Science-Script.webp
└── README.md           # This file
```

## 🎮 How to Use

1. **Setup Players**
   - Click "Add Player" to add players
   - Type custom names for each player
   - Use Tab to navigate between player names

2. **Enable Expansions**
   - Check the expansion boxes you're using
   - Scoring categories will appear automatically

3. **Enter Scores**
   - Fill in scores for each category
   - For Science Cards, enter individual symbols and wildcards
   - Points calculate automatically

4. **View Results**
   - Final scores appear at the bottom
   - Winner is highlighted
   - Ties are handled with coin tiebreaker

## 🧮 Science Scoring Algorithm

The science scoring uses an advanced algorithm to maximize points:

- **Sets**: 7 points per complete set of 3 different symbols
- **Individual**: n² points for each symbol (where n = count of that symbol)
- **Wildcards**: Automatically assigned to maximize total score
- **Optimization**: Tests all possible wildcard distributions

Example: 2 Gear + 1 Mason + 3 wildcards = 2² + 4² + 0² + (1 set × 7) = 4 + 16 + 0 + 7 = 27 points

## 🎨 Design Features

- **Color-coded categories** - Each scoring type has a distinct gradient
- **Game icons** - Authentic images from the game
- **Responsive layout** - Adapts to any screen size
- **Smooth animations** - Hover effects and transitions
- **Accessibility** - Keyboard navigation and clear visual hierarchy

## 🔧 Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks or build tools required
- **ES6 Classes** - Modern JavaScript architecture
- **CSS Grid & Flexbox** - Responsive layout system
- **Local Storage** - Optional state persistence
- **Progressive Enhancement** - Works without JavaScript (basic functionality)

## 🌟 Future Enhancements

Potential features for future versions:
- Save/load game states
- Statistics tracking
- Multiple game sessions
- Custom scoring rules
- Dark mode theme
- Offline support (PWA)

## 📝 License

This project is open source. Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Happy gaming! 🏛️⚔️🔬**
