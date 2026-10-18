import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Videos = () => {
  const [topVideos, setTopVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos/top');
        setTopVideos(response.data);
      } catch (err) {
        setError('Failed to load top videos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopVideos();
  }, []);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-28 pb-12 min-h-[500px]">
      <h1 className="text-2xl font-bold mb-6 text-white border-b border-[#2c3440] pb-2 font-tiempos">
        Top Videos of the Day
      </h1>

      {loading ? (
        <div className="text-[#99aabb]">Loading top videos...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : topVideos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topVideos.map((video) => (
            <Link to={`/video/${video.youtube_id}`} key={video.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded overflow-hidden border border-[#2c3440] transition-colors">
                <div
                  className="w-full h-full bg-cover bg-center opacity-80"
                  style={{ backgroundImage: `url(${video.thumbnail_url})` }}
                />
              </div>
              <h3 className="text-sm font-semibold mt-2 text-white line-clamp-2 leading-tight group-hover:text-[#00e054] transition-colors">
                {video.title.split('|')[0].trim()}
              </h3>
              <p className="text-xs text-[#99aabb] mt-1 line-clamp-1">{video.channel_title}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-[#99aabb]">No videos found. Check back later!</div>
      )}
    </div>
  );
};

export default Videos;
