const { Router } = require('express');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
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
        const blog = await Blog.findById(blogId)
            .populate('createdBy', 'name profileImageURL');

        if (!blog) {
            return res.status(404).render('404', { user: req.user });
        }

        // Fetch comments separately
        const comments = await Comment.find({ blog: blogId })
            .populate('user', 'name profileImageURL')
            .sort({ createdAt: -1 });

        return res.render('blogDetails', {
            user: req.user,
            blog,
            comments
        });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return res.status(500).render('blogDetails', {
            user: req.user,
            error: 'Error loading blog post'
        });
    }
});

router.get('/edit/:id', async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }

    const blogId = req.params.id;

    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).render('404', { user: req.user });
    }

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).render('404', { user: req.user });
        }

        if (blog.createdBy.toString() !== req.user._id.toString()) {
            return res.redirect(`/blog/${blogId}`);
        }

        return res.render('editBlog', {
            user: req.user,
            blog
        });
    } catch (error) {
        console.error('Error loading blog for edit:', error);
        return res.redirect('/');
    }
});

router.post('/edit/:id', upload.single('coverImage'), async (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }

    const blogId = req.params.id;

    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).render('404', { user: req.user });
    }

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).render('404', { user: req.user });
        }

        if (blog.createdBy.toString() !== req.user._id.toString()) {
            return res.redirect(`/blog/${blogId}`);
        }

        const { title, body } = req.body;
        const updateData = { title, body };

        if (req.file) {
            updateData.coverImageURL = `/uploads/${req.user._id}/${req.file.filename}`;
        }

        await Blog.findByIdAndUpdate(blogId, updateData);
        return res.redirect(`/blog/${blogId}`);
    } catch (error) {
        console.error('Error updating blog post:', error);
        const blog = await Blog.findById(blogId).catch(() => null);
        return res.render('editBlog', {
            user: req.user,
            blog,
            error: 'Error updating blog post'
        });
    }
});

router.post('/:id/delete', async (req, res) => {
    if(!req.user){
        return res.redirect('/user/signin');
    }   

    const blogId = req.params.id;

    try {
        await Blog.findByIdAndDelete(blogId);
        return res.redirect('/');
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return res.status(500).render('blogDetails', {
            user: req.user,
            error: 'Error deleting blog post'
        });
    }
});

router.post('/comment/:blogId', async (req, res) => {
    if(!req.user){
        return res.redirect('/user/signin');
    }   

    const blogId = req.params.blogId;
    const { content } = req.body;

    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).render('404', { user: req.user });
    }

    if (!content || content.trim().length === 0) {
        return res.redirect(`/blog/${blogId}`);
    }

    if (content.length > 500) {
        return res.redirect(`/blog/${blogId}`);
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).render('404', { user: req.user });
        }

        await Comment.create({
            blog: blogId,
            user: req.user._id,
            content: content.trim()
        });

        return res.redirect(`/blog/${blogId}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.redirect(`/blog/${blogId}`);
    }
});

module.exports = router;