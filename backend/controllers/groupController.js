import Group from '../models/Group.js';
import User from '../models/User.js';

// @desc    Join group with code
// @route   POST /api/groups/join
// @access  Private
const joinGroup = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Group code is required'
      });
    }

    // Find group by code
    const group = await Group.findOne({ code: code.toUpperCase() });
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found with this code'
      });
    }

    // Check if user is already in a group
    const user = await User.findById(userId);
    if (user.groupId) {
      return res.status(400).json({
        success: false,
        message: 'You are already in a group'
      });
    }

    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Group is full (max 5 members)'
      });
    }

    // Check if user is already a member
    const isAlreadyMember = group.members.some(member => 
      member.userId.toString() === userId
    );
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group'
      });
    }

    // Add user to group
    group.members.push({ userId });
    await group.save();

    // Update user's groupId
    user.groupId = group._id;
    await user.save();

    // Populate group details
    const populatedGroup = await Group.findById(group._id)
      .populate('members.userId', 'name avatar description phone')
      .populate('representativeId', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Successfully joined the group!',
      group: populatedGroup
    });

  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining group',
      error: error.message
    });
  }
};

// @desc    Get group details
// @route   GET /api/groups/my-group
// @access  Private
const getMyGroup = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('groupId');
    if (!user.groupId) {
      return res.status(404).json({
        success: false,
        message: 'You are not in any group'
      });
    }

    const group = await Group.findById(user.groupId)
      .populate('members.userId', 'name avatar description phone role')
      .populate('representativeId', 'name avatar');

    res.status(200).json({
      success: true,
      group
    });

  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching group details',
      error: error.message
    });
  }
};

// @desc    Get group by code (for joining)
// @route   GET /api/groups/code/:code
// @access  Private
const getGroupByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const group = await Group.findOne({ code: code.toUpperCase() })
      .populate('members.userId', 'name avatar')
      .populate('representativeId', 'name avatar');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Return basic group info (without sensitive data)
    res.status(200).json({
      success: true,
      group: {
        id: group._id,
        name: group.name,
        code: group.code,
        memberCount: group.members.length,
        maxMembers: group.maxMembers,
        representative: group.representativeId
      }
    });

  } catch (error) {
    console.error('Get group by code error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching group',
      error: error.message
    });
  }
};

export {
  joinGroup,
  getMyGroup,
  getGroupByCode
};