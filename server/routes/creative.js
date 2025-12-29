import express from 'express';
import CreativeEntry from '../models/CreativeEntry.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @route   POST /api/creative/save
// @desc    Save a drawing or note
// @access  Private
router.post('/save', protect, async (req, res) => {
  const { type, content, title } = req.body;

  try {
    const newEntry = await CreativeEntry.create({
      user: req.user._id,
      type,
      content,
      title: title || 'Untitled'
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/creative/list
// @desc    Get all saved items for the user
// @access  Private
router.get('/list', protect, async (req, res) => {
  try {
    const entries = await CreativeEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/creative/:id
// @desc    Delete an entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const entry = await CreativeEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Check user
        if (entry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await entry.deleteOne();
        res.json({ message: 'Entry removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
