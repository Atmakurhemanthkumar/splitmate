import User from '../models/User.js';
import Group from '../models/Group.js'; // Add this import
import { generateGroupCode } from '../utils/generateCode.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, description, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, description, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/update-role
// @access  Private
const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id;

    // Validate role
    if (!['representative', 'roommate'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either representative or roommate'
      });
    }

    const user = await User.findById(userId);
    
    // Check if user already has the requested role
    if (user.role === role) {
      return res.status(400).json({
        success: false,
        message: `User already has the role: ${role}`
      });
    }

    let group = null;

    // If changing to representative and no group exists, create one
    if (role === 'representative' && !user.groupId) {
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

      group = await Group.create({
        name: `${user.name}'s Group`,
        code: uniqueCode,
        representativeId: user._id,
        members: [{ userId: user._id }]
      });

      // Update user role and groupId
      user.role = role;
      user.groupId = group._id;
      await user.save();
    } else {
      // Just update the role
      user.role = role;
      await user.save();
    }

    // Populate user data
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('groupId');

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      user: updatedUser,
      group: group ? {
        id: group._id,
        name: group.name,
        code: group.code
      } : null
    });

  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
};

export {
  getProfile,
  updateProfile,
  updateRole // Add this export
};