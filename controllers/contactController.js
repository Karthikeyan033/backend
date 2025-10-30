const Contact = require('../models/Contact');

// @desc    Create new contact message
// @route   POST /api/contacts
// @access  Public
exports.createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};
