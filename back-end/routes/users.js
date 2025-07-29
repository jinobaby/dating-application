// const router = require('express').Router();
// const bcrypt = require('bcrypt');
// const user = require('../models/userSchema');
// var post = require('../models/postSchema');
// const path = require('path');
// const multer = require('multer');

// // --- Multer setup (move this to the top!) ---
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../public/uploads'));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage });

// // Middleware to check if user is authenticated (session-based)
// function isAuthenticated(req, res, next) {
//   if (req.session.userId) {
//     return next();
//   }
//   res.redirect('/login');
// }

// // --- Signup ---
// router.get('/signup', (req, res) => {
//   try {
//     res.render('signup');
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
// router.post('/signup-data', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new user({ email, password: hashedPassword });
//     const savedUser = await newUser.save();
//     req.session.userId = savedUser._id;
//     res.redirect(`/location-permission?userId=${newUser._id}`);
//   } catch (error) {
//     console.error('Error saving user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // --- Login ---
// router.get('/login', (req, res) => {
//   res.render('login');
// });
// router.post('/login-data', async (req, res) => {
//   try {
//     const userdata = await user.findOne({ email: req.body.email });
//     if (userdata) {
//       const isPasswordValid = await bcrypt.compare(req.body.password, userdata.password);
//       if (isPasswordValid) {
//         req.session.userId = userdata._id;
//         res.redirect('/home');
//       } else {
//         res.render('login', { message: 'invalid Email or Password' });
//       }
//     } else {
//       res.render('login', { message: 'Sorry we couldnt find your account' });
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // --- Location Permission ---
// router.get('/location-permission', isAuthenticated, (req, res) => {
//   res.render('location-permission', { userId: req.session.userId });
// });
// router.post('/save-location', isAuthenticated, async (req, res) => {
//   const { latitude, longitude } = req.body;
//   try {
//     await user.findByIdAndUpdate(req.session.userId, {
//       location: { latitude, longitude }
//     });
//     res.json({ message: 'Location saved succesfully', redirect: `/notification?userId=${req.session.userId}` });
//   } catch (error) {
//     console.log('Error Saving Location');
//     res.status(500).json({ error: 'Failed to save location' });
//   }
// });

// // --- Notification Permission ---
// router.get('/notification', isAuthenticated, (req, res) => {
//   res.render('notification', { userId: req.session.userId });
// });
// router.post('/enable-notifications', isAuthenticated, async (req, res) => {
//   try {
//     const { enabled } = req.body;
//     await user.findByIdAndUpdate(req.session.userId, { NotificationsEnabled: !!enabled });
//     res.json({ redirect: `/createaccount?userId=${req.session.userId}` });
//   } catch (error) {
//     console.error('Error enabling notifications:', error);
//     res.status(500).json({ error: 'Failed to update notification preference' });
//   }
// });

// // --- Create Account ---
// router.get('/createaccount', isAuthenticated, (req, res) => {
//   res.render('createaccount');
// });
// router.post('/createaccount', isAuthenticated, async (req, res) => {
//   try {
//     const { name, day, month, year } = req.body;
//     if (!name || !day || !month || !year) {
//       return res.status(400).render('createaccount', { message: ' Please Fill Out the Fields ' });
//     }
//     await user.findByIdAndUpdate(req.session.userId, {
//       firstName: name,
//       dateOfBirth: new Date(`${year}-${month}-${day}`)
//     });
//     res.redirect(`/gender?userId=${req.session.userId}`);
//   } catch (error) {
//     console.error('Error adding name and Date Of birth:', error);
//     res.status(500).json({ error: 'Failed to add name and DOB' });
//   }
// });

// // --- Gender ---
// router.get('/gender', isAuthenticated, async (req, res) => {
//   try {
//     const userData = await user.findById(req.session.userId).lean();
//     res.render('gender', { userId: req.session.userId, name: userData?.firstName });
//   } catch (error) {
//     res.status(500).render('error', { message: 'Internal server error' });
//   }
// });
// router.post('/gender', isAuthenticated, async (req, res) => {
//   try {
//     const { gender } = req.body;
//     if (!gender) {
//       return res.status(400).render('gender', { message: 'Please select the gender' });
//     }
//     await user.findByIdAndUpdate(req.session.userId, { gender });
//     res.redirect(`/typeOfRelationship?userId=${req.session.userId}`);
//   } catch (error) {
//     console.error('Error adding Gender:', error);
//     res.status(500).json({ error: 'Failed to assign gender' });
//   }
// });

