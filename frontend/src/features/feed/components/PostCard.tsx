import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { toggleAppreciationApi, deletePostApi, sharePostApi } from '../../../api/post.api';
import { addCommentApi, fetchCommentsApi, deleteCommentApi } from '../../../api/comment.api';
import { toggleBlockApi } from '../../../api/user.api';
import ReportModal from '../../../shared/components/ReportModal';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: any;
}

const PostCard: React.FC<PostCardProps> = ({ post: initialPost }) => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const removePost = useAppStore((state) => state.removePost);
  const [post, setPost] = useState(initialPost);
  
  // Use the author object from the post itself, not the active user from store
  const author = post.author || {};
  const isAuthor = user?._id === author._id;

  const [openComments, setOpenComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const goToProfile = () => {
    if (author.username) {
      navigate(`/profile/${author.username}`);
    }
  };

  const handleBlockAuthor = async () => {
    if (!window.confirm(`Are you sure you want to block ${author.fullName}?`)) return;
    try {
        const res = await toggleBlockApi(author._id);
        if (res.success) {
            toast.success("Author blocked. You won't see their posts anymore.");
            removePost(post._id); // Hide this post immediately
        }
    } catch (error) {
        toast.error("Failed to block user");
    }
    setShowOptionsMenu(false);
  };

  const handleAppreciate = async () => {
    if (!user) return toast.error("Please login to appreciate");
    const isAppreciated = !post.appreciations?.includes(user?._id);
    const newAppreciations = isAppreciated 
        ? [...(post.appreciations || []), user?._id] 
        : (post.appreciations || []).filter((id: string) => id !== user?._id);
    
    const originalPost = { ...post };
    setPost({ 
      ...post, 
      appreciations: newAppreciations, 
      appreciationsCount: isAppreciated ? post.appreciationsCount + 1 : Math.max(0, post.appreciationsCount - 1) 
    });

    try {
      const result = await toggleAppreciationApi(post._id);
      if (!result.success) setPost(originalPost);
    } catch (error) { setPost(originalPost); }
  };

  const handleShare = async (type: 'internal' | 'whatsapp' | 'copy') => {
    try {
      const result = await sharePostApi(post._id);
      if (result.success) {
        setPost({ ...post, sharesCount: result.data.sharesCount });
        const postUrl = `${window.location.origin}/post/${post._id}`;
        
        if (type === 'copy') {
          await navigator.clipboard.writeText(postUrl);
          toast.success("Link copied to clipboard!");
        } else if (type === 'whatsapp') {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(post.content + " " + postUrl)}`, '_blank');
        } else if (type === 'internal') {
          if (navigator.share) {
            await navigator.share({
                title: 'JanNetra Post',
                text: post.content,
                url: postUrl,
            });
          } else {
            await navigator.clipboard.writeText(postUrl);
            toast.success("Internal share logic (Link Copied)!");
          }
        }
      }
      setShowShareMenu(false);
    } catch (error) { 
      console.error("Share Error:", error);
      toast.error("Sharing failed");
    }
  };

  const toggleComments = async () => {
    if (openComments) {
      setOpenComments(false);
      setComments([]);
    } else {
      setOpenComments(true);
      setIsCommenting(true);
      try {
        const result = await fetchCommentsApi(post._id);
        if (result.success) setComments(result.data);
      } catch (error) { console.error("Fetch Comments Error:", error); }
      finally { setIsCommenting(false); }
    }
  };

  const handleAddComment = async () => {
    if (!user) return toast.error("Login to comment");
    if (!commentText.trim()) return;
    try {
      const result = await addCommentApi(post._id, commentText);
      if (result.success) {
        setComments([result.data, ...comments]);
        setCommentText('');
        setPost({ ...post, commentsCount: post.commentsCount + 1 });
        toast.success("Comment added!");
      }
    } catch (error) { console.error("Add Comment Error:", error); }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const result = await deleteCommentApi(commentId);
      if (result.success) {
        setComments(comments.filter(c => c._id !== commentId));
        setPost({ ...post, commentsCount: Math.max(0, post.commentsCount - 1) });
        toast.success("Comment deleted");
      }
    } catch (error) { console.error("Delete Comment Error:", error); }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const result = await deletePostApi(post._id);
      if (result.success) {
        removePost(post._id);
        toast.success("Post deleted");
      }
    } catch (error) { console.error("Delete Post Error:", error); }
  };

  const isAppreciated = post.appreciations?.includes(user?._id);
  const mediaItems = post.media && post.media.length > 0 ? post.media : (post.mediaUrls || []).map((url: string) => ({ url, resourceType: 'image' }));

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 mb-8">
      {/* Post Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4 cursor-pointer group/author" onClick={goToProfile}>
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg bg-accent flex items-center justify-center text-white font-bold group-hover/author:scale-110 transition-transform">
            {author.avatar ? (
              <img src={author.avatar.startsWith('http') ? author.avatar : `${import.meta.env.VITE_API_URL}${author.avatar}`} alt={author.fullName} className="w-full h-full object-cover" />
            ) : (
              author.fullName?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight group-hover/author:text-accent transition-colors">{author.fullName}</span>
              {author.isVerified && <i className="fi fi-sr-badge-check text-blue-500 text-xs"></i>}
            </div>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
              {post.locationTag?.village || post.locationTag?.district} • {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 relative">
          {isAuthor ? (
            <button onClick={handleDeletePost} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all" title="Delete Post">
              <i className="fi fi-rr-trash"></i>
            </button>
          ) : (
            <>
              <button 
                onClick={() => setShowOptionsMenu(!showOptionsMenu)} 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${showOptionsMenu ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : ''}`}
              >
                <i className="fi fi-rr-menu-dots-vertical"></i>
              </button>

              {showOptionsMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => { setShowReportModal(true); setShowOptionsMenu(false); }}
                    className="w-full px-4 py-3 text-left text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                  >
                    <i className="fi fi-rr-exclamation"></i> Report Post
                  </button>
                  <button 
                    onClick={handleBlockAuthor}
                    className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                  >
                    <i className="fi fi-rr-ban"></i> Block @{author.username}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal 
          itemId={post._id} 
          itemType="Post" 
          onClose={() => setShowReportModal(false)} 
        />
      )}

      {/* Post Content */}
      <div className="px-6 pb-6">
        {post.content && <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 font-medium">{post.content}</p>}
        
        {mediaItems.length > 0 && (
          <div className={`grid gap-2 ${mediaItems.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {mediaItems.map((item: any, idx: number) => (
              <div key={idx} className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 group cursor-pointer relative shadow-inner">
                {item.resourceType === 'video' || item.url.endsWith('.mp4') ? (
                  <video src={item.url.startsWith('http') ? item.url : `${import.meta.env.VITE_API_URL}${item.url}`} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={item.url.startsWith('http') ? item.url : `${import.meta.env.VITE_API_URL}${item.url}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 relative">
        <div className="flex items-center gap-8">
          <button 
            onClick={handleAppreciate} 
            className={`flex items-center gap-2 text-slate-500 transition-all group ${isAppreciated ? 'text-red-500' : 'hover:text-red-500'}`}
            title={isAppreciated ? "Remove Appreciation" : "Appreciate"}
          >
            <i className={`fi ${isAppreciated ? 'fi-sr-heart' : 'fi-rr-heart'} text-xl group-hover:scale-110`}></i>
            <span className="text-[10px] font-black">{post.appreciationsCount}</span>
          </button>
          
          <button 
            onClick={toggleComments} 
            className={`flex items-center gap-2 transition-all group ${openComments ? 'text-accent' : 'text-slate-500 hover:text-accent'}`}
            title="Comments"
          >
            <i className="fi fi-rr-comment text-xl group-hover:scale-110"></i>
            <span className="text-[10px] font-black">{post.commentsCount}</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)} 
              className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-all group"
              title="Share"
            >
              <i className="fi fi-rr-paper-plane text-xl group-hover:rotate-12"></i>
              <span className="text-[10px] font-black">{post.sharesCount}</span>
            </button>

            {showShareMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button onClick={() => handleShare('internal')} className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                  <i className="fi fi-rr-share"></i> Internal Share
                </button>
                <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                  <i className="fi fi-brands-whatsapp"></i> WhatsApp Share
                </button>
                <button onClick={() => handleShare('copy')} className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                  <i className="fi fi-rr-copy"></i> Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment Section */}
      {openComments && (
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-300">
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="flex-1 flex gap-2">
              <input type="text" placeholder="Write a comment..." className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-accent" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddComment()} />
              <button onClick={handleAddComment} disabled={!commentText.trim()} className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50">Post</button>
            </div>
          </div>
          <div className="space-y-4">
            {isCommenting ? (
              <div className="text-center py-4"><div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : comments.length === 0 ? (
              <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest py-2">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden">
                    {comment.author?.avatar ? <img src={comment.author.avatar.startsWith('http') ? comment.author.avatar : `${import.meta.env.VITE_API_URL}${comment.author.avatar}`} className="w-full h-full object-cover" alt="" /> : comment.author?.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 relative">
                    <p className="text-[10px] font-black text-slate-900 dark:text-white mb-1">{comment.author?.fullName} • <span className="text-slate-500 font-medium">{new Date(comment.createdAt).toLocaleDateString()}</span></p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{comment.content}</p>
                    {user?._id === comment.author?._id && <button onClick={() => handleDeleteComment(comment._id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Comment"><i className="fi fi-rr-trash text-[10px]"></i></button>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
