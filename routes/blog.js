const { Router } = require('express');
const Blog = require('../models/blog');
const path = require('path');
const multer = require('multer');
const fs = require('fs');


const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve('public/uploads/' + req.user._id);
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get('/add', (req, res) => {
    if(!req.user){
        return res.redirect('/user/signin');
    }
    return res.render('addBlog', {
        user: req.user
    });
});




module.exports = router;