import multer from 'multer';    // to handle multipart/form-data (file uploads)

const upload = multer ({
    storage: multer.memoryStorage() // store the file in memory as a buffer and this can be accessed using req.file (req.file.buffer)
});

export default upload;