import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../../store/appStore';
import { fetchPostsApi } from '../../../api/post.api';
import SkeletonPost from '../../../components/SkeletonPost';
import PostCard from './PostCard';

const CommunityFeed: React.FC = () => {
  const posts = useAppStore((state) => state.posts);
  const setPosts = useAppStore((state) => state.setPosts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      if (posts.length > 0) return; // Cache check
      setIsLoading(true);
      try {
        const result = await fetchPostsApi();
        if (result.success) {
          setPosts(result.data);
        }
      } catch (error) {
        console.error("Fetch Posts Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [setPosts, posts.length]);

  if (isLoading && posts.length === 0) {
    return (
      <section className="space-y-8 pt-4">
        {[1, 2, 3].map((i) => (
          <SkeletonPost key={i} />
        ))}
      </section>
    );
  }

  return (
    <section className="space-y-8 pt-4">
      <div className="flex items-center gap-2 mb-4 px-2">
        <h3 className="text-lg font-black text-white uppercase tracking-widest italic">
          <i className="fi fi-rr-users text-accent text-xl mr-3"></i>
          Community Updates
        </h3>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-[32px] border border-dashed border-slate-800">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No updates in your area yet.</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      )}
    </section>
  );
};

export default CommunityFeed;
