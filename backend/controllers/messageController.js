const Message = require('../models/Message');

const createMessage = async (req, res) => {
  const { contact_id, template_id } = req.body;
  if (!contact_id || !template_id) return res.status(400).json({ error: 'Contact ID and Template ID are required' });

  try {
    const message = new Message({ contact_id, template_id, mobile_id: 'unknown' }); // Default mobile_id
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('contact_id', 'name phone_number')
      .populate('template_id', 'content');
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPendingMessages = async (req, res) => {
  try {
    const messages = await Message.find({ status: 'Pending' })
      .populate('contact_id', 'phone_number')
      .populate('template_id', 'content');
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMessageStatus = async (req, res) => {
  const { status, mobile_id } = req.body;
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status, mobile_id, datetime: new Date() },
      { new: true }
    ).populate('contact_id', 'phone_number').populate('template_id', 'content');
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createMessage, getMessages, getPendingMessages, updateMessageStatus };