import DataUriParser from 'datauri/parser.js';
import path from 'path';

const parser =  new DataUriParser();

const getDataUri = (file) => {
    return parser.format(path.extname(file.originalname).toString(), file.buffer).content;
};

export default getDataUri;