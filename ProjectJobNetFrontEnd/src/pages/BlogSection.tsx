import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { useNavigate } from 'react-router-dom';
import {
  fetchPostsRequest,
  resetPosts,
  createPostRequest,
  votePostRequest,
  savePostRequest
} from '../slices/blogSlice.ts';
import './BlogSection.css';

const POSTS_PER_PAGE = 12;

function BlogSection() {
  const dispatch = useDispatch();
  const { posts, loading, error, skip, hasMore } = useSelector((state: RootState) => state.blog);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const loader = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ visiblePosts: 0, lastFetch: 0 });
  
  // Initial load
  useEffect(() => {
    console.log("BlogSection mounted - resetting posts");
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
  
  // Enhanced infinite scroll with improved configuration
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
        threshold: 0.1 // Lower threshold to detect intersection sooner
      }
    );
    
    if (loader.current) {
      observer.observe(loader.current);
      console.log("Observer attached to element");
    }
    
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
        console.log("Observer detached");
      }
    };
  }, [loading, hasMore, skip, posts.length, dispatch]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      const form = new FormData();
      form.append('Title', newPost.title);
      form.append('Content', newPost.content);
      form.append('UserId', user.id);
      form.append('Tags', newPost.tags);
      if (newPostImage) form.append('Image', newPostImage);
      
      dispatch(createPostRequest(form));
      setShowCreatePost(false);
      setNewPost({ title: '', content: '', tags: '' });
      setNewPostImage(null);
    } finally {
      setCreating(false);
    }
  };

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
      // Show error notification to user
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Failed to save post';
      errorDiv.style.color = 'red';
      errorDiv.style.padding = '8px';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    }
  };

  const handleComment = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    navigate(`/posts/${postId}`);
  };

  const handleReport = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }
    
    const reason = prompt('Report reason:');
    if (reason) {
      // Report logic
      alert('Post reported successfully');
    }
  };

  return (
    <div className="blog-section">
      <h2>Blog Posts</h2>
      
      <div className="blog-section-info">
        <small style={{ color: '#888', fontSize: '0.8rem' }}>
          Displaying {posts.length} posts {hasMore && '- Scroll for more'}
        </small>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {/* Tabs and Create button */}
      <div className="blog-tabs">
        <button 
          className={`blog-tab-button ${activeTab === 'popular' ? 'active' : ''}`}
          onClick={() => setActiveTab('popular')}
        >
          Popular
        </button>
        <button 
          className={`blog-tab-button ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
        {token && (
          <button 
            className="btn btn--primary create-post-button"
            onClick={() => setShowCreatePost(!showCreatePost)}
          >
            {showCreatePost ? 'Cancel' : 'Create Post'}
          </button>
        )}
      </div>
      
      {/* Create Post Form */}
      {showCreatePost && (
        <form onSubmit={handleCreatePost} className="create-post-form">
          <h3>Create a Blog Post</h3>
          
          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input 
              id="post-title"
              type="text" 
              value={newPost.title} 
              onChange={e => setNewPost({...newPost, title: e.target.value})} 
              required 
              placeholder="Enter post title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="post-content">Content</label>
            <textarea 
              id="post-content"
              value={newPost.content} 
              onChange={e => setNewPost({...newPost, content: e.target.value})} 
              required 
              placeholder="Write your post content here"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="post-tags">Tags (comma separated)</label>
            <input 
              id="post-tags"
              type="text" 
              value={newPost.tags} 
              onChange={e => setNewPost({...newPost, tags: e.target.value})} 
              placeholder="tag1, tag2, tag3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="post-image">Featured Image</label>
            <input 
              id="post-image"
              type="file" 
              accept="image/*" 
              onChange={e => setNewPostImage(e.target.files?.[0] || null)} 
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn--outline"
              onClick={() => setShowCreatePost(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn--primary"
              disabled={creating}
            >
              {creating ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}
      
      {/* Blog posts grid */}
      <div className="blog-grid">
        {posts.map(post => (
          <div
            key={post.id}
            className="post-preview"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <div className="post-preview-content">
              {post.imageData && (
                <div className="post-preview-image">
                  <img 
                    src={`data:${post.imageContentType || 'image/jpeg'};base64,${post.imageData}`}
                    alt={post.title}
                  />
                </div>
              )}
              <div className="post-preview-text">
                <h4>{post.title}</h4>
                <p>{post.content.substring(0, 120)}...</p>
                <div className="meta">
                  <span>Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="actions card-footer__actions">
              <button 
                className="icon-btn"
                onClick={(e) => handleVote(e, post.id, true)}
                aria-label="Upvote"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
              <span className="score">
                {(post.upvotes || 0) - (post.downvotes || 0)}
              </span>
              <button 
                className="icon-btn"
                onClick={(e) => handleVote(e, post.id, false)}
                aria-label="Downvote"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </button>
              <button 
                className="icon-btn"
                onClick={(e) => handleComment(e, post.id)}
                aria-label="Comment"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <button 
                className="icon-btn"
                onClick={(e) => handleSave(e, post.id)}
                aria-label="Save"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <button 
                className="icon-btn"
                onClick={(e) => handleReport(e, post.id)}
                aria-label="Report"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* More visible loading indicator for infinite scroll */}
      <div 
        ref={loader} 
        className="loader"
        style={{ 
          padding: '15px',
          margin: '20px 0',
          textAlign: 'center',
          backgroundColor: loading ? '#f0f8ff' : 'transparent',
          transition: 'background-color 0.3s',
          borderRadius: '8px',
          minHeight: '50px'
        }} 
      >
        {loading ? 
          'Loading more posts...' : 
          hasMore ? 
            'Scroll for more posts' : 
            'No more posts to load'
        }
      </div>
    </div>
  );
}

export default BlogSection;
