const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Admin:restaurant123@cluster0.ak5weiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected for seeding');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'restaurant123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✓ Admin user created');

    // Create categories
    const categories = [
      {
        name: 'Appetizers',
        description: 'Start your meal with our delicious appetizers',
        order: 1
      },
      {
        name: 'Main Courses',
        description: 'Our signature main dishes',
        order: 2
      },
      {
        name: 'Desserts',
        description: 'Sweet endings to your meal',
        order: 3
      },
      {
        name: 'Beverages',
        description: 'Refreshing drinks and beverages',
        order: 4
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('✓ Categories created');

    // Get category IDs for menu items
    const appetizers = createdCategories.find(cat => cat.name === 'Appetizers')._id;
    const mains = createdCategories.find(cat => cat.name === 'Main Courses')._id;
    const desserts = createdCategories.find(cat => cat.name === 'Desserts')._id;
    const beverages = createdCategories.find(cat => cat.name === 'Beverages')._id;

    // Create menu items
    const menuItems = [
      // Appetizers
      {
        name: 'Bruschetta Trio',
        description: 'Three slices of toasted ciabatta topped with fresh tomatoes, basil, and mozzarella cheese',
        price: 12.99,
        category: appetizers,
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
        preparationTime: 10,
        ingredients: ['Ciabatta bread', 'Tomatoes', 'Fresh basil', 'Mozzarella', 'Olive oil', 'Garlic'],
        allergens: ['gluten', 'dairy'],
        order: 1
      },
      {
        name: 'Calamari Fritti',
        description: 'Crispy fried squid rings served with marinara sauce and lemon wedges',
        price: 14.99,
        category: appetizers,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
        preparationTime: 15,
        ingredients: ['Fresh squid', 'Flour', 'Marinara sauce', 'Lemon', 'Parsley'],
        allergens: ['seafood', 'gluten'],
        order: 2
      },
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan cheese, croutons, and our signature caesar dressing',
        price: 10.99,
        category: appetizers,
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
        preparationTime: 8,
        ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing'],
        allergens: ['dairy', 'eggs', 'gluten'],
        order: 3
      },

      // Main Courses
      {
        name: 'Ribeye Steak',
        description: '12oz premium ribeye steak grilled to perfection, served with garlic mashed potatoes and seasonal vegetables',
        price: 32.99,
        category: mains,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        preparationTime: 25,
        ingredients: ['Ribeye steak', 'Potatoes', 'Garlic', 'Butter', 'Seasonal vegetables'],
        allergens: ['dairy'],
        nutritionalInfo: {
          calories: 650,
          protein: 55,
          carbs: 25,
          fat: 38
        },
        order: 1
      },
      {
        name: 'Salmon Piccata',
        description: 'Pan-seared Atlantic salmon with lemon caper sauce, served over creamy risotto',
        price: 28.99,
        category: mains,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
        preparationTime: 20,
        ingredients: ['Atlantic salmon', 'Arborio rice', 'Capers', 'Lemon', 'White wine', 'Parmesan'],
        allergens: ['seafood', 'dairy'],
        nutritionalInfo: {
          calories: 580,
          protein: 42,
          carbs: 35,
          fat: 28
        },
        order: 2
      },
      {
        name: 'Chicken Parmesan',
        description: 'Breaded chicken breast topped with marinara sauce and melted mozzarella, served with spaghetti',
        price: 24.99,
        category: mains,
        image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop',
        preparationTime: 22,
        ingredients: ['Chicken breast', 'Breadcrumbs', 'Marinara sauce', 'Mozzarella', 'Spaghetti', 'Parmesan'],
        allergens: ['gluten', 'dairy', 'eggs'],
        order: 3
      },
      {
        name: 'Vegetable Curry',
        description: 'Mixed seasonal vegetables in a rich coconut curry sauce, served with basmati rice',
        price: 19.99,
        category: mains,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        preparationTime: 18,
        ingredients: ['Mixed vegetables', 'Coconut milk', 'Curry spices', 'Basmati rice', 'Cilantro'],
        allergens: [],
        nutritionalInfo: {
          calories: 420,
          protein: 12,
          carbs: 65,
          fat: 18
        },
        order: 4
      },

      // Desserts
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers, mascarpone cheese, and cocoa powder',
        price: 8.99,
        category: desserts,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
        preparationTime: 5,
        ingredients: ['Ladyfingers', 'Mascarpone', 'Coffee', 'Cocoa powder', 'Sugar', 'Eggs'],
        allergens: ['gluten', 'dairy', 'eggs'],
        order: 1
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
        price: 9.99,
        category: desserts,
        image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=400&h=300&fit=crop',
        preparationTime: 12,
        ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla ice cream'],
        allergens: ['gluten', 'dairy', 'eggs'],
        order: 2
      },
      {
        name: 'Cheesecake',
        description: 'New York style cheesecake with graham cracker crust and fresh berry compote',
        price: 7.99,
        category: desserts,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
        preparationTime: 5,
        ingredients: ['Cream cheese', 'Graham crackers', 'Mixed berries', 'Sugar', 'Eggs'],
        allergens: ['gluten', 'dairy', 'eggs'],
        order: 3
      },

      // Beverages
      {
        name: 'House Wine',
        description: 'Red or white wine by the glass - ask your server for today\'s selection',
        price: 9.99,
        category: beverages,
        image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=300&fit=crop',
        preparationTime: 2,
        order: 1
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice served chilled',
        price: 4.99,
        category: beverages,
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop',
        preparationTime: 3,
        ingredients: ['Fresh oranges'],
        allergens: [],
        order: 2
      },
      {
        name: 'Espresso',
        description: 'Rich Italian espresso made from premium coffee beans',
        price: 3.99,
        category: beverages,
        image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e76?w=400&h=300&fit=crop',
        preparationTime: 3,
        ingredients: ['Coffee beans'],
        allergens: [],
        order: 3
      },
      {
        name: 'Artisan Cocktail',
        description: 'Ask your server about our rotating selection of craft cocktails',
        price: 12.99,
        category: beverages,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
        preparationTime: 5,
        order: 4
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('✓ Menu items created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'restaurant123'}`);
    console.log('\n📊 Data summary:');
    console.log(`   Users: 1`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Menu Items: ${menuItems.length}`);

  } catch (error) {
    console.error('✗ Error seeding database:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
  mongoose.disconnect();
  console.log('\n✓ Database connection closed');
  process.exit(0);
};

runSeed();