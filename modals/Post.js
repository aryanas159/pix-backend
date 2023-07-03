const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		firstName: {
			type: String,
			required: [true, "First name is required"],
			max: 50,
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			max: 50,
		},
		pictureBase64Url: {
			type: String,
			default: "",
		},
		description: {
			type: String,
			default: "",
		},
		likes: {
			type: Map,
			of: Boolean,
			default: {},
		},
		comments: [
			{
				type: Object,
				default: [],
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
