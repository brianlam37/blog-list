const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const userRouter = require('./controllers/users');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors());
app.use(express.json());
app.set('json spaces', 2);
app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use(middleware.errorHandler);

module.exports = app;