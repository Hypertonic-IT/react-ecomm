const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', upload.single('image'), (req, res) => {
    // Return the full URL path that the frontend will access
    // Assuming server runs on 5001. We return a relative path or full URL.
    // For simplicity cross-origin, we can return the Full URL if we know the host, 
    // or relative path and let frontend append host.
    // Let's return path relative to server root.
    res.send({
        message: 'Image Uploaded',
        image: `http://localhost:5001/uploads/${req.file.filename}`
    });
});

module.exports = router;
