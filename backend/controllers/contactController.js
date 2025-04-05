const Contact = require('../models/Contact');
const { parseCSV } = require('../utils/csvParser');
const fs = require('fs');

const uploadContacts = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const contacts = await parseCSV(req.file.path);
    console.log(`Parsed ${contacts.length} contacts from CSV`);

    // Insert contacts, skipping duplicates
    const result = await Contact.insertMany(contacts, { ordered: false });
    fs.unlinkSync(req.file.path); // Clean up

    const insertedCount = result.length;
    const skippedCount = contacts.length - insertedCount;

    res.status(200).json({
      message: 'Contacts processed successfully',
      inserted: insertedCount,
      skipped: skippedCount,
    });
  } catch (err) {
    console.error('Error in uploadContacts:', err);
    if (err.name === 'MongoServerError' && err.code === 11000) {
      // Handle duplicate key error
      const existingContacts = await Contact.find({ phone_number: { $in: contacts.map(c => c.phone_number) } });
      const insertedCount = contacts.length - existingContacts.length;
      const skippedCount = existingContacts.length;
      fs.unlinkSync(req.file.path); // Ensure cleanup even on error
      res.status(200).json({
        message: 'Contacts processed with some duplicates skipped',
        inserted: insertedCount,
        skipped: skippedCount,
      });
    } else {
      fs.unlinkSync(req.file.path); // Clean up on other errors
      res.status(500).json({ error: err.message || 'Failed to process upload' });
    }
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error in getContacts:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadContacts, getContacts };