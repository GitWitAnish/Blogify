const express = require('express');
const path = require('path');

const userRouter = require('./routes/user');

const app = express();
const port = 8000;

// Middleware
app.use(express.static(path.resolve('./public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.get('/', (req, res) => {
  return res.render('home');
});



app.use('/user', userRouter);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
