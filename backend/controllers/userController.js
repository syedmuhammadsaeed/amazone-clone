import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error('Admin accounts cannot be deleted from the dashboard');
  }

  await user.deleteOne();
  res.json({ message: 'Customer account deleted' });
});

export { getUsers, deleteUser };
