const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			max: 50,
			min: 2,
		},
		lastName: {
			type: String,
			required: true,
			max: 50,
			min: 2,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			min: 2,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		pictureBase64Url: {
			type: String,
			default: "",
		},
		friends: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);


UserSchema.methods.comparePassword = async function(password) {
	return await bcrypt.compare(password, this.password);
}
UserSchema.methods.createJwt = async function() {
	const payload = {
		userId: this._id,
		firstName: this.firstName,
		lastName: this.lastName,
	}
	return jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '1d'});
}

module.exports = mongoose.model("User", UserSchema);
