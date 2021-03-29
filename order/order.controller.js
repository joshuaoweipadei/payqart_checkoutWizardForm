const express = require('express');
const router = express.Router();

// Define routes
router.post('/order', order);

module.exports = router;

async function order(req, res) {
  console.log(req.body)
  return res.status(200).json({ message: "User's orders was saved successfully" });
}