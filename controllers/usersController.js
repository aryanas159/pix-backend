const { StatusCodes } = require("http-status-codes");
const User = require("../modals/User");
const { NotFoundError, BadRequestError, UnauthenticatedError } = require("../errors");

const searchUser = async (req, res) => {
	const {name} = req.query;
	const users = await User.find({firstName: {$regex: name, $options: 'i'}}).select("-pictureBase64Url")
	res.json({users})
}
const getAllUsers = async (req, res) => {
	const users = await User.find({}).select("-pictureBase64Url")
	res.status(200).json({users})
}
const getUser = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	if (!id) {
		throw new BadRequestError("Please provide userId");
	}
	const user = await User.findById(id).select("-pictureBase64Url");
	if (!user) {
		throw new NotFoundError(`User with id ${id} does not exist`);
	}
	res.status(StatusCodes.OK).json({ user });
};
const getUserFriends = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		throw new BadRequestError("Please provide userId");
	}
	const user = await User.findById(id);
	const friends = await Promise.all(
		user.friends.map((id) => {
			return User.findById(id);
		})
	);
	const formattedFriends = friends.map(
		({ _id, firstName, lastName, email }) => {
			return { _id, firstName, lastName, email };
		}
	);
	res.status(StatusCodes.OK).json({ formattedFriends });
};


const getUserImage = async (req, res) => {
	
	const {userId} = req.params;
	console.log(userId)
	if (!userId) {
		throw new BadRequestError('Provide userId')
	}
	const user = await User.findById(userId);
	if (!user) {
		throw new NotFoundError(`User with id ${userId} does not exist`);
	}
	const pictureBase64Url = user.pictureBase64Url;
	if (!pictureBase64Url) {
		throw new NotFoundError('User Image does not exist')
	}
	const base64String = pictureBase64Url.split(',')[1];
	res.status(StatusCodes.OK).json({base64String})
}

const addRemoveFriend = async (req, res) => {
	const { friendId } = req.params;
	const id = req.user.userId;
	const userId = id;
	if (!id || !friendId) {
		throw new BadRequestError("Provide necessary details");
	}
	const user = await User.findById(id);
	const friend = await User.findById(friendId);
	if (!user || !friend) {
		throw new NotFoundError("User with the id does not exist");
	}
	if (user.friends.includes(friend._id)) {
		user.friends = user.friends.filter((id) => {
			return id != friendId
		});
		friend.friends = friend.friends.filter((id) => id != userId);
	} else {
		user.friends.push(friend._id);
		friend.friends.push(user._id);
	}
	await user.save();
	await friend.save();
	
	// const friends = await Promise.all(
	// 	user.friends.map((id) => {
	// 		return User.findById(id);
	// 	})
	// );
	// const formattedFriends = friends.map(
	// 	({ _id, firstName, lastName, email, picturePath }) => {
	// 		return { _id, firstName, lastName, email, picturePath };
	// 	}
	// );
	res.status(StatusCodes.OK).json({ friends: user.friends });
};
module.exports = { searchUser, getAllUsers, getUser, getUserFriends, addRemoveFriend, getUserImage };
