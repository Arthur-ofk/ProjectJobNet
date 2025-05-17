import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { resetPosts, fetchPostsRequest } from '../slices/blogSlice.ts';
import './BlogStrip.css';

const POSTS_PER_PAGE = 10;

function BlogStrip() {
  const dispatch = useDispatch();
  const { posts, skip, hasMore, loading, error } = useSelector((state: RootState) => state.blog);
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement>(null);

  // Initial load: reset and fetch first page (skip=0)
  useEffect(() => {
    dispatch(resetPosts());
    dispatch(fetchPostsRequest({ skip: 0, take: POSTS_PER_PAGE }));
  }, [dispatch]);

  // Intersection observer for infinite scroll (auto-load when reaching end)
  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const nextSkip = skip + POSTS_PER_PAGE;
        dispatch(fetchPostsRequest({ skip: nextSkip, take: POSTS_PER_PAGE }));
      }
    }, { threshold: 1.0 });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore, skip, dispatch]);

  return (
    <div className="blog-strip-container">
      <div className="blog-strip-header">
        <h3>Latest Blog Posts</h3>
        {/* ...existing header code... */}
      </div>
      <div className="blog-strip">
        {posts.map(post => (
          <div
            key={post.id}
            className="blog-card"
            onClick={() => navigate(`/posts/${post.id}`, { state: { from: window.scrollY } })}
          >
            <h4>{post.title}</h4>
            <p>{post.content.substring(0, 100)}...</p>
            {/* ...existing action buttons... */}
          </div>
        ))}
      </div>
      <div ref={observerRef} className="loader">
        {loading ? 'Loading more posts...' : hasMore ? 'Scroll down to load more' : 'No more posts'}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {/* Removed manual "Load More" button since auto-loading is handled above */}
    </div>
  );
}

export default BlogStrip;
