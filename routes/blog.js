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

router.post('/add', upload.single('coverImage'), async (req, res) => {
    if(!req.user){
        return res.redirect('/user/signin');
    }

    try {
        const { title, body } = req.body;
        let coverImageURL = null;

        if (req.file) {
            coverImageURL = `/uploads/${req.user._id}/${req.file.filename}`;
        }

        await Blog.create({
            title,
            body,
            coverImageURL,
            createdBy: req.user._id
        });

        return res.redirect('/');
    } catch (error) {
        console.error('Error creating blog post:', error);
        return res.render('addBlog', {
            user: req.user,
            error: 'Error creating blog post'
        });
    }
});

router.get('/:id', async (req, res) => {
    const blogId = req.params.id;

    // Validate MongoDB ObjectId format
    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).render('404', { user: req.user });
    }

    try {
        const blog = await Blog.findById(blogId).populate('createdBy', 'name profileImageURL');

        if (!blog) {
            return res.status(404).render('404', { user: req.user });
        }

        return res.render('blogDetails', {
            user: req.user,
            blog
        });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return res.status(500).render('blogDetails', {
            user: req.user,
            error: 'Error loading blog post'
        });
    }
});


module.exports = router;