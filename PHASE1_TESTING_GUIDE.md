# Phase 1: AI Character Voice System - Setup & Testing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ installed
- MongoDB running locally or connection string ready
- OpenAI API key obtained
- Ports 5000 (backend) and 5173 (frontend) available

### Environment Setup

#### Backend (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/lms_db

# JWT
JWT_SECRET=your_jwt_secret_key_here

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### Audio Directory
```bash
# Ensure audio upload directory exists
mkdir -p server/uploads/audio
```

### Installation & Launch

**Backend:**
```bash
cd server
npm install
npm start
# Server runs on http://localhost:5000
```

**Frontend:**
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🧪 Testing the System

### Test 1: Character Preference Loading
**Steps:**
1. Open http://localhost:5173
2. Login as student
3. Navigate to any study material
4. Expected: Student dashboard or study interface loads
5. Check browser console: Should see user profile with favoriteCharacter

**Expected Output:**
```javascript
user: {
  _id: "...",
  name: "Student Name",
  email: "student@example.com",
  favoriteCharacter: "Professor Alex",
  studyPreferences: { ... }
}
```

---

### Test 2: Character Selection
**Steps:**
1. Click "⚙️ Settings" button in study interface
2. Navigate to Character Settings page
3. See 5 character cards with descriptions
4. Click preview button on any character
5. Listen to character introduction
6. Select a character (checkmark appears)
7. Click "Save Character"

**Expected Output:**
```
✅ "Character preference saved successfully!"
Auto-redirect to dashboard after 500ms
User profile updated with new character
```

---

### Test 3: Material Narration Generation
**Steps:**
1. Open a study material
2. Click "Narrate with [Character]" button
3. Wait 2-5 seconds for OpenAI generation
4. VoicePlayer panel appears below controls
5. Click play button
6. Hear character narrating material overview

**Expected Output:**
```
✅ "[Character] is ready to narrate!"
Audio plays with character voice
Player shows: current time, duration, playback progress
Volume and speed controls functional
```

---

### Test 4: Adaptive Content Narration
**Steps:**
1. Generate adaptive study content first:
   - Select study mode (Quick/Standard/Deep Dive)
   - Select available time
   - Click "Generate Study Content"
2. Once content generated, click "Narrate Content"
3. Wait for narration generation
4. VoicePlayer appears with content narration

**Expected Output:**
```
✅ Narration generated for full adaptive content
Audio plays the study content
Duration shows longer than material narration
Same VoicePlayer controls available
```

---

### Test 5: Audio Player Controls
**Steps:**
1. Generate any narration
2. Test each control:

**Play/Pause:**
- Click play: Audio starts, button changes to pause
- Click pause: Audio stops, button changes to play

**Progress Seeking:**
- Click on progress bar at 50%
- Audio jumps to 50% through narration
- Time display updates immediately

**Speed Control:**
- Click 0.75x: Audio plays slower
- Click 1.5x: Audio plays faster
- Click 1x: Returns to normal speed

**Volume:**
- Drag volume slider to 50%
- Audio volume is half
- Drag to 0%: Audio mutes
- Drag to 100%: Full volume

**Reset:**
- Click reset (↺) button
- Audio resets to beginning
- Time shows 0:00

**Expected Output:**
```
✅ All controls respond immediately
No lag or stuttering
Audio quality maintained at all speeds
Volume changes smooth
```

---

### Test 6: Character Change During Study
**Steps:**
1. In study interface, have narration playing (pause if needed)
2. Click "⚙️ Settings" button
3. Select different character
4. Click "Save Character"
5. Return to study page
6. Generate narration again
7. Hear new character's voice

**Expected Output:**
```
✅ Settings page loads
New character selected
Preference saved
Character name updates in controls
New narration uses new character voice
```

---

### Test 7: Dark Mode Support
**Steps:**
1. Enable dark mode in application
2. View Character Settings page
3. View study material with narration
4. Inspect VoicePlayer and CharacterSelector

**Expected Output:**
```
✅ All components switch to dark colors
Text remains readable on dark background
Gradient backgrounds adapted for dark mode
Purple tones adjusted appropriately
No contrast issues
```

---

### Test 8: Mobile Responsiveness
**Steps:**
1. Open DevTools (F12)
2. Switch to mobile view (375px wide)
3. Navigate to study material
4. Test character settings page
5. Test VoicePlayer controls

**Expected Output:**
```
✅ Character grid shows 1 column
Buttons stack or wrap appropriately
Audio player takes full width
Controls remain accessible
No horizontal scroll
Touch-friendly sizing (44px+ buttons)
```

---

