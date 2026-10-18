import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Eye, Heart, Clock, Star, Share, ExternalLink } from 'lucide-react';
import youtubeLogo from '../../assets/youtube.png';
import watchIcon from '../../assets/controls/Watch.png';
import watchedIcon from '../../assets/controls/Watched.png';
import likeIcon from '../../assets/controls/Like.png';
import likedIcon from '../../assets/controls/Liked.png';
import watchlistIcon from '../../assets/controls/Watchlist.png';
import watchlistedIcon from '../../assets/controls/Watchlisted.png';
import StarRating from '../../components/StarRating';

const VideoPage = () => {
  const { youtubeId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [hasWatched, setHasWatched] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasWatchlisted, setHasWatchlisted] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        // We assume the video might not exist in our DB yet if just navigated to,
        // so we could attempt an import or just fetch.
        // For this demo, let's just do a GET. If it fails, we show error.
        // In a real flow, a user pasting a URL hits POST /api/videos/import first.
        const res = await axios.get(`http://localhost:5000/api/videos/${youtubeId}`);
        setVideo(res.data);
      } catch (err) {
        // If not found, let's try to import it automatically just in case 
        // they arrived via direct URL
        try {
          const importRes = await axios.post(`http://localhost:5000/api/videos/import`, {
            url: `https://youtube.com/watch?v=${youtubeId}`
          });
          setVideo(importRes.data);
        } catch (importErr) {
          setError('Video not found or could not be imported.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (youtubeId) fetchVideo();
  }, [youtubeId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!video) return null;

  const year = new Date(video.published_at).getFullYear();
  const formattedDate = new Date(video.published_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="bg-[#14181c] min-h-screen text-[#99aabb] font-sans pb-20">
      {/* Hero Backdrop */}
      <div className="relative w-full h-[500px] overflow-hidden flex justify-center">
        {/* Background Image Blurred */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xl opacity-40 scale-110"
          style={{ backgroundImage: `url(${video.thumbnail_url})` }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#14181c] via-transparent to-[#14181c] opacity-80"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto max-w-5xl px-4 -mt-[320px] flex gap-8">

        {/* Left Column (Thumbnail & Links) */}
        <div className="w-[280px] shrink-0 flex flex-col gap-4">
          <div className="rounded-lg overflow-hidden shadow-2xl border border-[#2c3440] relative group aspect-video">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${video.thumbnail_url})` }}
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-helvetica-bold">
              {video.duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '')}
            </div>
          </div>


        </div>

        {/* Center Column (Details) */}
        <div className="flex-1">
          <div className="mb-6 leading-[1.1]">
            <h1 className="text-[32px] text-white tracking-tight font-tiempos mb-5">
              {video.title.split('|')[0].trim()}
            </h1>
            <div className="whitespace-nowrap">
              <span className="text-[18px] text-[#99aabb] hover:text-[#c0cdd6] cursor-pointer transition-colors mr-4 font-graphik">
                {year}
              </span>
              <span className="text-[14px] font-graphik">
                <span className="text-[#667788] mr-1.5">Uploaded by</span>
                <span className="text-[#99aabb] hover:text-[#c0cdd6] cursor-pointer transition-colors">{video.channel_title}</span>
              </span>
            </div>
          </div>

          <div className="border-t border-[#2c3440] pt-4 mt-8">
            <div className="flex gap-6 text-sm font-helvetica-bold uppercase tracking-wider text-[#667788] mb-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`hover:text-white transition-colors pb-1 ${activeTab === 'details' ? 'text-white border-b-2 border-white' : ''}`}
              >Details</button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`hover:text-white transition-colors pb-1 ${activeTab === 'tags' ? 'text-white border-b-2 border-white' : ''}`}
              >Tags</button>
              <button
                onClick={() => setActiveTab('channel')}
                className={`hover:text-white transition-colors pb-1 ${activeTab === 'channel' ? 'text-white border-b-2 border-white' : ''}`}
              >Channel</button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`hover:text-white transition-colors pb-1 ${activeTab === 'statistics' ? 'text-white border-b-2 border-white' : ''}`}
              >Statistics</button>
            </div>

            <div className="text-sm">
              {activeTab === 'details' && (
                <div className="flex flex-col gap-4">
                  {video.ai_summary && (
                    <div className="text-[#c0cdd6] leading-relaxed">
                      <p>{video.ai_summary}</p>
                    </div>
                  )}

                </div>
              )}
              {activeTab === 'tags' && (
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(video.tags || '[]').map((tag, i) => (
                    <span key={i} className="bg-[#2c3440] hover:bg-[#445566] cursor-pointer px-2 py-1 rounded text-[#99aabb] transition-colors">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Actions) */}
        <div className="w-[230px] shrink-0 font-graphik">
          <div className="bg-[#445566] rounded-[3px] shadow-md overflow-hidden text-[#99aabb]">
            {/* Top 3 Action Icons */}
            <div className="flex border-b border-[#2c3440]">
              <button onClick={() => setHasWatched(!hasWatched)} className="flex-1 flex flex-col items-center justify-end pt-1 pb-2 transition-colors group">
                <div className="h-[66px] flex items-center justify-center mb-[-6px]">
                  <img src={hasWatched ? watchedIcon : watchIcon} alt="Watch" className="w-[56px] h-[56px] object-contain translate-y-[1px]" />
                </div>
                <span className="text-[13px] font-normal text-[#99aabb] group-hover:text-white">{hasWatched ? 'Watched' : 'Watch'}</span>
              </button>
              <button onClick={() => setHasLiked(!hasLiked)} className="flex-1 flex flex-col items-center justify-end pt-1 pb-2 transition-colors group">
                <div className="h-[66px] flex items-center justify-center mb-[-6px]">
                  <img src={hasLiked ? likedIcon : likeIcon} alt="Like" className="w-[56px] h-[56px] object-contain translate-y-[2px]" />
                </div>
                <span className="text-[13px] font-normal text-[#99aabb] group-hover:text-white">{hasLiked ? 'Liked' : 'Like'}</span>
              </button>
              <button onClick={() => setHasWatchlisted(!hasWatchlisted)} className="flex-1 flex flex-col items-center justify-end pt-1 pb-2 transition-colors group">
                <div className="h-[66px] flex items-center justify-center mb-[-6px]">
                  <img src={hasWatchlisted ? watchlistedIcon : watchlistIcon} alt="Watchlist" className="w-[66px] h-[66px] object-contain translate-y-[1.5px]" />
                </div>
                {hasWatchlisted ? (
                  <>
                    <span className="text-[13px] font-normal text-[#99aabb] group-hover:hidden">Watchlist</span>
                    <span className="text-[13px] font-normal text-white hidden group-hover:block">Remove</span>
                  </>
                ) : (
                  <span className="text-[13px] font-normal text-[#99aabb] group-hover:text-white">Watchlist</span>
                )}
              </button>
            </div>

            {/* Rate */}
            <StarRating />

            {/* List Actions */}
            <div className="flex flex-col text-[13px] text-[#99aabb]">
              <button className="py-2.5 border-b border-[#2c3440] hover:text-white transition-colors font-normal">Review or log</button>
              <button className="py-2.5 border-b border-[#2c3440] hover:text-white transition-colors font-normal">Add to lists</button>
              <button className="py-2.5 hover:text-white transition-colors font-normal">Share</button>
            </div>
          </div>

          {/* Ratings Graph Section */}
          <div className="mt-8 border-t border-[#445566] pt-2">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[11px] text-[#99aabb] uppercase tracking-[0.15em]">Ratings</span>
              <span className="text-[11px] text-[#667788] uppercase tracking-wider">{video.youtuboxd_ratings?.count || 0} Ratings</span>
            </div>

            <div className="flex items-end mt-4">
              {/* Left Star */}
              <div className="flex items-center mb-[2px]">
                <Star size={12} fill="#00e054" strokeWidth={0} />
              </div>

              {/* Histogram */}
              <div className="flex-1 flex items-end gap-[2px] h-[45px] mx-3 border-b border-[#445566]">
                {['0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'].map((rating, i) => {
                  const distribution = video.youtuboxd_ratings?.distribution || {};
                  const maxCount = Math.max(...Object.values(distribution), 0);
                  const count = distribution[rating] || 0;
                  const height = maxCount > 0 ? Math.max((count / maxCount) * 100, 2) : 2;
                  return (
                    <div key={i} className="flex-1 bg-[#445566] hover:bg-[#667788] rounded-t-[2px] transition-colors cursor-pointer" style={{ height: `${height}%` }} title={`${rating} stars: ${count}`}></div>
                  )
                })}
              </div>

              {/* Right Side Score */}
              <div className="flex flex-col items-center">
                <span className="text-[32px] text-[#c0cdd6] font-light leading-none mb-1">
                  {video.youtuboxd_ratings?.average || '0.0'}
                </span>
                <div className="relative flex gap-[2px]">
                  {/* Background Stars (Empty/Gray) */}
                  <div className="flex gap-[2px] text-[#445566]">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" strokeWidth={0} className="flex-shrink-0" />)}
                  </div>
                  {/* Foreground Stars (Green, clipped) */}
                  <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${((video.youtuboxd_ratings?.average || 0) / 5) * 100}%` }}>
                    <div className="flex gap-[2px] text-[#00e054] w-max">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" strokeWidth={0} className="flex-shrink-0" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoPage;
