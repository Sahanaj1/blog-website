const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username,firstname,lastname, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username,firstname,lastname, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !await bcrypt.compare(password, user.password)) {
    res.status(401).json({ error: 'Invalid credentials' });
  } else {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{ expiresIn: '10h' });

    res.status(200).json({
      username: user.username,
      firstname:user.firstname,
      lastname:user.lastname,
      userId: user._id,
      isPremium:user.isPremium,
      token
    });
  }
};

