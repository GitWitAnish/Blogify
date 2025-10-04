const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('Creating user:', { name, email }); // Debug log
        await User.create({ name, email, password });
        console.log('User created successfully');
        return res.redirect('/');
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send('Error creating user');
    }
});

module.exports = router;