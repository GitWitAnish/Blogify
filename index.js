const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const Blog = require('./models/blog');

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');


const { checkForAuthenticationCookie } = require('./middlewares/authentication');

mongoose.connect('mongodb://localhost:27017/blogify')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const app = express();
const port = 8000;    

// Middleware
app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.get('/', async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).populate('createdBy', 'name').sort({ createdAt: -1 });
    
    return res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.render('home', {
        user: req.user,
        blogs: [],
        error: 'Error loading blogs'
    });
  }
});



app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
