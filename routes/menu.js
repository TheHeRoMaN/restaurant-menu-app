const express = require('express');
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items with category info
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, available, sort } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    // Build sort options
    let sortOptions = { order: 1, name: 1 };
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'name') {
      sortOptions = { name: 1 };
    }

    const menuItems = await MenuItem.find(query)
      .populate('category', 'name description order')
      .sort(sortOptions);

    // Group by category for better organization
    const groupedMenu = {};

    menuItems.forEach(item => {
      const categoryName = item.category.name;
      if (!groupedMenu[categoryName]) {
        groupedMenu[categoryName] = {
          category: item.category,
          items: []
        };
      }
      groupedMenu[categoryName].items.push(item);
    });

    // Convert to array and sort by category order
    const menuArray = Object.values(groupedMenu).sort((a, b) => 
      (a.category.order || 0) - (b.category.order || 0)
    );

    res.json({
      success: true,
      data: menuArray,
      totalItems: menuItems.length
    });

  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      message: 'Error fetching menu items',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('category', 'name description');

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });

  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      message: 'Error fetching menu item',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   POST /api/menu
// @desc    Create new menu item
// @access  Private (Admin only)
router.post('/', auth, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Item name must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('preparationTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Preparation time must be a non-negative integer'),
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        message: 'Category not found'
      });
    }

    // Check if item name already exists in this category
    const existingItem = await MenuItem.findOne({
      name: new RegExp(`^${req.body.name}$`, 'i'),
      category: req.body.category
    });

    if (existingItem) {
      return res.status(400).json({
        message: 'Menu item with this name already exists in this category'
      });
    }

    const menuItem = new MenuItem(req.body);
    await menuItem.save();

    // Populate category info before returning
    await menuItem.populate('category', 'name description');

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });

  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      message: 'Error creating menu item',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private (Admin only)
router.put('/:id', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Item name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('preparationTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Preparation time must be a non-negative integer'),
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found'
      });
    }

    // If category is being updated, check if it exists
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          message: 'Category not found'
        });
      }
    }

    // If name is being updated, check for duplicates in the same category
    if (req.body.name && req.body.name !== menuItem.name) {
      const categoryId = req.body.category || menuItem.category;
      const existingItem = await MenuItem.findOne({
        name: new RegExp(`^${req.body.name}$`, 'i'),
        category: categoryId,
        _id: { $ne: req.params.id }
      });

      if (existingItem) {
        return res.status(400).json({
          message: 'Menu item with this name already exists in this category'
        });
      }
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        menuItem[key] = req.body[key];
      }
    });

    await menuItem.save();
    await menuItem.populate('category', 'name description');

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });

  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      message: 'Error updating menu item',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found'
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      message: 'Error deleting menu item',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// @route   PATCH /api/menu/:id/availability
// @desc    Toggle menu item availability
// @access  Private (Admin only)
router.patch('/:id/availability', auth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found'
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.json({
      success: true,
      message: `Menu item ${menuItem.isAvailable ? 'enabled' : 'disabled'} successfully`,
      data: { isAvailable: menuItem.isAvailable }
    });

  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      message: 'Error updating menu item availability',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;