/* global process */
import User from '../models/User.js';
import Group from '../models/Group.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Add this import
import { generateGroupCode } from '../utils/generateCode.js';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, description, avatar, role } = req.body;

    console.log('Registration attempt:', { name, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
      // Hash password manually
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
    password: hashedPassword, // Use hashed password
      phone,
      description,
      avatar,
      role: role || 'roommate'
    });

    console.log('User created:', user._id);

    // If user is representative, create a group
    let group = null;
    if (user.role === 'representative') {
      let uniqueCode;
      let codeExists = true;
      
      // Generate unique group code
      while (codeExists) {
        uniqueCode = generateGroupCode();
        const existingGroup = await Group.findOne({ code: uniqueCode });
        if (!existingGroup) {
          codeExists = false;
        }
      }

      console.log('Creating group with code:', uniqueCode);

      group = await Group.create({
        name: `${user.name}'s Group`,
        code: uniqueCode,
        representativeId: user._id,
        members: [{ userId: user._id }]
      });

      // Add groupId to user
      user.groupId = group._id;
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        description: user.description,
        role: user.role,
        groupId: user.groupId
      },
      group: group ? {
        id: group._id,
        name: group.name,
        code: group.code
      } : null
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in user registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user - add better error handling
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Login successful for:', email);

    // Get group details if user has a group
    let group = null;
    if (user.groupId) {
      group = await Group.findById(user.groupId);
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        description: user.description,
        role: user.role,
        groupId: user.groupId
      },
      group: group ? {
        id: group._id,
        name: group.name,
        code: group.code
      } : null
    });

  } catch (error) {
    console.error('Login error details:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoNetworkError' || error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please try again.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error in user login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let group = null;
    if (user.groupId) {
      group = await Group.findById(user.groupId).populate('members.userId', 'name avatar');
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        description: user.description,
        role: user.role,
        groupId: user.groupId
      },
      group: group ? {
        id: group._id,
        name: group.name,
        code: group.code,
        members: group.members
      } : null
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};

export {
  register,
  login,
  getMe
};