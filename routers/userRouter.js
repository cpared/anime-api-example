const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/singup', authController.singup);

exports.module = router;
