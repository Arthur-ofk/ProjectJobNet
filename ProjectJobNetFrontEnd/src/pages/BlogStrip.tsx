import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { resetPosts, fetchPostsRequest, votePostRequest, savePostRequest } from '../slices/blogSlice.ts';
import './BlogStrip.css';
import { API_BASE_URL } from '../constants.ts';

const UpArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const DownArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

const CommentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

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
          <div
            key={post.id}
            className="blog-card"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            {post.imageData && (
              <div className="blog-card-image">
                <img 
                  src={`data:${post.imageContentType || 'image/jpeg'};base64,${post.imageData}`}
                  alt={post.title}
                />
              </div>
            )}
            <div className="blog-card-content">
              <h4>{post.title}</h4>
              <p>{post.content.substring(0, 100)}...</p>
            </div>
            <div className="blog-card-footer">
              <div className="card-footer__actions">
                <button 
                  className={`icon-btn ${userVotes.get(post.id) === 'up' ? 'active-up' : ''}`}
                  aria-label="Upvote"
                  onClick={(e) => handleVote(e, post.id, true)}
                >
                  <UpArrowIcon />
                </button>
                <span className="score">
                  {(post.upvotes || 0) - (post.downvotes || 0)}
                </span>
                <button 
                  className={`icon-btn ${userVotes.get(post.id) === 'down' ? 'active-down' : ''}`}
                  aria-label="Downvote"
                  onClick={(e) => handleVote(e, post.id, false)}
                >
                  <DownArrowIcon />
                </button>
                <button 
                  className="icon-btn"
                  aria-label="Comment"
                  onClick={(e) => handleComment(e, post.id)}
                >
                  <CommentIcon />
                </button>
                <button 
                  className={`icon-btn ${savedPosts.has(post.id) ? 'saved' : ''}`}
                  aria-label="Save"
                  onClick={(e) => handleSave(e, post.id)}
                >
                  <BookmarkIcon />
                </button>
              </div>
              <div className="blog-card-meta">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
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
