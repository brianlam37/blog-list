const _ = require('lodash');

const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const reducer = (sum, item) => {
		return sum+item.likes;
	};

	return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const reducer = (favorite, item) => {
		if(favorite.likes < item.likes){
			const newFavorite = {
				title: item.title,
				author: item.author,
				likes: item.likes
			};
			return newFavorite;
		}else{
			return favorite;
		}
	};
	const empty = {
		message: 'no blogs'
	};
	return blogs.length === 0 ?
		empty :
		blogs.reduce(reducer,
			{
				title: blogs[0].title,
				author: blogs[0].author,
				likes: blogs[0].likes
			});
};

const mostBlogs = (blogs) => {
	if(blogs.length !==0){
		const groupedBlogs = _.groupBy(blogs, blog => blog.author);
		const keys =Object.keys(groupedBlogs);
		let current = 0;
		const formattedBlogs = Object.values(groupedBlogs).map(blog => {
			const formattedBlog = {
				author: keys[current],
				blogs:blog.length
			};
			current++;
			return formattedBlog;
		});
		const reducer = (mostBlogs, item) => {
			if(mostBlogs.blogs < item.blogs){
				return item;
			}else{
				return mostBlogs;
			}
		};

		return formattedBlogs.reduce(reducer, formattedBlogs[0]);
	}else{
		const empty = {
			message:'no blogs'
		};
		return empty;
	}
};

const mostLikes = (blogs) => {
	if(blogs.length !==0){
		const groupedBlogs = _.groupBy(blogs, blog => blog.author);
		const keys =Object.keys(groupedBlogs);
		let current = 0;
		const formattedBlogs = Object.values(groupedBlogs).map(blog => {
			const innerReducer = (totalLikes, item) => {
				return totalLikes + item.likes;
			};
			const sum = blog.reduce(innerReducer, 0);
			const formattedBlog = {
				author: keys[current],
				likes:sum
			};
			current++;
			return formattedBlog;
		});
		const reducer = (mostLikes, item) => {
			if(mostLikes.likes < item.likes){
				return item;
			}else{
				return mostLikes;
			}
		};

		return formattedBlogs.reduce(reducer, formattedBlogs[0]);
	}else{
		const empty = {
			message:'no blogs'
		};
		return empty;
	}
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
};