// // --- Type of Relationship ---
// router.get('/typeOfRelationship', isAuthenticated, async (req, res) => {
//   try {
//     const userData = await user.findById(req.session.userId).lean();
//     res.render('typeOfRelationship', { userId: req.session.userId, name: userData?.firstName });
//   } catch (error) {
//     res.status(500).render('error', { message: 'Internal server error' });
//   }
// });
// router.post('/typeOfRelationship', isAuthenticated, async (req, res) => {
//   try {
//     const { choice } = req.body;
//     if (!choice) {
//       return res.status(400).render('typeOfRelationship', { message: 'Please select the a choice' });
//     }
//     const choices = Array.isArray(req.body.choice) ? req.body.choice : [req.body.choice];
//     await user.findByIdAndUpdate(req.session.userId, { choice: choices });
//     res.redirect(`/height?userId=${req.session.userId}`);
//   } catch (error) {
//     console.error('Error choosing type:', error);
//     res.status(500).json({ error: 'Failed to assign type' });
//   }
// });

// // --- Height ---
// router.get('/height', isAuthenticated, async (req, res) => {
//   try {
//     const userData = await user.findById(req.session.userId).lean();
//     res.render('height', { userId: req.session.userId, name: userData?.firstName });
//   } catch (error) {
//     res.status(500).render('error', { message: 'Internal server error' });
//   }
// });
// router.post('/height', isAuthenticated, async (req, res) => {
//   try {
//     let { height } = req.body;
//     height = Number(height);
//     if (!height || height < 50 || height > 250) {
//       return res.status(400).render('height', { message: 'Please enter a valid height in centimeters.' });
//     }
//     await user.findByIdAndUpdate(req.session.userId, { height });
//     res.redirect(`/hobby?userId=${req.session.userId}`);
//   } catch (error) {
//     console.error('Error choosing height:', error);
//     res.status(500).json({ error: 'Failed to choose height' });
//   }
// });

// // --- Hobby ---
// router.get('/hobby', isAuthenticated, async (req, res) => {
//   const popularHobbies = [
//     "Cats", "Writing", "Wine", "Crafts", "Dancing", "Baking", "Camping",
//     "Concerts", "Coffee", "Hiking trips", "R&B", "Country"
//   ];
//   const hobbyEmojis = [
//     "🐱", "📝", "🍷", "🧷", "💃", "🍰", "🏕️",
//     "🎟️", "☕", "🏕️", "🎵", "🎶"
//   ];
//   // More skills/hobbies for search only
//   const moreHobbies = [
//     "Coding", "Photography", "Chess", "Swimming", "Cycling", "Board games",
//     "Poetry", "Traveling", "Knitting", "Running", "Cooking", "Painting",
//     "Calligraphy", "Investing", "Public speaking", "Podcasting", "Robotics",
//     "Astronomy", "Birdwatching", "Magic tricks", "Languages", "Rock climbing",
//     "Surfing", "Pottery", "Origami", "Sculpting", "Martial arts", "Makeup",
//     "Fashion", "Blogging", "Podcasting", "Volunteering", "Meditation", "Comics",
//     "Anime", "Karaoke", "Guitar", "Piano", "Drums", "Singing", "DJing",
//     "Mixology", "Baking", "Gardening", "Fishing", "Hiking", "Camping",
//     "Archery", "Horse riding", "Sailing", "Skateboarding", "Snowboarding",
//     "Skiing", "Parkour"
//   ];
//   res.render('hobby', { name: req.user?.firstName, popularHobbies, hobbyEmojis, moreHobbies: JSON.stringify(moreHobbies) });
// });
// router.post('/hobby', isAuthenticated, async (req, res) => {
//   let { hobbies } = req.body;
//   if (!hobbies) hobbies = [];
//   if (!Array.isArray(hobbies)) hobbies = [hobbies];
//   if (hobbies.length !== 5) {
//     // Optionally re-render with error
//     return res.status(400).render('hobby', { message: 'Please select exactly 5 interests.' });
//   }
//   await user.findByIdAndUpdate(req.session.userId, { hobbies });
//   res.redirect(`/qualities?userId=${req.session.userId}`);

