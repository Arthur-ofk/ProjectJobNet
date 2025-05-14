import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants.ts';
import { RootState } from '../store.ts';
import './BlogStrip.css';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
  userId: string;
  authorName?: string;
  authorPicUrl?: string;
};

const POSTS_PER_PAGE = 10;

function BlogStrip() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '', attachments: null as File | null });
  const [votedPosts, setVotedPosts] = useState<{ [key: string]: 'up'|'down'|'none' }>({});
  const [savedPosts, setSavedPosts] = useState<{ [key: string]: boolean }>({});
  const { user, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (pageNum: number) => {
    setLoadingMore(true);
    // Assuming the API supports pagination via query parameters "page" and "limit"
    const res = await fetch(`${API_BASE_URL}/posts?page=${pageNum}&limit=${POSTS_PER_PAGE}`);
    const data: BlogPost[] = await res.json();
    setPosts(prev => [...prev, ...data]);
    setHasMore(data.length === POSTS_PER_PAGE);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    // Initial load
    setPosts([]);
    setPage(1);
    fetchPosts(1);
  }, [fetchPosts]);

  // Intersection observer to implement infinite scroll
  useEffect(() => {
    if (loadingMore) return;
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          fetchPosts(nextPage);
          setPage(nextPage);
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadingMore, hasMore, page, fetchPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = newPost.tags.split(',').map(t => t.trim());
    const postData = { ...newPost, tags: tagsArray };
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(postData)
    });
    if (res.ok) {
      // Reset posts and reload first page after new post creation
      setPosts([]);
      setPage(1);
      fetchPosts(1);
      setShowForm(false);
      setNewPost({ title: '', content: '', tags: '', attachments: null });
    } else alert('Failed to create post.');
  };

  const handleVotePost = async (postId: string, isUpvote: boolean) => {
    if (!token || !user) return;
    // Backend now requires token for voting; ensure Authorization header is set.
    const endpoint = `${API_BASE_URL}/likedposts`;
    try {
      if (votedPosts[postId] === (isUpvote ? 'up' : 'down')) {
        const res = await fetch(`${endpoint}?userId=${user.id}&postId=${postId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Vote removal failed');
        setVotedPosts(prev => ({ ...prev, [postId]: 'none' }));
      } else {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ postId, userId: user.id, isUpvote })
        });
        if (!res.ok) throw new Error('Vote failed');
        setVotedPosts(prev => ({ ...prev, [postId]: isUpvote ? 'up' : 'down' }));
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSavePost = async (postId: string) => {
    if (!token || !user) return;
    try {
      // Backend requires token for saving posts.
      if (savedPosts[postId]) {
        const res = await fetch(`${API_BASE_URL}/savedposts?userId=${user.id}&postId=${postId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Unsave failed');
        setSavedPosts(prev => ({ ...prev, [postId]: false }));
      } else {
        const res = await fetch(`${API_BASE_URL}/savedposts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ postId, userId: user.id })
        });
        if (!res.ok) throw new Error('Save failed');
        setSavedPosts(prev => ({ ...prev, [postId]: true }));
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReportPost = (postId: string) => {
    // Navigate to a report page or pop up a modal; for now, simply alert.
    alert(`Report post ${postId} functionality is not implemented yet.`);
  };

  return (
    <div className="blog-strip-container">
      <div className="blog-strip-header">
        <h3>Latest Blog Posts</h3>
        <button className="add-post-btn" onClick={() => setShowForm(s => !s)}>
          Add Post
        </button>
        {/* If an author's name appears as "Unknown", it is because the post data does not include authorName or authorPicUrl.
            Ensure the backend sends these fields in BlogPostDto for proper author display. */}
      </div>
      {showForm && (
        <form className="create-post-form" onSubmit={handleCreatePost}>
          <input type="text" placeholder="Title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} required />
          <textarea placeholder="Content" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} required />
          <input type="text" placeholder="Tags (comma separated)" value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })} />
          <input type="file" onChange={e => setNewPost({ ...newPost, attachments: e.target.files ? e.target.files[0] : null })} />
          <button type="submit">Post</button>
        </form>
      )}
      <div className="blog-strip">
        {posts.map(post => (
          <div key={post.id} className="blog-card" onClick={() => navigate(`/posts/${post.id}`, { state: { from: window.scrollY } })}>
            <h4>{post.title}</h4>
            <p>{post.content.substring(0, 100)}...</p>
            <div className="blog-actions">
              <button className="btn-vote" onClick={e => { e.stopPropagation(); handleVotePost(post.id, true); }}>▲</button>
              <button className="btn-vote" onClick={e => { e.stopPropagation(); handleVotePost(post.id, false); }}>▼</button>
              <button className="btn-comment" onClick={e => { e.stopPropagation(); navigate(`/posts/${post.id}`, { state: { from: window.scrollY } }); }}>💬</button>
              <button className="btn-save" onClick={e => { e.stopPropagation(); handleSavePost(post.id); }}>💾</button>
              <button className="btn-report" onClick={e => { e.stopPropagation(); handleReportPost(post.id); }}>⚠</button>
            </div>
            <div className="blog-author">
              <button className="report-btn" onClick={e => { e.stopPropagation(); handleReportPost(post.id); }}>
                {post.authorPicUrl ? (
                  <img src={post.authorPicUrl} alt="author" className="author-pic" />
                ) : (
                  <span>{post.authorName || 'Unknown'}</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Loader element for intersection observer */}
      <div ref={observerRef} className="loader">
        {loadingMore ? 'Loading more posts...' : hasMore ? 'Scroll down to load more' : 'No more posts'}
      </div>
    </div>
  );
}

export default BlogStrip;
