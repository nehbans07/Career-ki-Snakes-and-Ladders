# 🧪 Test Checklist - Career ki Snakes and Ladders

## ✅ Features to Test

### 1. **Reduced Header Spacing**
- [ ] Header takes less vertical space
- [ ] Title is smaller but still readable
- [ ] Stats badges are compact
- [ ] Overall cleaner look with less white space

### 2. **Dice on Right Side**
- [ ] Dice section appears at the top of the right sidebar
- [ ] Has a yellow/orange background to stand out
- [ ] Roll button is easily accessible
- [ ] Dice animations work correctly
- [ ] Click on dice itself also triggers roll

### 3. **Player Name Editing**
- [ ] Click on any player in the Players list
- [ ] Edit icon (✏️) appears on hover
- [ ] Modal opens with current name pre-filled
- [ ] Can type new name and save
- [ ] Name updates in all places:
  - [ ] Players list
  - [ ] Current turn display
  - [ ] Game messages
  - [ ] Board tooltips
- [ ] Works for all players (1-4)
- [ ] Enter key saves the name

### 4. **Card Editing (Before Game Starts)**
- [ ] "📝 Edit Cards" button is visible
- [ ] Clicking opens the card edit modal
- [ ] Two tabs: Ladder and Anti-Venom
- [ ] Can switch between tabs
- [ ] For each card can edit:
  - [ ] Title
  - [ ] Description
  - [ ] Evidence requirements
- [ ] "➕ Add New Card" button works
- [ ] Delete button removes cards (min 5 required)
- [ ] Save Changes updates the game cards
- [ ] Cards display correctly on the board

### 5. **General Functionality**
- [ ] Game still plays normally
- [ ] Timer works
- [ ] Add Player works (up to 4)
- [ ] New Game resets everything
- [ ] Scenarios appear correctly
- [ ] Evidence buttons work
- [ ] Win conditions work
- [ ] Responsive design maintained

## 🐛 Things to Watch For

1. **Player Names**
   - Names should persist throughout the game
   - Special characters should be handled
   - Empty names should not be allowed

2. **Card Editing**
   - Changes should reflect immediately
   - Minimum card limit (5) should be enforced
   - Long text should be handled gracefully

3. **Layout**
   - No overlapping elements
   - Mobile responsiveness maintained
   - Smooth animations

## 📝 Test Scenarios

1. **Quick Test**
   - Add 2 more players
   - Edit all player names
   - Edit a few cards
   - Start game and play a few turns

2. **Edge Cases**
   - Try to delete all cards (should stop at 5)
   - Enter very long player names
   - Add maximum players then edit names
   - Edit cards during gameplay (should work)

3. **Full Game Test**
   - Complete a full game with edited names
   - Verify all messages use custom names
   - Check timer functionality
   - Test win conditions

## ✨ Expected Results

- All features work smoothly
- No console errors
- Good user experience
- Responsive on different screen sizes
- Analytics tracking still functional 