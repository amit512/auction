import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Auction from './src/models/Auction.js';
import User from './src/models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Auction.deleteMany({});
    await User.deleteMany({});

    // Create a test user
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    await testUser.save();
    console.log('✅ Test user created');

    // Create sample auctions
    const sampleAuctions = [
      {
        title: 'Vintage Rolex Submariner',
        subtitle: 'Classic diving watch in excellent condition',
        description: 'A beautiful vintage Rolex Submariner from 1970s. This timepiece features the iconic black dial and bezel, automatic movement, and comes with original box and papers. Perfect for collectors.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        startingPrice: 5000,
        currentBid: 5000,
        category: 'Collectibles',
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        seller: testUser._id,
        condition: 'good',
        location: 'New York, NY'
      },
      {
        title: 'Antique Persian Rug',
        subtitle: 'Hand-woven silk carpet from 1920s',
        description: 'Stunning antique Persian rug made from pure silk. Features intricate floral patterns in deep reds and blues. Measures 8x10 feet. Perfect centerpiece for any room.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
        startingPrice: 2500,
        currentBid: 2500,
        category: 'Art',
        endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        seller: testUser._id,
        condition: 'good',
        location: 'Los Angeles, CA'
      },
      {
        title: 'MacBook Pro M2',
        subtitle: 'Latest generation laptop, barely used',
        description: 'MacBook Pro 14-inch with M2 chip, 16GB RAM, 512GB SSD. Purchased 3 months ago, still under warranty. Comes with original charger and box.',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
        startingPrice: 1500,
        currentBid: 1500,
        category: 'Electronics',
        endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        seller: testUser._id,
        condition: 'like-new',
        location: 'San Francisco, CA'
      },
      {
        title: 'Vincent van Gogh Print',
        subtitle: 'High-quality reproduction of Starry Night',
        description: 'Beautiful museum-quality reproduction of Van Gogh\'s Starry Night. Printed on premium canvas with archival inks. Framed in elegant wooden frame.',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1000&auto=format&fit=crop',
        startingPrice: 200,
        currentBid: 200,
        category: 'Art',
        endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        seller: testUser._id,
        condition: 'new',
        location: 'Chicago, IL'
      },
      {
        title: 'Vintage Gibson Guitar',
        subtitle: '1960s acoustic guitar in perfect condition',
        description: 'Rare 1960s Gibson J-45 acoustic guitar. All original parts, excellent sound quality. Comes with hard case. A must-have for guitar collectors.',
        image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=1000&auto=format&fit=crop',
        startingPrice: 3000,
        currentBid: 3000,
        category: 'Collectibles',
        endsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        seller: testUser._id,
        condition: 'good',
        location: 'Nashville, TN'
      },
      {
        title: 'Designer Handbag',
        subtitle: 'Authentic Louis Vuitton Neverfull',
        description: 'Authentic Louis Vuitton Neverfull MM handbag in monogram canvas. Purchased from official store, comes with authenticity card and dust bag.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
        startingPrice: 800,
        currentBid: 800,
        category: 'Fashion',
        endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        seller: testUser._id,
        condition: 'like-new',
        location: 'Miami, FL'
      }
    ];

    for (const auctionData of sampleAuctions) {
      const auction = new Auction(auctionData);
      await auction.save();
    }

    console.log('✅ Sample auctions created');
    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Test credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
