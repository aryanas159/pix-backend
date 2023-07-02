const {
	searchUser,
	getAllUsers,
	getUser,
	getUserFriends,
	addRemoveFriend,
    getOwnFriends
} = require("../controllers/usersController");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
router.route("/").get(authMiddleware, getAllUsers);
router.route("/friends").get(authMiddleware, getOwnFriends);
router.route("/search").get(authMiddleware, searchUser);
router.route("/:id").get(authMiddleware, getUser);
router.route("/:id/friends").get(authMiddleware, getUserFriends);
router.route("/:friendId").post(authMiddleware, addRemoveFriend);

module.exports = router;
