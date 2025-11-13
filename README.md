# RL Quest - Gamified Reinforcement Learning Tutorial

An interactive, gamified webpage that teaches Reinforcement Learning concepts to CA (Chartered Accountancy) students in India through engaging games and real-world business analogies.

## 🎯 Features

### Advanced Gamification Elements
- **XP System**: Earn experience points for every action and learning activity
- **Level Progression**: 10+ levels with increasing rewards
- **Badge System**: 15+ unlockable achievements
- **Streak Tracking**: Daily visit streaks with special rewards
- **Leaderboard**: Local leaderboard to compete with friends
- **Progress Bars**: Visual feedback on learning progress
- **Certificate Generation**: Downloadable certificate upon completion

### Interactive Games

#### Game 1: CA Exam Prep Simulator
- Grid-based pathfinding game
- Real Q-learning implementation
- Visual Q-table display
- Learning progress charts
- Multiple difficulty levels

#### Game 2: CA Practice Manager
- Business decision simulation
- Revenue tracking and visualization
- Client management mechanics
- Health meter for practice sustainability
- Real-time feedback on decisions

#### Game 3: Tax Notice Response Trainer
- Scenario-based learning
- Exploration vs Exploitation demonstration
- Success rate tracking
- Strategy learning system
- Multiple real-world tax scenarios

### Educational Content
- 6 core RL concepts explained with CA/business analogies
- Click-to-reveal interactive concept cards
- Real-world applications in finance and accounting
- Hindi-English mix for better accessibility
- 5-question quiz with instant feedback

## 🚀 Quick Start

### Local Testing
1. Download all three files:
   - `index.html`
   - `styles.css`
   - `script.js`

2. Place them in the same folder

3. Open `index.html` in any modern web browser

### GitHub Pages Deployment

1. **Create Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - RL Quest"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub
   - Follow GitHub's instructions to push your code

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select "main" branch as source
   - Click Save

4. **Access Your Site**
   - Your site will be available at: `https://username.github.io/repository-name/`
   - Wait 2-3 minutes for initial deployment

## 📱 Responsive Design

The webpage is fully responsive and optimized for:
- Desktop computers (1200px+)
- Tablets (768px - 1024px)
- Mobile phones (<768px)
- Slow internet connections (tier 3 cities)

## 🎓 Learning Objectives

Students will learn:
- What is Reinforcement Learning
- Key concepts: Agent, Environment, State, Action, Reward, Policy
- Q-learning algorithm basics
- Exploration vs Exploitation tradeoff
- Real-world applications in finance and CA field

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Gradients, animations, flexbox, grid
- **Vanilla JavaScript**: No frameworks required
- **Canvas API**: For charts and visualizations
- **LocalStorage**: For saving progress and leaderboard

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Optimizations
- No external dependencies
- Optimized animations using CSS transforms
- Efficient localStorage usage
- Lazy rendering of charts
- Debounced user inputs

## 🎮 How to Play

1. **Start Learning**: Click through concept cards to learn basics (+5 XP each)

2. **Play Games**: 
   - Game 1: Watch AI learn optimal paths
   - Game 2: Make business decisions
   - Game 3: Handle tax notices strategically

3. **Take Quiz**: Test your knowledge (50 XP + bonus for 80%+)

4. **Earn Badges**: Complete challenges to unlock achievements

5. **Get Certificate**: Complete everything to generate your certificate

## 🏆 Badge List

| Badge | Description | Requirement |
|-------|-------------|-------------|
| 🎯 First Step | Started learning | Click "Start Learning" |
| 🧠 Concept Master | Revealed all concepts | View all 6 concepts |
| 🎮 Grid Explorer | Completed Game 1 basics | 5 episodes in Game 1 |
| 🏆 Path Master | Game 1 expert | 20 episodes in Game 1 |
| 💼 Business Starter | Made initial decisions | 10 decisions in Game 2 |
| 💰 Business Mogul | Revenue milestone | ₹50K+ revenue |
| 📋 Notice Handler | Tax notice basics | 5 notices handled |
| ⚖️ Tax Expert | Tax notice mastery | 90% success rate |
| 📝 Quiz Taker | Attempted quiz | Take the quiz |
| 🎓 Quiz Master | Quiz excellence | Score 80%+ |
| ⭐ Level 5 | Leveling up | Reach level 5 |
| 🌟 Level 10 | Advanced learner | Reach level 10 |
| 🔥 3-Day Streak | Consistency | Visit 3 days in a row |
| 💪 Week Warrior | Dedication | Visit 7 days in a row |
| 👑 Completionist | Complete mastery | Complete everything |

## 📊 XP Breakdown

| Activity | XP Earned |
|----------|-----------|
| Start Learning | 10 XP |
| Reveal Concept | 5 XP |
| Complete All Concepts | 20 XP bonus |
| Game 1 Episode | 10 XP |
| Game 2 Decision | 5 XP |
| Game 3 Notice | 10 XP |
| Take Quiz | 50 XP |
| Pass Quiz (80%+) | 50 XP bonus |
| Generate Certificate | 100 XP |

## 🎨 Customization

### Change Color Scheme
Edit `styles.css`:
```css
/* Primary gradient */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Add More Questions
Edit `script.js`:
```javascript
const quizQuestions = [
    // Add your questions here
];
```

### Add More Scenarios
Edit Game 3 scenarios in `script.js`:
```javascript
scenarios: [
    {
        title: "Your scenario title",
        desc: "Description",
        options: [...]
    }
]
```

## 🌐 Accessibility Features

- Semantic HTML5 elements
- ARIA labels for screen readers
- High contrast colors
- Keyboard navigation support
- Mobile-first responsive design
- Fast loading on slow connections

## 📝 License

This educational project is free to use and modify for educational purposes.

## 🤝 Contributing

Feel free to:
- Add more games
- Improve explanations
- Add more languages
- Enhance visualizations
- Report bugs

## 📧 Support

Created by a CA for future CAs. For questions or suggestions, create an issue on GitHub.

## 🙏 Acknowledgments

- Designed for 18-year-old CA students in tier 3 Indian cities
- Uses relatable CA/business analogies
- Incorporates Hindi-English code-mixing for authenticity
- Built with love for the CA community

---

**Happy Learning! 🎓**

*May your Q-values always converge and your policy always be optimal!* 😄
