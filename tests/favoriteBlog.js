const listHelper = require('../utils/list_helper');

const blogs = require('./test_helper');

describe('favoriteBlog', () => {


	test('when list has only one blog, favorite blog is that one', () => {
		const result = listHelper.favoriteBlog(blogs.listWithOneBlog);
		const formattedBlog = {
			title: blogs.listWithOneBlog[0].title,
			author: blogs.listWithOneBlog[0].author,
			likes: blogs.listWithOneBlog[0].likes
		};
		expect(result).toEqual(formattedBlog);
	});

	test('when list has many blogs, equals the one with most likes', () => {
		const result = listHelper.favoriteBlog(blogs.blogs);
		const formattedBlog = {
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			likes: 12
		};
		expect(result).toEqual(formattedBlog);
	});


	test('when list has 0 blogs, equals no blogs', () => {
		const result = listHelper.favoriteBlog([]);
		const empty = {
			message: 'no blogs'
		};
		expect(result).toEqual(empty);
	});
});