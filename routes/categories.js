const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      message: 'Error fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      message: 'Error fetching category',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category (admin only)
// @access  Private
router.post('/', auth, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category name must be between 1 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, order } = req.body;

    // Check if category with same name exists
    const existingCategory = await Category.findOne({
      name: new RegExp(`^${name}$`, 'i')
    });

    if (existingCategory) {
      return res.status(400).json({
        message: 'Category with this name already exists'
      });
    }

    // Create new category
    const category = new Category({
      name,
      description,
      order: order || 0
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });

  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      message: 'Error creating category',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category (admin only)
// @access  Private
router.put('/:id', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category name must be between 1 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    // Check if new name conflicts with existing category
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({
        name: new RegExp(`^${req.body.name}$`, 'i'),
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({
          message: 'Category with this name already exists'
        });
      }
    }

    // Update category fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        category[key] = req.body[key];
      }
    });

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });

  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      message: 'Error updating category',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category (admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    // Check if category has menu items
    const menuItemsCount = await MenuItem.countDocuments({
      category: req.params.id
    });

    if (menuItemsCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. It has ${menuItemsCount} menu item(s). Please move or delete the menu items first.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      message: 'Error deleting category',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;