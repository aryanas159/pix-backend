const Post = require("../modals/Post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const getAllPosts = async (req, res) => {
	const posts = await Post.find({}).select("-pictureBase64Url").sort("-createdAt");
	res.status(StatusCodes.OK).json({ posts });
};
const getUserPosts = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		throw new BadRequestError("Id is not provided");
	}
	const posts = await Post.find({ userId: id }).select("-pictureBase64Url");
	res.status(StatusCodes.OK).json({ posts });
};

const createPost = async (req, res) => {
	const {
		userId,
		firstName,
		lastName,
	} = req.user;

	const { pictureBase64Url, description } = req.body;

	if (!userId || !firstName || !lastName) {
		throw new UnauthenticatedError("Token Invalid");
	}
	const post = await Post.create({
		userId,
		firstName,
		lastName,
		pictureBase64Url,
		description,
	});
	const allPosts = await Post.find({}).select("-pictureBase64Url").sort("-createdAt");
	res.status(StatusCodes.OK).json({ allPosts });
};
const likePost = async (req, res) => {
	const { postId } = req.params;
	if (!postId) {
		throw new BadRequestError("Post Id is not provided");
	}
	const { userId } = req.user;
	if (!userId) {
		throw new UnauthenticatedError("Token Invalid");
	}
	const post = await Post.findById(postId).select("-pictureBase64Url");
	const isLiked = !!post.likes.get(userId);
	if (isLiked) {
		post.likes.delete(userId);
	} else {
		post.likes.set(userId, true);
	}
	await post.save();

	res.status(StatusCodes.OK).json({ post });
};
const postComment = async (req, res) => {
	const { postId } = req.params;
	if (!postId) {
		throw new BadRequestError("Post Id is not provided");
	}
	const {
		userId,
		firstName,
		lastName,
	} = req.user;
	if (!userId || !firstName || !lastName) {
		throw new UnauthenticatedError("Token Invalid");
	};
    const {content} = req.body;
    if (!content) {
        throw new BadRequestError('Comment can not be empty');
    }
    const comment = {
        userId,
        postId,
        firstName,
        lastName,
        content
    }

    const post = await Post.findById(postId);
    post.comments.unshift(comment);
    await post.save();
    res.status(StatusCodes.CREATED).json({comments: post.comments})
};
const getPostImage = async (req, res) => {
	const {postId} = req.params;
	if (!postId) {
		throw new BadRequestError('Provide postId')
	}
	const post = await Post.findById(postId);
	if (!post) {
		throw new NotFoundError(`Post with id ${postId} does not exist`);
	}
	const pictureBase64Url = post.pictureBase64Url;
	if (!pictureBase64Url) {
		throw new NotFoundError('post Image does not exist')
	}
	const base64String = pictureBase64Url.split(',')[1];
	res.status(StatusCodes.OK).json({base64String})
}

module.exports = {
	getAllPosts,
	getUserPosts,
	createPost,
	likePost,
	postComment,
	getPostImage
};
