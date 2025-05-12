const router = require('express').Router();
const bcrypt = require('bcrypt');
const user = require('../models/userSchema');
const multer = require('multer');
var post = require('../models/postSchema');
const { route } = require('../app');
const path = require('path');



// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const userId = req.session.userId;
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${userId}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { files: 6 }, // Limit to 6 files
  fileFilter: (req, file, cb) => {
    console.log('File being uploaded:', file.originalname);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      console.error('Invalid file type:', file.mimetype);
      return cb(new Error('Only JPEG, PNG, and JPG files are allowed.'));
    }
    cb(null, true);
  },
});

// Route to handle image uploads
router.post('/upload-images', isAuthenticated, (req, res) => {
  if (!req.session.userId) {
    console.error('Session userId is undefined');
    return res.status(400).render('error', { message: 'User session not found.' });
  }

  upload.array('images', 6)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).render('create-upload', {
        message: 'Error uploading images. Please try again.',
      });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).render('error', { message: 'Internal server error' });
    }

    // Check if the number of files is within the allowed range
    if (!req.files || req.files.length < 4 || req.files.length > 6) {
      console.error('Invalid number of files:', req.files ? req.files.length : 0);
      return res.status(400).render('create-upload', {
        message: 'Please upload between 4 and 6 images.',
      });
    }

    console.log('Uploaded files:', req.files);
    res.redirect('/profile'); // Redirect to profile after successful upload
  });
});

//authentication
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

//post the signup data
router.post('/signup-data', async (req, res) => {
  const { email, password } = req.body;

  try {
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //save the user to the database
    const newUser = new user({
      email: email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    req.session.userId = savedUser._id;
    res.redirect('/create-name');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//login data checking route
router.post('/login-data', async (req, res) => {
  console.log('login data :', req.body);
  try {
    const userdata = await user.findOne({ email: req.body.email });
    console.log('userdata :', userdata);

    if (userdata) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        userdata.password
      );
      if (isPasswordValid) {
        req.session.userId = userdata._id;
        res.redirect('/home');
      } else {
        res.render('login', { message: 'invalid Email or Password' });
      }
    } else {
      res.render('login', { message: 'User Not Found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//post the name data
router.post('/create-name', isAuthenticated, async (req, res) => {
  const { fullName } = req.body;

  try {
    if (!fullName) {
      return res.render('create-name', { message: 'Full name is required.' });
    }
    // Split the full name into parts
    const nameParts = fullName.trim().split(/\s+/);

    if (nameParts.length === 1) {
      // If only one word, set it as the first name
      await user.findByIdAndUpdate(req.session.userId, {
        firstName: nameParts[0],
      });
    } else if (nameParts.length === 2) {
      // If two words, set the first and last name
      await user.findByIdAndUpdate(req.session.userId, {
        firstName: nameParts[0],
        lastName: nameParts[1],
      });
    } else if (nameParts.length === 3) {
      // If three words, set first, middle, and last name
      await user.findByIdAndUpdate(req.session.userId, {
        firstName: nameParts[0],
        middleName: nameParts[1],
        lastName: nameParts[2],
      });
    } else {
      // If more than three words, ask the user to enter a valid name
      return res.render('create-name', {
        message: 'Please enter a valid name.',
      });
    }

    res.redirect('/create-upload');
  } catch (error) {
    console.error('Error updating user name:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

// display the signup hbs
router.get('/signup', (req, res) => {
  try {
    res.render('signup');
  } catch (error) {
    res.status(500).json(error);
  }
});

//display the create-name hbs
router.get('/create-name', isAuthenticated, (req, res) => {
  res.render('create-name');
});

//display the create-name hbs
router.get('/create-upload', isAuthenticated, (req, res) => {
  res.render('create-upload');
});

//display the login hbs
router.get('/login', (req, res) => {
  res.render('login');
});

//home page rendering
router.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { userId: req.session.userId });
});

//display the profile hbs
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    // Fetch user data from the database using the session userId
    const userData = await user.findById(req.session.userId).lean();

    if (!userData) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    // Fetch uploaded images from the uploads directory
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const userImages = fs.readdirSync(uploadsDir).filter(file => file.startsWith(req.session.userId));

    // Add images to user data
    userData.images = userImages;

    // Render the profile page with user data
    res.render('profile', { user: userData });
  } catch (error) {
    console.error('Error fetching user data for profile:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

module.exports = router;
