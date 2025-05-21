import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { resetPosts, fetchPostsRequest, votePostRequest, savePostRequest } from '../slices/blogSlice.ts';
import './BlogStrip.css';
import { API_BASE_URL } from '../constants.ts';

// Import the BlogPostCard component
import BlogPostCard from '../components/blog/BlogPostCard.tsx';

const POSTS_PER_PAGE = 6;

function BlogStrip() {
  const dispatch = useDispatch();
  const { posts, skip, hasMore, loading, error } = useSelector((state: RootState) => state.blog);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [userVotes, setUserVotes] = useState<Map<string, string>>(new Map());
  
  useEffect(() => {
    dispatch(resetPosts());
    dispatch(fetchPostsRequest({ skip: 0, take: POSTS_PER_PAGE }));
    
    if (token) {
      fetch(`${API_BASE_URL}/BlogPost/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data)) {
            const newSaved = new Set<string>();
            data.forEach(post => newSaved.add(post.blogPostId));
            setSavedPosts(newSaved);
          }
        });
    }
  }, [dispatch, token]);
  
  useEffect(() => {
    if (!hasMore || loading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.target === sentinelRef.current && entry.isIntersecting && hasMore && !loading) {
          dispatch(fetchPostsRequest({ skip: skip + POSTS_PER_PAGE, take: POSTS_PER_PAGE }));
        }
      },
      { 
        rootMargin: '200px',
        threshold: 0.1
      }
    );
    
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [loading, hasMore, skip, dispatch]);

  const handleVote = async (e: React.MouseEvent, postId: string, isUpvote: boolean) => {
    e.stopPropagation();
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      // Check if user already voted this way
      const currentVote = userVotes.get(postId);
      if (currentVote === (isUpvote ? 'up' : 'down')) {
        return; // Already voted this way
      }
      
      // Send vote to server
      const response = await fetch(`${API_BASE_URL}/BlogPost/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          isUpvote: isUpvote
        })
      });
      
      if (!response.ok) throw new Error("Voting failed");
      
      // Update UI vote status
      const newVotes = new Map(userVotes);
      newVotes.set(postId, isUpvote ? 'up' : 'down');
      setUserVotes(newVotes);
      
      // Get accurate score from server
      const scoreResponse = await fetch(`${API_BASE_URL}/BlogPost/${postId}/score`);
      if (scoreResponse.ok) {
        const scoreData = await scoreResponse.json();
        
        // Update only this specific post's score in the UI
        const updatedPosts = posts.map(post => {
          if (post.id === postId) {
            return { ...post, upvotes: scoreData.score, downvotes: 0 };
          }
          return post;
        });
        
        // Update posts array with accurate score
        dispatch({ type: 'blog/updatePostScore', payload: { posts: updatedPosts } });
      }
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const handleSave = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const isSaved = savedPosts.has(postId);
      
      if (!isSaved) {
        dispatch(savePostRequest({ id: postId }));
        setSavedPosts(prev => new Set(prev).add(postId));
      } else {
        const userId = user?.id;
        
        fetch(`${API_BASE_URL}/BlogPost/saved?blogPostId=${postId}&userId=${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSavedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const handleComment = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="blog-strip-container">
      <div className="blog-strip-header">
        <h3>Latest Blog Posts</h3>
      </div>
      
      <div className="blog-strip">
        {posts.map(post => (
          <BlogPostCard
            key={post.id}
            post={post}
            onVote={handleVote}
            onSave={handleSave}
            onComment={handleComment}
            userVoteStatus={userVotes.get(post.id) as 'up' | 'down' | 'none' || 'none'}
            isSaved={savedPosts.has(post.id)}
          />
        ))}
      </div>
      
      <div 
        ref={sentinelRef}
        className="loader"
        style={{ 
          padding: '15px',
          margin: '20px 0',
          textAlign: 'center',
          backgroundColor: loading ? '#f0f8ff' : 'transparent',
          transition: 'background-color 0.3s',
          borderRadius: '8px'
        }} 
      >
        {loading ? 'Loading more posts...' : hasMore ? '' : 'No more posts'}
      </div>
      
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
    </div>
  );
}

export default BlogStrip;
