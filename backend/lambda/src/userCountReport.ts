import { Handler } from 'aws-lambda';
import mongoose from 'mongoose';
import User from '../../src/models/user.model';

// Environment variables will be set in the Lambda function configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fullstack-app';

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB connected in Lambda function');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Lambda handler function
export const handler: Handler = async (event, context) => {
  // Set context.callbackWaitsForEmptyEventLoop to false to prevent timeout issues with MongoDB connections
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    // Connect to the database
    await connectDB();
    
    // Count total users in the system
    const userCount = await User.countDocuments();
    
    // Get user registrations by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Generate report data
    const report = {
      timestamp: new Date().toISOString(),
      totalUsers: userCount,
      newUsersLast30Days: recentUsers,
      event: event
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify(report)
    };
  } catch (error) {
    console.error('Error generating user count report:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error generating user count report',
        error: String(error)
      })
    };
  }
}; 