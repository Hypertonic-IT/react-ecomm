const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
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
    // Return relative path. The frontend's getImageUrl will prepend the API base URL.
    res.send({
        message: 'Image Uploaded',
        image: `/uploads/${req.file.filename}`
    });
});

module.exports = router;
