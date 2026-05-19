import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import products from '../data/products.js';

dotenv.config();
await connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      isAdmin: true
    });

    await User.create({
      name: 'Customer User',
      email: 'customer@example.com',
      password: '123456',
      isAdmin: false
    });

    await Product.insertMany(products);
    console.log('Sample users and products imported');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  await destroyData();
} else {
  await importData();
}
