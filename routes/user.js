const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.matchPassword(email, password);
        console.log('User authenticated successfully:', user.name);
        return res.redirect('/');
    } catch (error) {
        return res.status(400).send(`Sign in failed: ${error.message}`);
    }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;


    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists');
      return res.status(400).send('Email already exists');
    }

    await User.create({ name, email, password });
    console.log('User created successfully');
    return res.redirect('/signin');
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).send('Error creating user');
  }
});

module.exports = router;