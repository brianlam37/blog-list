const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

beforeEach(async () => {
	await User.deleteMany({});

	const userObjects = helper.users
		.map(user => new User(user));
	const promiseUserArray = userObjects.map(user => user.save());
	await Promise.all(promiseUserArray);

	await Blog.deleteMany({});

	const blogObjects = helper.blogs
		.map(blog => new Blog(blog));
	const promiseBlogArray = blogObjects.map(blog => blog.save());
	await Promise.all(promiseBlogArray);
});

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(helper.blogs.length);
});

test('a blog can be retrieved from id', async () => {
	const blogsAtStart = await helper.blogsInDb();

	const blogToView = blogsAtStart[0];
	console.log(blogToView.id);
	const resultBlog = await api
		.get(`/api/blogs/${blogToView.id}`)
		.expect(200)
		.expect('Content-Type', /application\/json/);

	expect(resultBlog.body.id).toBeDefined();
});

describe('adding blogs', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('wan', 10);
		const user = new User({username: 'myshell', passwordHash});

		await user.save();
	});
	test('a valid blog can be added', async () => {
		const login = {
			username:'myshell',
			password:'wan'
		};

		const loginResponse = await api
			.post('/api/login')
			.send(login)
			.expect(200);

		const TOKEN = loginResponse.body.token;

		const newBlog = {
			title:'big bobgraphy',
			author: 'big bob',
			url: 'https://bigbob.com',
			likes:0
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${TOKEN}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1);

		const titles = blogsAtEnd.map(b => b.title);

		expect(titles).toContain(
			'big bobgraphy'
		);
	});

	test('a blog without likes can be added and will default to 0', async () => {
		const login = {
			username:'myshell',
			password:'wan'
		};

		const loginResponse = await api
			.post('/api/login')
			.send(login)
			.expect(200);

		const TOKEN = loginResponse.body.token;

		const newBlog = {
			title:'0 likes',
			author: 'michelle',
			url: 'https://myshell.com',
		};


		const response = await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${TOKEN}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(response.body.likes).toEqual(0);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1);

		const titles = blogsAtEnd.map(b => b.title);

		expect(titles).toContain(
			'0 likes'
		);
	});

	test('blog without a title or url is not added', async () => {
		const login = {
			username:'myshell',
			password:'wan'
		};

		const loginResponse = await api
			.post('/api/login')
			.send(login)
			.expect(200);

		const TOKEN = loginResponse.body.token;

		const urlLessBlog = {
			title: 'no url',
			author: 'big bob'
		};
		const titleLessBlog = {
			author: 'big bob',
			url: 'no author'
		};
		const emptyBlog = {

		};

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${TOKEN}`)
			.send(urlLessBlog)
			.expect(400);

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${TOKEN}`)
			.send(titleLessBlog)
			.expect(400);

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${TOKEN}`)
			.send(emptyBlog)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.blogs.length);
	});

	test('a blog cannot be added without token', async () => {
		const TOKEN = null;

		const newBlog = {
			title:'big bobgraphy',
			author: 'big bob',
			url: 'https://bigbob.com',
			likes:0
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${TOKEN}`)
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.blogs.length);
	});

});
test('fails with status code 400 if data invalid user', async () => {
	const newUser = {
		username: 'michelin',
		name: 'michelle',
		password: 'wa'
	};

	await api
		.post('/api/users')
		.send(newUser)
		.expect(400);

	const usersAtEnd = await helper.usersInDb();

	expect(usersAtEnd).toHaveLength(helper.users.length);
});

// test('login user', async () => {
// 	const login = {
// 		username:'myshell',
// 		password:'wan'
// 	};

// 	const response = await api
// 		.post('/api/login')
// 		.send(login)
// 		.expect(200);
// 	console.log(response.body);

// });



afterAll(() => {
	mongoose.connection.close();
});