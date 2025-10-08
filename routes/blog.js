const { Router } = require('express');
const Blog = require('../models/blog');

const router = Router();

router.get('/add', (req, res) => {
    if(!req.user){
        return res.redirect('/user/signin');
    }
    return res.render('addBlog', {
        user: req.user
    });
});




module.exports = router;