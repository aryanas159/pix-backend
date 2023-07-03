const User = require("../modals/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../errors");
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const {password} = req.body;
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt)
	const users = await User.create(req.body);
	res.status(StatusCodes.OK).json({ users });
};

const login = async (req, res) => {
	const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Email and Password must be provided');
    }
    const user = await User.findOne({email}).select("-pictureBase64Url");
    if (!user) {
        throw new NotFoundError('User with the provided email doesn\'t exist');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Provided password is incorrect');
    }
    const token = await user.createJwt();
	res.status(StatusCodes.OK).json({token, user});
};

module.exports = { register, login };