// });

// // --- Home ---
// router.get('/home', isAuthenticated, async (req, res) => {
//   try {
//     const currentUserId = req.session.userId;
//     const profiles = await user.find({ _id: { $ne: currentUserId } }).lean(); // Exclude logged-in user

//     // Calculate age for each profile
//     profiles.forEach(profile => {
//       if (profile.dateOfBirth) {
//         const today = new Date();
//         const birthDate = new Date(profile.dateOfBirth);
//         let age = today.getFullYear() - birthDate.getFullYear();
//         const monthDiff = today.getMonth() - birthDate.getMonth();
//         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//           age--;
//         }
//         profile.age = age; // Add age to the profile object
//       }
//     });

//     res.render('home', { profiles });
//   } catch (error) {
//     console.error('Error fetching profiles:', error);
//     res.status(500).render('error', { message: 'Failed to load home page' });
//   }
// });

// router.post('/swipe-action', isAuthenticated, async (req, res) => {
//   try {
//     const { targetUserId, action } = req.body;
//     const currentUserId = req.session.userId;

//     if (!targetUserId || !action) {
//       return res.status(400).json({ error: 'Missing targetUserId or action' });
//     }

//     if (action === 'match') {
//       await user.findByIdAndUpdate(currentUserId, { $addToSet: { likes: targetUserId } });
//       const targetUser = await user.findById(targetUserId);
//       if (targetUser && Array.isArray(targetUser.likes) && targetUser.likes.includes(currentUserId)) {
//         await user.findByIdAndUpdate(currentUserId, { $addToSet: { matches: targetUserId } });
//         await user.findByIdAndUpdate(targetUserId, { $addToSet: { matches: currentUserId } });
//       }
//     } else if (action === 'skip') {
//       await user.findByIdAndUpdate(currentUserId, { $addToSet: { dislikes: targetUserId } });
//     } else {
//       return res.status(400).json({ error: 'Invalid action' });
//     }

//     res.json({ success: true });
//   } catch (error) {
//     console.error('Error processing swipe action:', error);
//     res.status(500).json({ error: 'Failed to process swipe action' });
//   }
// });

// // --- Profile ---
// router.get('/profile', isAuthenticated, async (req, res) => {
//   try {
//     const userData = await user.findById(req.session.userId).lean();
//     res.render('profile', { user: userData });
//   } catch (error) {
//     console.error('Error fetching user data for profile:', error);
//     res.status(500).render('error', { message: 'Failed to load profile page' });
//   }
// });

// router.post('/updateProfile', isAuthenticated, async (req, res) => {
//   try {
//     const { name, hobbies } = req.body;
//     const updatedData = { firstName: name, hobbies: Array.isArray(hobbies) ? hobbies : [hobbies] };
//     await user.findByIdAndUpdate(req.session.userId, updatedData);
//     res.redirect('/profile');
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).render('error', { message: 'Failed to update profile' });
//   }
// });

// // --- Qualities ---
// router.get('/qualities', isAuthenticated, async (req, res) => {
//   const qualities = [
//     "Ambition", "Confidence", "Curiosity", "Emotional intelligence", "Empathy", "Generosity",
//     "Gratitude", "Humility", "Humour", "Kindness", "Leadership", "Loyalty",
//     "Openness", "Optimism", "Playfulness", "Sarcasm", "Sassiness"
//   ];
//   res.render('qualities', { qualities, userId: req.session.userId });
// })

// router.post('/qualities', isAuthenticated, async (req, res) => {
//   let { qualities } = req.body;
//   if (!qualities) qualities = [];
//   if (!Array.isArray(qualities)) qualities = [qualities];
//   if (qualities.length !== 3) {
//     return res.status(400).render('qualities', {
//       qualities: [
//         "Ambition", "Confidence", "Curiosity", "Emotional intelligence", "Empathy", "Generosity",
//         "Gratitude", "Humility", "Humour", "Kindness", "Leadership", "Loyalty",
//         "Openness", "Optimism", "Playfulness", "Sarcasm", "Sassiness"
//       ],
//       message: 'Please select exactly 3 qualities.'
//     });
//   }
//   await user.findByIdAndUpdate(req.session.userId, { qualities });
//   res.redirect(`/habits?userId=${req.session.userId}`);
// })

