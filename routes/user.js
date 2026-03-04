const { Router } = require('express');
const User = require('../models/user');
const Blog = require('../models/blog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = Router();

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve('public/uploads/profiles');
   
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const profileUpload = multer({ 
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const token = await User.matchPasswordAndCreateToken(email, password);
        
        return res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 }).redirect('/');
    } catch (error) {
        return res.render('signin', {
          error: "Incorrect Email or Password"
        })
    }
});

router.post('/signup', profileUpload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let profileImageURL = '/images/avatar.jpg'; // Default avatar

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists');
      return res.render('signup', {
        error: 'Email already exists'
      });
    }

  
    if (req.file) {
      profileImageURL = `/uploads/profiles/${req.file.filename}`;
    }

    await User.create({ 
      name, 
      email, 
      password,
      profileImageURL 
    });
    
    console.log('User created successfully with profile image:', profileImageURL);
    return res.redirect('/user/signin');
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle file upload errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.render('signup', {
        error: 'File too large. Maximum size is 5MB.'
      });
    } else if (error.message === 'Only image files are allowed') {
      return res.render('signup', {
        error: 'Only image files (JPG, PNG, GIF, WebP) are allowed.'
      });
    }
    
    return res.render('signup', {
      error: 'Error creating user'
    });
  }
});

router.get('/profile', async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }

    try {
        const profileUser = await User.findById(req.user._id);
        if (!profileUser) {
            return res.status(404).render('404', { user: req.user });
        }

        const blogs = await Blog.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 });

        return res.render('profile', {
            user: req.user,
            profileUser,
            blogs,
            isOwnProfile: true
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        return res.redirect('/');
    }
});

router.get('/profile/:id', async (req, res) => {
    const userId = req.params.id;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).render('404', { user: req.user });
    }

    // Redirect to own profile page if viewing self
    if (req.user && req.user._id.toString() === userId) {
        return res.redirect('/user/profile');
    }

    try {
        const profileUser = await User.findById(userId);
        if (!profileUser) {
            return res.status(404).render('404', { user: req.user });
        }

        const blogs = await Blog.find({ createdBy: userId })
            .sort({ createdAt: -1 });

        return res.render('profile', {
            user: req.user,
            profileUser,
            blogs,
            isOwnProfile: false
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        return res.redirect('/');
    }
});

router.post('/profile/update', profileUpload.single('profileImage'), async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }

    try {
        const { name } = req.body;
        const updateData = {};

        if (name && name.trim().length > 0) {
            updateData.name = name.trim();
        }

        if (req.file) {
            updateData.profileImageURL = `/uploads/profiles/${req.file.filename}`;
        }

        await User.findByIdAndUpdate(req.user._id, updateData);

        const profileUser = await User.findById(req.user._id);
        const blogs = await Blog.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 });

        return res.render('profile', {
            user: { ...req.user, ...updateData },
            profileUser,
            blogs,
            isOwnProfile: true,
            success: 'Profile updated successfully!'
        });
    } catch (error) {
        console.error('Error updating profile:', error);

        const profileUser = await User.findById(req.user._id).catch(() => null);
        const blogs = await Blog.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 }).catch(() => []);

        return res.render('profile', {
            user: req.user,
            profileUser,
            blogs,
            isOwnProfile: true,
            error: 'Error updating profile'
        });
    }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/');
});

module.exports = router;