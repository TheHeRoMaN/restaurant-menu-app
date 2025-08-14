const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant-menu', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('âœ“ MongoDB connected for seeding');
  } catch (error) {
    console.error('âœ— MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('ðŸŒ± Starting database seeding for East Gate Restaurant...');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    console.log('âœ“ Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'restaurant123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('âœ“ Admin user created');

    // Create categories for East Gate Restaurant
    const categories = [
      {
        name: 'Appetizers & Starters',
        description: 'Fresh and flavorful beginnings to your meal',
        order: 1
      },
      {
        name: 'Soups & Salads',
        description: 'Healthy and hearty options',
        order: 2
      },
      {
        name: 'Main Courses',
        description: 'Our signature dishes and hearty meals',
        order: 3
      },
      {
        name: 'Seafood Specialties',
        description: 'Fresh catches prepared to perfection',
        order: 4
      },
      {
        name: 'Grills & BBQ',
        description: 'Flame-grilled perfection',
        order: 5
      },
      {
        name: 'Asian Fusion',
        description: 'East meets West culinary delights',
        order: 6
      },
      {
        name: 'Desserts',
        description: 'Sweet endings to your dining experience',
        order: 7
      },
      {
        name: 'Beverages',
        description: 'Refreshing drinks and specialty beverages',
        order: 8
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('âœ“ Categories created');

    // Get category IDs
    const appetizers = createdCategories.find(cat => cat.name === 'Appetizers & Starters')._id;
    const soupsalads = createdCategories.find(cat => cat.name === 'Soups & Salads')._id;
    const mains = createdCategories.find(cat => cat.name === 'Main Courses')._id;
    const seafood = createdCategories.find(cat => cat.name === 'Seafood Specialties')._id;
    const grills = createdCategories.find(cat => cat.name === 'Grills & BBQ')._id;
    const asian = createdCategories.find(cat => cat.name === 'Asian Fusion')._id;
    const desserts = createdCategories.find(cat => cat.name === 'Desserts')._id;
    const beverages = createdCategories.find(cat => cat.name === 'Beverages')._id;

    // Create comprehensive menu items for East Gate Restaurant
    const menuItems = [
      // Appetizers & Starters
      {
        name: 'East Gate Spring Rolls',
        description: 'Crispy golden spring rolls filled with fresh vegetables and herbs, served with sweet and sour dipping sauce',
        price: 8.99,
        category: appetizers,
        image: 'REPLACE_WITH_YOUR_SPRING_ROLL_IMAGE_URL',
        preparationTime: 8,
        ingredients: ['Spring roll wrappers', 'Cabbage', 'Carrots', 'Bean sprouts', 'Herbs'],
        allergens: ['gluten'],
        order: 1
      },
      {
        name: 'Loaded Potato Skins',
        description: 'Crispy potato skins loaded with melted cheese, bacon bits, and green onions, served with sour cream',
        price: 12.99,
        category: appetizers,
        image: 'REPLACE_WITH_YOUR_POTATO_SKINS_IMAGE_URL',
        preparationTime: 12,
        ingredients: ['Potatoes', 'Cheddar cheese', 'Bacon', 'Green onions', 'Sour cream'],
        allergens: ['dairy'],
        order: 2
      },
      {
        name: 'Buffalo Chicken Wings',
        description: 'Spicy buffalo wings served with celery sticks and blue cheese dressing',
        price: 14.99,
        category: appetizers,
        image: 'REPLACE_WITH_YOUR_WINGS_IMAGE_URL',
        preparationTime: 15,
        ingredients: ['Chicken wings', 'Buffalo sauce', 'Celery', 'Blue cheese'],
        allergens: ['dairy'],
        order: 3
      },
      {
        name: 'Calamari Rings',
        description: 'Golden fried squid rings with a crispy coating, served with marinara sauce and lemon',
        price: 13.99,
        category: appetizers,
        image: 'REPLACE_WITH_YOUR_CALAMARI_IMAGE_URL',
        preparationTime: 10,
        ingredients: ['Fresh squid', 'Flour coating', 'Marinara sauce', 'Lemon'],
        allergens: ['seafood', 'gluten'],
        order: 4
      },

      // Soups & Salads
      {
        name: 'East Gate Garden Salad',
        description: 'Mixed greens with cherry tomatoes, cucumbers, red onions, and your choice of dressing',
        price: 9.99,
        category: soupsalads,
        image: 'REPLACE_WITH_YOUR_GARDEN_SALAD_IMAGE_URL',
        preparationTime: 5,
        ingredients: ['Mixed lettuce', 'Cherry tomatoes', 'Cucumbers', 'Red onions'],
        allergens: [],
        nutritionalInfo: {
          calories: 120,
          protein: 3,
          carbs: 8,
          fat: 9
        },
        order: 1
      },
      {
        name: 'Tom Yum Soup',
        description: 'Spicy and sour Thai soup with shrimp, mushrooms, and aromatic herbs',
        price: 11.99,
        category: soupsalads,
        image: 'REPLACE_WITH_YOUR_TOM_YUM_IMAGE_URL',
        preparationTime: 12,
        ingredients: ['Shrimp', 'Mushrooms', 'Lemongrass', 'Lime leaves', 'Chili'],
        allergens: ['seafood'],
        order: 2
      },
      {
        name: 'Caesar Salad with Grilled Chicken',
        description: 'Crisp romaine lettuce with parmesan, croutons, and tender grilled chicken breast',
        price: 15.99,
        category: soupsalads,
        image: 'REPLACE_WITH_YOUR_CAESAR_SALAD_IMAGE_URL',
        preparationTime: 8,
        ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Grilled chicken'],
        allergens: ['dairy', 'gluten', 'eggs'],
        order: 3
      },

      // Main Courses
      {
        name: 'East Gate Signature Burger',
        description: 'Juicy beef patty with lettuce, tomato, onion, pickles, and our special sauce on a brioche bun',
        price: 16.99,
        category: mains,
        image: 'REPLACE_WITH_YOUR_BURGER_IMAGE_URL',
        preparationTime: 15,
        ingredients: ['Beef patty', 'Brioche bun', 'Lettuce', 'Tomato', 'Onion', 'Pickles'],
        allergens: ['gluten', 'eggs', 'dairy'],
        order: 1
      },
      {
        name: 'Chicken Parmesan',
        description: 'Breaded chicken breast topped with marinara sauce and melted mozzarella, served with pasta',
        price: 22.99,
        category: mains,
        image: 'REPLACE_WITH_YOUR_CHICKEN_PARM_IMAGE_URL',
        preparationTime: 20,
        ingredients: ['Chicken breast', 'Breadcrumbs', 'Marinara sauce', 'Mozzarella', 'Pasta'],
        allergens: ['gluten', 'dairy', 'eggs'],
        order: 2
      },
      {
        name: 'Beef Stroganoff',
        description: 'Tender beef strips in creamy mushroom sauce served over egg noodles',
        price: 24.99,
        category: mains,
        image: 'REPLACE_WITH_YOUR_STROGANOFF_IMAGE_URL',
        preparationTime: 25,
        ingredients: ['Beef strips', 'Mushrooms', 'Cream sauce', 'Egg noodles', 'Onions'],
        allergens: ['dairy', 'gluten', 'eggs'],
        order: 3
      },

      // Seafood Specialties
      {
        name: 'Grilled Salmon Teriyaki',
        description: 'Fresh Atlantic salmon glazed with teriyaki sauce, served with steamed vegetables and rice',
        price: 26.99,
        category: seafood,
        image: 'REPLACE_WITH_YOUR_SALMON_IMAGE_URL',
        preparationTime: 18,
        ingredients: ['Atlantic salmon', 'Teriyaki sauce', 'Steamed vegetables', 'Jasmine rice'],
        allergens: ['seafood', 'soy'],
        nutritionalInfo: {
          calories: 520,
          protein: 42,
          carbs: 38,
          fat: 22
        },
        order: 1
      },
      {
        name: 'Fish and Chips',
        description: 'Beer-battered cod fillets with golden fries and mushy peas, served with tartar sauce',
        price: 19.99,
        category: seafood,
        image: 'REPLACE_WITH_YOUR_FISH_CHIPS_IMAGE_URL',
        preparationTime: 16,
        ingredients: ['Cod fillets', 'Beer batter', 'Potatoes', 'Mushy peas', 'Tartar sauce'],
        allergens: ['seafood', 'gluten', 'eggs'],
        order: 2
      },
      {
        name: 'Seafood Paella',
        description: 'Traditional Spanish rice dish with shrimp, mussels, calamari, and saffron',
        price: 28.99,
        category: seafood,
        image: 'REPLACE_WITH_YOUR_PAELLA_IMAGE_URL',
        preparationTime: 30,
        ingredients: ['Bomba rice', 'Shrimp', 'Mussels', 'Calamari', 'Saffron', 'Bell peppers'],
        allergens: ['seafood'],
        order: 3
      },

      // Grills & BBQ
      {
        name: 'East Gate Ribeye Steak',
        description: '12oz premium ribeye steak grilled to perfection, served with garlic mashed potatoes',
        price: 32.99,
        category: grills,
        image: 'REPLACE_WITH_YOUR_RIBEYE_IMAGE_URL',
        preparationTime: 20,
        ingredients: ['Ribeye steak', 'Garlic', 'Potatoes', 'Butter', 'Herbs'],
        allergens: ['dairy'],
        order: 1
      },
      {
        name: 'BBQ Pork Ribs',
        description: 'Slow-cooked pork ribs with our signature BBQ sauce, served with coleslaw and baked beans',
        price: 25.99,
        category: grills,
        image: 'REPLACE_WITH_YOUR_RIBS_IMAGE_URL',
        preparationTime: 25,
        ingredients: ['Pork ribs', 'BBQ sauce', 'Coleslaw', 'Baked beans'],
        allergens: [],
        order: 2
      },
      {
        name: 'Grilled Chicken Breast',
        description: 'Herb-marinated chicken breast with roasted vegetables and wild rice',
        price: 21.99,
        category: grills,
        image: 'REPLACE_WITH_YOUR_GRILLED_CHICKEN_IMAGE_URL',
        preparationTime: 18,
        ingredients: ['Chicken breast', 'Mixed herbs', 'Roasted vegetables', 'Wild rice'],
        allergens: [],
        order: 3
      },

      // Asian Fusion
      {
        name: 'Pad Thai',
        description: 'Traditional Thai stir-fried noodles with shrimp, bean sprouts, and peanuts',
        price: 17.99,
        category: asian,
        image: 'REPLACE_WITH_YOUR_PAD_THAI_IMAGE_URL',
        preparationTime: 12,
        ingredients: ['Rice noodles', 'Shrimp', 'Bean sprouts', 'Peanuts', 'Tamarind sauce'],
        allergens: ['seafood', 'nuts'],
        order: 1
      },
      {
        name: 'General Tso\'s Chicken',
        description: 'Crispy chicken pieces in sweet and spicy sauce, served with steamed rice',
        price: 18.99,
        category: asian,
        image: 'REPLACE_WITH_YOUR_GENERAL_TSO_IMAGE_URL',
        preparationTime: 15,
        ingredients: ['Chicken pieces', 'Sweet chili sauce', 'Steamed rice', 'Broccoli'],
        allergens: ['gluten', 'soy'],
        order: 2
      },
      {
        name: 'Beef Lo Mein',
        description: 'Soft egg noodles stir-fried with tender beef and mixed vegetables',
        price: 19.99,
        category: asian,
        image: 'REPLACE_WITH_YOUR_LO_MEIN_IMAGE_URL',
        preparationTime: 13,
        ingredients: ['Egg noodles', 'Beef strips', 'Mixed vegetables', 'Soy sauce'],
        allergens: ['gluten', 'eggs', 'soy'],
        order: 3
      },

      // Desserts
      {
        name: 'East Gate Cheesecake',
        description: 'Rich and creamy New York style cheesecake with fresh berry compote',
        price: 8.99,
        category: desserts,
        image: 'REPLACE_WITH_YOUR_CHEESECAKE_IMAGE_URL',
        preparationTime: 5,
        ingredients: ['Cream cheese', 'Graham cracker crust', 'Fresh berries', 'Sugar'],
        allergens: ['dairy', 'gluten', 'eggs'],
        order: 1
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 9.99,
        category: desserts,
        image: 'REPLACE_WITH_YOUR_LAVA_CAKE_IMAGE_URL',
        preparationTime: 12,
        ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Flour', 'Vanilla ice cream'],
        allergens: ['dairy', 'gluten', 'eggs'],
        order: 2
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
        price: 8.99,
        category: desserts,
        image: 'REPLACE_WITH_YOUR_TIRAMISU_IMAGE_URL',
        preparationTime: 5,
        ingredients: ['Ladyfingers', 'Mascarpone', 'Coffee', 'Cocoa powder'],
        allergens: ['dairy', 'gluten', 'eggs'],
        order: 3
      },

      // Beverages
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice served chilled',
        price: 4.99,
        category: beverages,
        image: 'REPLACE_WITH_YOUR_ORANGE_JUICE_IMAGE_URL',
        preparationTime: 2,
        ingredients: ['Fresh oranges'],
        allergens: [],
        order: 1
      },
      {
        name: 'East Gate Signature Cocktail',
        description: 'House special cocktail with premium spirits and fresh fruit garnish',
        price: 12.99,
        category: beverages,
        image: 'REPLACE_WITH_YOUR_COCKTAIL_IMAGE_URL',
        preparationTime: 5,
        ingredients: ['Premium spirits', 'Fresh fruit', 'Mixers'],
        allergens: [],
        order: 2
      },
      {
        name: 'Iced Coffee',
        description: 'Cold brew coffee served over ice with your choice of milk',
        price: 5.99,
        category: beverages,
        image: 'REPLACE_WITH_YOUR_ICED_COFFEE_IMAGE_URL',
        preparationTime: 3,
        ingredients: ['Cold brew coffee', 'Ice', 'Milk'],
        allergens: ['dairy'],
        order: 3
      },
      {
        name: 'Green Tea',
        description: 'Premium loose leaf green tea served hot',
        price: 3.99,
        category: beverages,
        image: 'REPLACE_WITH_YOUR_GREEN_TEA_IMAGE_URL',
        preparationTime: 4,
        ingredients: ['Green tea leaves', 'Hot water'],
        allergens: [],
        order: 4
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('âœ“ Menu items created');

    console.log('\nðŸŽ‰ Database seeding completed successfully!');
    console.log('\nðŸ“ Login credentials:');
    console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'restaurant123'}`);
    console.log('\nðŸ“Š Data summary:');
    console.log(`   Users: 1`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Menu Items: ${menuItems.length}`);
    console.log('\nðŸ“¸ Next steps:');
    console.log('   1. Replace image URLs in this file with your actual Google image links');
    console.log('   2. Run the seed script again to update with real images');
    console.log('   3. Your East Gate Restaurant menu is ready!');

  } catch (error) {
    console.error('âœ— Error seeding database:', error);
  }
};
