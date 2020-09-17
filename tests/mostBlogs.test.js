const listHelper = require('../utils/list_helper');
const blogs = require('./test_helper');

describe('most blogs', () => {
	test('when list has only one blog, author with most blogs is the author of that one', () => {
		const result = listHelper.mostBlogs(blogs.listWithOneBlog);
		const expected = {
			author: blogs.listWithOneBlog[0].author,
			blogs: 1
		};
		expect(result).toEqual(expected);
	});

	test('when list has many blogs, equals the author with most blogs', () => {
		const result = listHelper.mostBlogs(blogs.blogs);
		const expected = {
			author: 'Robert C. Martin',
			blogs: 3
		};
		expect(result).toEqual(expected);
	});


	test('when list has 0 blogs, equals no blogs', () => {
		const result = listHelper.mostBlogs([]);
		const empty = {
			message: 'no blogs'
		};
		expect(result).toEqual(empty);
	});
});