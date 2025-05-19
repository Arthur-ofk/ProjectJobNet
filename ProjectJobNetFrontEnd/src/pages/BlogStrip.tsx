import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { resetPosts, fetchPostsRequest, votePostRequest, savePostRequest } from '../slices/blogSlice.ts';
import './BlogStrip.css';

// SVG Icons as components
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

const POSTS_PER_PAGE = 6; // Reduced number for home page strip

function BlogStrip() {
  const dispatch = useDispatch();
  const { posts, skip, hasMore, loading, error } = useSelector((state: RootState) => state.blog);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState({ visiblePosts: 0, lastFetch: 0 });
  
  // Initial load: reset and fetch first page (skip=0)
  useEffect(() => {
    console.log("BlogStrip mounted - resetting posts");
    dispatch(resetPosts());
    dispatch(fetchPostsRequest({ skip: 0, take: POSTS_PER_PAGE }));
  }, [dispatch]);

  // Update debug info when posts change
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      visiblePosts: posts.length
    }));
  }, [posts]);

  // Enhanced infinite scroll with improved triggering
  useEffect(() => {
    if (loading) {
      console.log("Skipping observer setup - currently loading");
      return;
    }
    
    if (!hasMore) {
      console.log("Skipping observer setup - no more posts");
      return;
    }
    
    console.log(`Setting up IntersectionObserver: posts=${posts.length}, skip=${skip}, hasMore=${hasMore}`);
    
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        console.log(`Observer triggered: isIntersecting=${isIntersecting}, hasMore=${hasMore}`);
        
        if (isIntersecting && hasMore && !loading) {
          const newSkip = skip + POSTS_PER_PAGE;
          console.log(`Fetching more posts: skip=${newSkip}, take=${POSTS_PER_PAGE}`);
          setDebugInfo(prev => ({ ...prev, lastFetch: Date.now() }));
          dispatch(fetchPostsRequest({ skip: newSkip, take: POSTS_PER_PAGE }));
        }
      },
      { 
        root: null,
        rootMargin: '200px', // Increased margin to trigger loading earlier
        threshold: 0.1
      }
    );
    
    if (observerRef.current) {
      observer.observe(observerRef.current);
      console.log("Observer attached to element");
    }
    
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
        console.log("Observer detached");
      }
    };
  }, [loading, hasMore, skip, posts.length, dispatch]);

  const handleVote = (e: React.MouseEvent, postId: string, upvote: boolean) => {
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(votePostRequest({ id: postId, isUpvote: upvote }));
  };

  const handleSave = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      dispatch(savePostRequest({ id: postId }));
    } catch (err) {
      console.error("Error saving post:", err);
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
        {/* Small debug indicator */}
        <small style={{ color: '#888', fontSize: '0.7rem' }}>
          Displaying {posts.length} posts
        </small>
      </div>
      
      {/* No slice limitation - display all loaded posts */}
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
                  className="icon-btn" 
                  aria-label="Upvote"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!token) navigate('/login');
                    else dispatch(votePostRequest({ id: post.id, isUpvote: true }));
                  }}
                >
                  <UpArrowIcon />
                </button>
                <span className="score">
                  {(post.upvotes || 0) - (post.downvotes || 0)}
                </span>
                <button 
                  className="icon-btn" 
                  aria-label="Downvote"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!token) navigate('/login');
                    else dispatch(votePostRequest({ id: post.id, isUpvote: false }));
                  }}
                >
                  <DownArrowIcon />
                </button>
                <button 
                  className="icon-btn" 
                  aria-label="Comment"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/posts/${post.id}`);
                  }}
                >
                  <CommentIcon />
                </button>
                <button 
                  className="icon-btn" 
                  aria-label="Save"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!token) navigate('/login');
                    else dispatch(savePostRequest({ id: post.id }));
                  }}
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
      
      {/* More prominent observer element */}
      <div 
        ref={observerRef} 
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
        {loading ? 
          'Loading more posts...' : 
          hasMore ? 
            'Scroll for more posts' : 
            'No more posts to load'
        }
      </div>
      
      {error && <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>{error}</div>}
    </div>
  );
}

export default BlogStrip;
