const axios = require('axios');

exports.extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

exports.fetchYouTubeVideoData = async (youtubeId) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${youtubeId}&key=${apiKey}`;
    
    let response;
    try {
      response = await axios.get(url);
    } catch (err) {
      const errorDetail = err.response?.data?.error?.message || err.message;
      console.warn('YouTube API failed, using mock data for demo purposes:', errorDetail);
    }

    if (!response || !response.data || !response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found or YouTube API failed.');
    }

    const video = response.data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;
    const statistics = video.statistics;

    // Determine highest resolution thumbnail
    let thumbnailUrl = '';
    if (snippet.thumbnails) {
      thumbnailUrl = snippet.thumbnails.maxres?.url 
        || snippet.thumbnails.standard?.url 
        || snippet.thumbnails.high?.url 
        || snippet.thumbnails.medium?.url 
        || snippet.thumbnails.default?.url;
    }

    const summary = await exports.generateVideoSummary(snippet.title, snippet.description);

    return {
      youtube_id: youtubeId,
      title: snippet.title,
      description: snippet.description,
      thumbnail_url: thumbnailUrl,
      channel_title: snippet.channelTitle,
      channel_id: snippet.channelId,
      published_at: snippet.publishedAt,
      duration: contentDetails.duration, // Returns ISO 8601 duration e.g., PT1H2M3S
      view_count: statistics.viewCount || 0,
      like_count: statistics.likeCount || 0,
      comment_count: statistics.commentCount || 0,
      tags: snippet.tags ? JSON.stringify(snippet.tags) : '[]',
      category: snippet.categoryId,
      language: snippet.defaultLanguage || snippet.defaultAudioLanguage || 'en',
      ai_summary: summary
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error.message);
    throw error;
  }
};

exports.generateVideoSummary = async (title, description) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: `You are a helpful assistant. Provide a single paragraph summary about a video given its title and description.\n\nTitle: ${title}\n\nDescription: ${description}`
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (err) {
    console.warn('Error generating AI summary:', err.message, err.response?.data);
    return 'Summary not available.';
  }
};

exports.searchYouTubeVideos = async (query) => {
  try {
    const videoId = exports.extractVideoId(query);
    if (videoId) {
      try {
        const videoData = await exports.fetchYouTubeVideoData(videoId);
        return [{
          id: 'yt-0',
          youtube_id: videoData.youtube_id,
          title: videoData.title,
          channel_title: videoData.channel_title,
          thumbnail_url: videoData.thumbnail_url
        }];
      } catch (err) {
        console.warn('Failed to fetch video data from URL, falling back to normal search:', err.message);
      }
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=20&key=${apiKey}`;
    
    let response;
    try {
      if (apiKey) {
        response = await axios.get(url);
      }
    } catch (err) {
      const errorDetail = err.response?.data?.error?.message || err.message;
      console.warn('YouTube Search API failed:', errorDetail);
    }

    if (!response || !response.data || !response.data.items || response.data.items.length === 0) {
      return [];
    }

    return response.data.items.map((item, index) => {
      // Decode HTML entities in title
      const title = item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      return {
        id: `yt-${index}`, // Temporary ID for React keys
        youtube_id: item.id.videoId,
        title: title,
        channel_title: item.snippet.channelTitle,
        thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
      };
    });
  } catch (error) {
    console.error('Error searching YouTube:', error.message);
    throw error;
  }
};

exports.fetchTopYouTubeVideos = async () => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=20&key=${apiKey}`;
    
    let response;
    try {
      if (apiKey) {
        response = await axios.get(url);
      }
    } catch (err) {
      const errorDetail = err.response?.data?.error?.message || err.message;
      console.warn('YouTube Top Videos API failed:', errorDetail);
    }

    if (!response || !response.data || !response.data.items || response.data.items.length === 0) {
      return [];
    }

    return response.data.items.map((item, index) => {
      const title = item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      return {
        id: `yt-top-${index}`,
        youtube_id: item.id,
        title: title,
        channel_title: item.snippet.channelTitle,
        thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
      };
    });
  } catch (error) {
    console.error('Error fetching top YouTube videos:', error.message);
    throw error;
  }
};
