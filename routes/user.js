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

        const token = await User.matchPasswordAndCreateToken(email, password);
        
        return res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 }).redirect('/');
    } catch (error) {
        return res.render('signin', {
          error: "Incorrect Email or Password"
        })
    }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists');
      return res.render('signup', {
        error: 'Email already exists'
      });
    }

    await User.create({ name, email, password });
    console.log('User created successfully');
    return res.redirect('/signin');
  } catch (error) {
    console.error('Error creating user:', error);
    return res.render('signup', {
      error: 'Error creating user'
    });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/');
});

module.exports = router;