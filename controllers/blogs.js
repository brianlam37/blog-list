const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Comment = require('../models/comment');


blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
		.populate('user', {username: 1, name: 1})
		.populate('comments');
	response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
	const blogs = await Blog.findById(request.params.id);
	response.json(blogs);
});

blogsRouter.post('/:id/comments', async (request, response) => {

	const body = request.body;
	const decodedToken = jwt.verify(request.token, process.env.SECRET);
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({error: 'token missing or invalid'});
	}
	const blog = await Blog.findById(request.params.id);
	const comment = new Comment({
		content: body.content,
		blog: blog._id
	});
	const postedComment = await comment.save();
	blog.comments = blog.comments.concat(postedComment._id);
	await blog.save();
	response.status(201).json(postedComment);
});

blogsRouter.post('/', async (request, response) => {
	const body = request.body;
	const decodedToken = jwt.verify(request.token, process.env.SECRET);
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({error: 'token missing or invalid'});
	}
	const user = await User.findById(decodedToken.id);
	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		user: user._id,
		likes: body.likes
	});
	const postedBlog = await blog.save();
	postedBlog.populate('user', {username: 1, name: 1}).execPopulate();
	user.blogs = user.blogs.concat(postedBlog._id);
	await user.save();
	response.status(201).json(postedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET);
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({error: 'token missing or invalid'});
	}
	const user = await User.findById(decodedToken.id);
	console.log(user.id);
	const blog = await Blog.findById(request.params.id);
	console.log(blog.user);
	if(blog.user.toString() === user.id.toString()){
		await Blog.findByIdAndRemove(request.params.id);
		response.status(204).end();
	}else{
		response.status(401).json({error: 'not your post'});
	}


});

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body;
	const blog = {
		likes: body.likes
	};

	const putBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true}).populate('user', {username: 1, name: 1});
	response.json(putBlog);
});

module.exports = blogsRouter;