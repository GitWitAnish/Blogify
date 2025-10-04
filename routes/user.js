const { Router } = require('express');

const router = Router();

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    await User.create({ name, email, password });

    return res.redirect('/');

});

module.exports = router;