const router = require('express').Router();
const bcrypt = require('bcrypt');
const user = require('../models/userSchema');
const multer = require('multer');
var post = require('../models/postSchema');
const { route } = require('../app');
const path = require('path');
const { log } = require('console');



// Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../public/uploads'));
//   },
//   filename: (req, file, cb) => {
//     const userId = req.session.userId;
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//     cb(null, `${userId}-${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { files: 6 }, // Limit to 6 files
//   fileFilter: (req, file, cb) => {
//     console.log('File being uploaded:', file.originalname);
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (!allowedTypes.includes(file.mimetype)) {
//       console.error('Invalid file type:', file.mimetype);
//       return cb(new Error('Only JPEG, PNG, and JPG files are allowed.'));
//     }
//     cb(null, true);
//   },
// });

// Route to handle image uploads
// router.post('/upload-images', isAuthenticated, (req, res) => {
//   if (!req.session.userId) {
//     console.error('Session userId is undefined');
//     return res.status(400).render('error', { message: 'User session not found.' });
//   }

//   upload.array('images', 6)(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       console.error('Multer error:', err);
//       return res.status(400).render('create-upload', {
//         message: 'Error uploading images. Please try again.',
//       });
//     } else if (err) {
//       console.error('Unknown error:', err);
//       return res.status(500).render('error', { message: 'Internal server error' });
//     }

//     // Check if the number of files is within the allowed range
//     if (!req.files || req.files.length < 4 || req.files.length > 6) {
//       console.error('Invalid number of files:', req.files ? req.files.length : 0);
//       return res.status(400).render('create-upload', {
//         message: 'Please upload between 4 and 6 images.',
//       });
//     }

//     console.log('Uploaded files:', req.files);
//     res.redirect('/profile'); // Redirect to profile after successful upload
//   });
// });

// Middleware to check if user is authenticated (session-based)
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Handle user signup: hash password, save user, start session, redirect to location permission
router.post('/signup-data', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({ email, password: hashedPassword });
    const savedUser = await newUser.save();
    req.session.userId = savedUser._id;
    res.redirect(`/location-permission?userId=${newUser._id}`);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle user login: validate credentials, start session, redirect to home
router.post('/login-data', async (req, res) => {
  try {
    const userdata = await user.findOne({ email: req.body.email });
    if (userdata) {
      const isPasswordValid = await bcrypt.compare(req.body.password, userdata.password);
      if (isPasswordValid) {
        req.session.userId = userdata._id;
        res.redirect('/home');
      } else {
        res.render('login', { message: 'invalid Email or Password' });
      }
    } else {
      res.render('login', { message: 'Sorry we couldnt find your account' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save user's latitude and longitude, then redirect to notification permission
router.post('/save-location', isAuthenticated, async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    await user.findByIdAndUpdate(req.session.userId, {
      location: { latitude, longitude }
    });
    res.json({ message: 'Location saved succesfully', redirect: `/notification?userId=${req.session.userId}` });
  } catch (error) {
    console.log('Error Saving Location');
    res.status(500).json({ error: 'Failed to save location' });
  }
});

// Save user's notification preference and redirect to create account
router.post('/enable-notifications', isAuthenticated, async (req, res) => {
  try {
    const { enabled } = req.body;
    await user.findByIdAndUpdate(req.session.userId, { NotificationsEnabled: !!enabled });
    res.json({ redirect: `/createaccount?userId=${req.session.userId}` });
  } catch (error) {
    console.error('Error enabling notifications:', error);
    res.status(500).json({ error: 'Failed to update notification preference' });
  }
});

// Save user's name and date of birth, then redirect to gender selection
router.post('/createaccount', isAuthenticated, async (req, res) => {
  try {
    const { name, day, month, year } = req.body;
    if (!name || !day || !month || !year) {
      return res.status(400).render('createaccount', { message: ' Please Fill Out the Fields ' });
    }
    await user.findByIdAndUpdate(req.session.userId, {
      firstName: name,
      dateOfBirth: new Date(`${year}-${month}-${day}`)
    });
    res.redirect(`/gender?userId=${req.session.userId}`);
  } catch (error) {
    console.error('Error adding name and Date Of birth:', error);
    res.status(500).json({ error: 'Failed to add name and DOB' });
  }
});

// Save user's gender selection and redirect to relationship type selection
router.post('/gender', isAuthenticated, async (req, res) => {
  try {
    const { gender } = req.body;
    if (!gender) {
      return res.status(400).render('gender', { message: 'Please select the gender' });
    }
    await user.findByIdAndUpdate(req.session.userId, { gender });
    res.redirect(`/typeOfRelationship?userId=${req.session.userId}`);
  } catch (error) {
    console.error('Error adding Gender:', error);
    res.status(500).json({ error: 'Failed to assign gender' });
  }
});

// Save user's relationship type choices (supports multiple selections), then redirect to height input
router.post('/typeOfRelationship', isAuthenticated, async (req, res) => {
  try {
    const { choice } = req.body;
    if (!choice) {
      return res.status(400).render('typeOfRelationship', { message: 'Please select the a choice' });
    }
    const choices = Array.isArray(req.body.choice) ? req.body.choice : [req.body.choice];
    await user.findByIdAndUpdate(req.session.userId, { choice: choices });
    res.redirect(`/height?userId=${req.session.userId}`);
  } catch (error) {
    console.error('Error choosing type:', error);
    res.status(500).json({ error: 'Failed to assign type' });
  }
});

// Save user's height in centimeters and redirect to home
router.post('/height', isAuthenticated, async (req, res) => {
  try {
    let { height } = req.body;
    height = Number(height);
    if (!height || height < 50 || height > 250) {
      return res.status(400).render('height', { message: 'Please enter a valid height in centimeters.' });
    }
    await user.findByIdAndUpdate(req.session.userId, { height });
    res.redirect(`/hobby?userId=${req.session.userId}`);
  } catch (error) {
    console.error('Error choosing height:', error);
    res.status(500).json({ error: 'Failed to choose height' });
  }
});

// Render gender selection page with user's name
router.get('/gender', isAuthenticated, async (req, res) => {
  try {
    const userData = await user.findById(req.session.userId).lean();
    res.render('gender', { userId: req.session.userId, name: userData?.firstName });
  } catch (error) {
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

// Render signup page
router.get('/signup', (req, res) => {
  try {
    res.render('signup');
  } catch (error) {
    res.status(500).json(error);
  }
});

// Render create account page
router.get('/createaccount', isAuthenticated, (req, res) => {
  res.render('createaccount');
});

// Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Render home page
router.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { userId: req.session.userId });
});

// Render location permission page
router.get('/location-permission', isAuthenticated, (req, res) => {
  res.render('location-permission', { userId: req.session.userId });
});

// Render notification permission page
router.get('/notification', isAuthenticated, (req, res) => {
  res.render('notification', { userId: req.session.userId });
});

// Render relationship type selection page with user's name
router.get('/typeOfRelationship', isAuthenticated, async (req, res) => {
  try {
    const userData = await user.findById(req.session.userId).lean();
    res.render('typeOfRelationship', { userId: req.session.userId, name: userData?.firstName });
  } catch (error) {
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

// Render height input page with user's name
router.get('/height', isAuthenticated, async (req, res) => {
  try {
    const userData = await user.findById(req.session.userId).lean();
    res.render('height', { userId: req.session.userId, name: userData?.firstName });
  } catch (error) {
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

// Render hobby selection page with user's name
router.get('/hobby', isAuthenticated, async (req, res) => {
  const popularHobbies = [
    "Cats", "Writing", "Wine", "Crafts", "Dancing", "Baking", "Camping",
    "Concerts", "Coffee", "Hiking trips", "R&B", "Country"
  ];
  const hobbyEmojis = [
    "🐱", "📝", "🍷", "🧷", "💃", "🍰", "🏕️",
    "🎟️", "☕", "🏕️", "🎵", "🎶"
  ];
  // More skills/hobbies for search only
  const moreHobbies = [
    "Coding", "Photography", "Chess", "Swimming", "Cycling", "Board games", "Poetry", "Traveling", "Knitting", "Running", "Cooking", "Painting", "Calligraphy", "Investing", "Public speaking", "Podcasting", "Robotics", "Astronomy", "Birdwatching", "Magic tricks", "Languages", "Rock climbing", "Surfing", "Pottery", "Origami", "Sculpting", "Martial arts", "Makeup", "Fashion", "Blogging", "Podcasting", "Volunteering", "Meditation", "Comics", "Anime", "Karaoke", "Guitar", "Piano", "Drums", "Singing", "DJing", "Mixology", "Baking", "Gardening", "Fishing", "Hiking", "Camping", "Archery", "Horse riding", "Sailing", "Skateboarding", "Snowboarding", "Skiing", "Parkour"
  ];
  res.render('hobby', { name: req.user?.firstName, popularHobbies, hobbyEmojis, moreHobbies: JSON.stringify(moreHobbies) });
});

//display the profile hbs
// router.get('/profile', isAuthenticated, async (req, res) => {
//   try {
//     // Fetch user data from the database using the session userId
//     const userData = await user.findById(req.session.userId).lean();

//     if (!userData) {
//       return res.status(404).render('error', { message: 'User not found' });
//     }

//     // Fetch uploaded images from the uploads directory
//     const fs = require('fs');
//     const uploadsDir = path.join(__dirname, '../public/uploads');
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//     }
//     const userImages = fs.readdirSync(uploadsDir).filter(file => file.startsWith(req.session.userId));

//     // Add images to user data
//     userData.images = userImages;

//     // Render the profile page with user data
//     res.render('profile', { user: userData });
//   } catch (error) {
//     console.error('Error fetching user data for profile:', error);
//     res.status(500).render('error', { message: 'Internal server error' });
//   }
// });

router.post('/hobby', isAuthenticated, async (req, res) => {
  let { hobbies } = req.body;
  if (!hobbies) hobbies = [];
  if (!Array.isArray(hobbies)) hobbies = [hobbies];
  if (hobbies.length !== 5) {
    // Optionally re-render with error
    return res.status(400).render('hobby', { message: 'Please select exactly 5 interests.' });
  }
  await user.findByIdAndUpdate(req.session.userId, { hobbies });
  res.redirect('/home');
});

module.exports = router;
