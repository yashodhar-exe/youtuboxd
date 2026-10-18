const db = require('../config/db');
const youtubeService = require('../services/youtube.service');

exports.importVideo = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required.' });
    }

    const youtubeId = youtubeService.extractVideoId(url);
    if (!youtubeId) {
      return res.status(400).json({ error: 'Invalid YouTube URL.' });
    }

    // Check if it already exists in DB
    const existingVideo = db.prepare('SELECT * FROM videos WHERE youtube_id = ?').get(youtubeId);
    if (existingVideo) {
      if (!existingVideo.ai_summary || existingVideo.ai_summary === 'Summary not available.') {
        existingVideo.ai_summary = await youtubeService.generateVideoSummary(existingVideo.title, existingVideo.description);
        db.prepare('UPDATE videos SET ai_summary = ? WHERE id = ?').run(existingVideo.ai_summary, existingVideo.id);
      }
      return res.json(existingVideo);
    }

    // Fetch from YouTube
    const ytData = await youtubeService.fetchYouTubeVideoData(youtubeId);

    // Save to DB
    const stmt = db.prepare(`
      INSERT INTO videos (
        youtube_id, title, description, thumbnail_url, channel_title, channel_id, 
        published_at, duration, view_count, like_count, comment_count, tags, category, language, ai_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      ytData.youtube_id, ytData.title, ytData.description, ytData.thumbnail_url,
      ytData.channel_title, ytData.channel_id, ytData.published_at, ytData.duration,
      ytData.view_count, ytData.like_count, ytData.comment_count, ytData.tags, 
      ytData.category, ytData.language, ytData.ai_summary
    );

    const newVideo = db.prepare('SELECT * FROM videos WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newVideo);

  } catch (error) {
    console.error(error);
    if (error.message === 'Video not found on YouTube') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error while importing video' });
  }
};

exports.getVideoByYoutubeId = async (req, res) => {
  try {
    const { youtubeId } = req.params;
    let video = db.prepare('SELECT * FROM videos WHERE youtube_id = ?').get(youtubeId);
    
    if (!video) {
      // Auto-import from YouTube if it doesn't exist locally
      try {
        const ytData = await youtubeService.fetchYouTubeVideoData(youtubeId);
        const stmt = db.prepare(`
          INSERT INTO videos (
            youtube_id, title, description, thumbnail_url, channel_title, channel_id, 
            published_at, duration, view_count, like_count, comment_count, tags, category, language, ai_summary
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(
          ytData.youtube_id, ytData.title, ytData.description, ytData.thumbnail_url,
          ytData.channel_title, ytData.channel_id, ytData.published_at, ytData.duration,
          ytData.view_count, ytData.like_count, ytData.comment_count, ytData.tags, 
          ytData.category, ytData.language, ytData.ai_summary
        );
        video = db.prepare('SELECT * FROM videos WHERE id = ?').get(info.lastInsertRowid);
      } catch (ytError) {
        console.error('Auto-import failed:', ytError);
        return res.status(404).json({ error: 'Video not found on YouTube or local DB.' });
      }
    } else {
      // If it exists locally but lacks ai_summary, generate and update
      if (!video.ai_summary || video.ai_summary === 'Summary not available.') {
        video.ai_summary = await youtubeService.generateVideoSummary(video.title, video.description);
        db.prepare('UPDATE videos SET ai_summary = ? WHERE id = ?').run(video.ai_summary, video.id);
      }
    }

    // Fetch ratings from Youtuboxd (reviews & diary)
    const ratingsData = db.prepare(`
      SELECT rating, COUNT(*) as count 
      FROM (
        SELECT user_id, rating FROM reviews WHERE video_id = ? AND rating IS NOT NULL
        UNION
        SELECT user_id, rating FROM diary WHERE video_id = ? AND rating IS NOT NULL
      ) GROUP BY rating
    `).all(video.id, video.id);

    let totalRatings = 0;
    let sumRatings = 0;
    const distribution = {
      '0.5': 0, '1.0': 0, '1.5': 0, '2.0': 0, '2.5': 0,
      '3.0': 0, '3.5': 0, '4.0': 0, '4.5': 0, '5.0': 0
    };

    ratingsData.forEach(r => {
      const ratingStr = r.rating.toFixed(1);
      if (distribution[ratingStr] !== undefined) {
        distribution[ratingStr] = r.count;
        totalRatings += r.count;
        sumRatings += r.rating * r.count;
      }
    });

    video.youtuboxd_ratings = {
      average: totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : '0.0',
      count: totalRatings,
      distribution
    };

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.searchVideos = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    
    // Search directly from YouTube via the service
    const videos = await youtubeService.searchYouTubeVideos(q);
    
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while searching YouTube' });
  }
};

exports.getTopVideos = async (req, res) => {
  try {
    const videos = await youtubeService.fetchTopYouTubeVideos();
    res.json(videos);
  } catch (error) {
    console.error('Error fetching top videos:', error);
    res.status(500).json({ error: 'Server error fetching top videos' });
  }
};
