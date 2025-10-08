const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

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


app.get('/', (req, res) => {
  return res.render('home', {
      user: req.user
  });
});



app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
