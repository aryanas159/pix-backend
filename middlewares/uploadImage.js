const uploadImage = async (req, res, next) => {
	const {picture} = req.body
    const buffer = Buffer.from(picture, 'binary')
    const base64String = buffer.toString('base64')
    console.log(base64String)
    req.picture = base64String;
    next()
};
module.exports = uploadImage;

// function convertFileDataToBase64(fileData) {
//     try {
//       // Create a buffer from the file data
//       const buffer = Buffer.from(fileData, 'binary');

//       // Convert the buffer to base64
//       const base64String = buffer.toString('base64');

//       return base64String;
//     } catch (error) {
//       console.error('Error converting file data to base64:', error);
//       return null;
//     }
//   }
