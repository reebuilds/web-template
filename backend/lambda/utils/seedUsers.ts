import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';

// Load environment variables
dotenv.config();

// Test users data
const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  },
];

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fullstack-app';
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Import test users
const importUsers = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Clear existing users if needed
    // await User.deleteMany({});
    // console.log('All users removed');
    
    // Check for existing test users to avoid duplicates
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }
    
    console.log('Test users imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing test users:', error);
    process.exit(1);
  }
};

// Remove test users
const destroyUsers = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Delete only test users by their emails
    const testEmails = testUsers.map(user => user.email);
    const result = await User.deleteMany({ email: { $in: testEmails } });
    
    console.log(`${result.deletedCount} test users removed`);
    process.exit();
  } catch (error) {
    console.error('Error destroying test users:', error);
    process.exit(1);
  }
};

// Process command line arguments
const runSeeder = (): void => {
  if (process.argv[2] === '-d') {
    destroyUsers();
  } else {
    importUsers();
  }
};

// Execute seeder
runSeeder(); 