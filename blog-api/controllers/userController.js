const User = require('../models/User');
const Post = require('../models/Post');
const cron = require('node-cron');

exports.getUserPosts = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
  } else {
    const posts = await Post.find({ author: userId }).populate('author');
    res.json(posts);
  }
};

exports.subscribeToPremium = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.isPremium) {
    return res.status(400).json({ error: 'User is already premium member' });
  }

  user.subscriptionStart = new Date();

  user.subscriptionEnd = new Date();
  user.subscriptionEnd.setTime(user.subscriptionStart.getTime() + 3 * 24 * 60 * 60 * 1000);

  user.isPremium = true;

  await user.save();

  res.status(200).json({ message: 'Subscribed to premium content', user });
};

exports.getUserDetails = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
  } else {
    res.json(user);
  }
};

async function checkAndUpdatePremiumStatus() {
  const currentTime = new Date();
  const usersToUpdate = await User.find({
    isPremium: true,
    subscriptionEnd: { $lte: currentTime },
  });

  if (usersToUpdate.length > 0) {
    for (const user of usersToUpdate) {
      user.isPremium = false;
      await user.save();
      console.log(` ${user.username} updated to false `);
    }
  }
}


cron.schedule('0 0 */1 * *', async () => {
  console.log('cron job running');
  await checkAndUpdatePremiumStatus();
});



