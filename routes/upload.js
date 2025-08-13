const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// @route   POST /api/upload/image
// @desc    Upload single image
// @access  Private (Admin only)
router.post('/image', auth, (req, res) => {
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'File too large. Maximum size is 5MB.'
        });
      }
      return res.status(400).json({
        message: 'File upload error: ' + err.message
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    // Return file info
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      }
    });
  });
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private (Admin only)
router.post('/multiple', auth, (req, res) => {
  const uploadMultiple = upload.array('images', 5); // Max 5 files

  uploadMultiple(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'One or more files are too large. Maximum size is 5MB per file.'
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          message: 'Too many files. Maximum is 5 files.'
        });
      }
      return res.status(400).json({
        message: 'File upload error: ' + err.message
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded'
      });
    }

    // Return files info
    const filesInfo = req.files.map(file => {
      const fileUrl = `/uploads/${file.filename}`;
      return {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      };
    });

    res.json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      data: filesInfo
    });
  });
});

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded image
// @access  Private (Admin only)
router.delete('/:filename', auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      message: 'Error deleting file',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   GET /api/upload/list
// @desc    Get list of uploaded images
// @access  Private (Admin only)
router.get('/list', auth, (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    const filesInfo = imageFiles.map(file => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      const fileUrl = `/uploads/${file}`;

      return {
        filename: file,
        size: stats.size,
        uploadDate: stats.birthtime,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      };
    });

    res.json({
      success: true,
      data: filesInfo.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
    });

  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      message: 'Error listing files',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;