### Test 9: Error Handling
**Steps:**
1. Go to study material without login
   - Expected: Redirect to login
2. Generate narration with bad token
   - Expected: Error toast, fallback behavior
3. Try to narrate with empty material
   - Expected: Validation error message
4. Generate narration with very long text
   - Expected: Text truncated to 4000 chars, narration still works

**Expected Output:**
```
✅ Authentication errors handled gracefully
API errors show user-friendly messages
Form validation prevents invalid states
Large text automatically truncated
No console errors or crashes
```

---

### Test 10: API Response Validation
**Steps:**
1. Open Network tab in DevTools (F12)
2. Generate narration
3. Watch network requests
4. Check POST to /api/openai/character-narration

**Expected Response:**
```json
{
  "success": true,
  "audioUrl": "/uploads/audio/narration_1234567890_Professor_Alex.mp3",
  "character": "Professor Alex",
  "voice": "onyx",
  "duration": 45,
  "generatedAt": "2024-01-20T10:30:00Z",
  "language": "en-US"
}
```

**Status:** Should be 200 OK
**Time:** 2-5 seconds for generation

---

## 🔍 Debugging Tips

### Check Narration Generation
```javascript
// In browser console
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/openai/character-narration', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    text: 'Hello, this is a test narration.',
    character: 'Professor Alex',
    language: 'en-US'
  })
}).then(r => r.json()).then(console.log);
```

### Check User Preferences
```javascript
// In browser console
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

### Check Available Characters
```javascript
fetch('http://localhost:5000/api/openai/characters')
  .then(r => r.json())
  .then(console.log);
```

---

## 📊 Performance Benchmarks

| Task | Expected Time | Acceptable Range |
|------|----------------|-----------------|
| Page Load | <500ms | <1s |
| Character Fetch | <200ms | <500ms |
| Narration Generation | 3-5s | 2-10s |
| Audio Playback Start | <100ms | <300ms |
| Character Change | <1s | <2s |
| Speed Adjustment | <100ms | <300ms |

---

## 🐛 Common Issues & Solutions

### Issue: "OpenAI API key not found"
**Solution:**
- Check `.env` file has `OPENAI_API_KEY=sk-...`
- Restart backend server after updating .env
- Verify key is valid in OpenAI dashboard

### Issue: Audio file not generating
**Solution:**
- Ensure `/server/uploads/audio/` directory exists
- Check file permissions allow writing
- Verify OpenAI API key is valid
- Check API quota hasn't been exceeded

### Issue: Character preference not saving
**Solution:**
- Verify user is authenticated (token present)
- Check MongoDB connection
- Verify User model has favoriteCharacter field
- Check browser console for API errors

### Issue: Audio player not displaying
**Solution:**
- Verify VoicePlayer component imported in AdaptiveStudyInterface
- Check narrationUrl is populated
- Verify showNarrationPanel state is true
- Check browser console for render errors

### Issue: Settings button not working
**Solution:**
- Verify react-router is installed
- Check `/student/character-settings` route exists
- Verify character settings page component exists
- Check browser console for navigation errors

---

## ✅ Validation Checklist

Before considering Phase 1 complete, verify:

- [ ] All 5 characters load without error
- [ ] Character preview audio plays successfully
- [ ] Character selection saves to database
- [ ] Study interface loads preferred character
- [ ] Narration generates in 2-5 seconds
- [ ] Audio plays without stuttering
- [ ] All playback controls function
- [ ] Speed adjustment works (all 4 speeds)
- [ ] Volume control functions
- [ ] Dark mode displays correctly
- [ ] Mobile view is responsive
- [ ] Settings button navigates correctly
- [ ] Character preference updates on change
- [ ] Error messages display appropriately
- [ ] No console errors during normal usage
- [ ] API responses valid and formatted
- [ ] Database records created properly
- [ ] Audio files saved to disk
- [ ] Performance meets benchmarks
- [ ] Accessibility features work

---

## 🎯 Success Criteria

Phase 1 is successful when:
1. ✅ All 5 character voices work without errors
2. ✅ Students can select and change characters
3. ✅ Narration generates reliably (>95% success rate)
4. ✅ Audio plays correctly on all devices
5. ✅ User experience is smooth and responsive
6. ✅ No performance degradation on study interface
7. ✅ Students report satisfaction with feature
8. ✅ System handles errors gracefully

---

**Next Steps After Validation:**
- Deploy to staging environment
- Conduct user acceptance testing with real students
- Gather feedback on character preferences
- Monitor usage metrics
- Plan Phase 1C analytics implementation

---

**Phase 1 Testing Complete!** 🎉
