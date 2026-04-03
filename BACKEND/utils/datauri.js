import DataUriParser from 'datauri/parser.js';
import path from 'path';

const parser =  new DataUriParser();

const getDataUri = (file) => {
    return parser.format(path.extname(file.originalname).toString(), file.buffer).content;
};

export default getDataUri;  // This function will convert the file to data uri format which can be uploaded to 
// cloudinary directly. Basically, it converts the file buffer to base64 format and adds the necessary prefix to
// it and returns the complete data uri string which can be uploaded to cloudinary directly.

// Form data from client -> comes to backend
// This is converted to json object using express.urlencoded middleware
// Using multer middleware, we upload the image and it is stored in req.file
// This is then passed to getDataUri function to create a uri
// uri is uploaded to the cloudinary