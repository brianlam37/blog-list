const listHelper = require('../utils/list_helper');
const blogs = require('./test_helper');

describe('most blogs', () => {
	test('when list has only one blog, author with most likes is the author of that one', () => {
		const result = listHelper.mostLikes(blogs.listWithOneBlog);
		const expected = {
			author: blogs.listWithOneBlog[0].author,
			likes: blogs.listWithOneBlog[0].likes
		};
		expect(result).toEqual(expected);
	});

	test('when list has many blogs, equals the author with most likes', () => {
		const result = listHelper.mostLikes(blogs.blogs);
		const expected = {
			author: 'Edsger W. Dijkstra',
			likes: 17
		};
		expect(result).toEqual(expected);
	});


	test('when list has 0 blogs, equals no blogs', () => {
		const result = listHelper.mostLikes([]);
		const empty = {
			message: 'no blogs'
		};
		expect(result).toEqual(empty);
	});
});