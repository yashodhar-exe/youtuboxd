const db = require('../config/db');

exports.createReview = (req, res) => {
  try {
    const { video_id, rating, review_text } = req.body;
    const user_id = req.user.id;

    if (!video_id) {
      return res.status(400).json({ error: 'Video ID is required.' });
    }

    const stmt = db.prepare('INSERT INTO reviews (user_id, video_id, rating, review_text) VALUES (?, ?, ?, ?)');
    const info = stmt.run(user_id, video_id, rating, review_text);

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating review' });
  }
};

exports.getReviewsByYoutubeId = (req, res) => {
  try {
    const { youtubeId } = req.params;
    
    // First find the local video ID
    const video = db.prepare('SELECT id FROM videos WHERE youtube_id = ?').get(youtubeId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found locally.' });
    }

    const reviews = db.prepare(`
      SELECT r.*, u.username, u.avatar_url 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.video_id = ? 
      ORDER BY r.created_at DESC
    `).all(video.id);

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