// // --- Habits ---
// router.post('/habits', isAuthenticated, async (req, res) => {
//   const { drinking, smoking } = req.body;
//   await user.findByIdAndUpdate(req.session.userId, { drinking, smoking });
//   res.redirect(`/kidsnfamily?userId=${req.session.userId}`)
// })

// router.get('/habits', isAuthenticated, async (req, res) => {
//   res.render('habits', { userId: req.session.userId });
// })

// // --- kids and family ---
// router.post('/kidsnfamily', isAuthenticated, async (req, res) => {
//   const { family, kids } = req.body;
//   await user.findByIdAndUpdate(req.session.userId, { family, kids });
//   res.redirect(`/religionNpolitics?userId=${req.session.userId}`)
// })

// router.get('/kidsnfamily', isAuthenticated, async (req, res) => {
//   res.render('kidsAndFamily', { userId: req.session.userId });
// })

// // --- religion and politics ---
// router.post('/religionNpolitics', isAuthenticated, async (req, res) => {
//   const { religion, politics } = req.body;
//   await user.findByIdAndUpdate(req.session.userId, { religion, politics });
//   res.redirect(`/causesNcommunities?userId=${req.session.userId}`)
// })

// router.get('/religionNpolitics', isAuthenticated, async (req, res) => {
//   res.render('religionNpolitics', { userId: req.session.userId });
// })

// // --- causes and communities ---
// router.post('/causesNcommunities', isAuthenticated, async (req, res) => {
//   let { cause } = req.body;
//   if (!cause) cause = [];
//   if (!Array.isArray(cause)) cause = [cause];
//   await user.findByIdAndUpdate(req.session.userId, { causes: cause });
//   res.redirect(`/upload?userId=${req.session.userId}`)
// })

// router.get('/causesNcommunities', isAuthenticated, async (req, res) => {
//   res.render('causesNcommunities', { userId: req.session.userId });
// })

// // --- upload ---
// router.get('/upload', isAuthenticated, async (req, res) => {
//   res.render('upload', { userId: req.session.userId });
// });

// router.post('/upload', isAuthenticated, upload.fields([
//   { name: 'image1', maxCount: 1 },
//   { name: 'image2', maxCount: 1 },
//   { name: 'image3', maxCount: 1 },
//   { name: 'image4', maxCount: 1 },
//   { name: 'image5', maxCount: 1 },
//   { name: 'image6', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     // Collect file paths for each image (if uploaded)
//     const images = [];
//     for (let i = 1; i <= 6; i++) {
//       if (req.files[`image${i}`] && req.files[`image${i}`][0]) {
//         images.push('/uploads/' + req.files[`image${i}`][0].filename);
//       } else {
//         images.push(null); // Or skip, or use a default image
//       }
//     }

//     // Save to MongoDB (assuming user is logged in and userSchema has an 'images' field)
//     await user.findByIdAndUpdate(req.session.userId, { images });

//     res.redirect(`home` + `?userId=${req.session.userId}`);
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).render(`home?userId=${req.session.userId}`, { message: 'Image upload failed. Please try again.' });
//   }
// });

// // --- Matches: users who mutually liked each other ---
// router.get('/matches', isAuthenticated, async (req, res) => {
//   try {
//     const currentUser = await user.findById(req.session.userId).lean();
//     // Find users whose _id is in currentUser.matches
//     const matchedUsers = await user.find({ _id: { $in: currentUser.matches || [] } }).lean();
//     res.render('matches', { matches: matchedUsers });
//   } catch (error) {
//     console.error('Error fetching matches:', error);
//     res.status(500).render('error', { message: 'Failed to load matches' });
//   }
// });

// // --- Likes: users who liked the current user but are not yet matched ---
// router.get('/likes', isAuthenticated, async (req, res) => {
//   try {
//     const currentUser = await user.findById(req.session.userId).lean();
//     // Find users who have liked the current user, but are not yet matched
//     const likedUsers = await user.find({
//       likes: req.session.userId,
//       _id: { $nin: currentUser.matches || [] }
//     }).lean();
//     res.render('likes', { likes: likedUsers });
//   } catch (error) {
//     console.error('Error fetching likes:', error);
//     res.status(500).render('error', { message: 'Failed to load likes' });
//   }
// });

// module.exports = router;
