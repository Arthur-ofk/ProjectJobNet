import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchPostDetailRequest } from '../slices/blogSlice.ts';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Select the detail from unified blog slice (rename 'currentPost' below accordingly)
  const { currentPost: post, loading, error } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostDetailRequest({ id }));
    }
  }, [id, dispatch]);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>{post.title}</h2>
      <div className="post-meta">
        {post.authorPicUrl ? (
          <img src={post.authorPicUrl} alt="Author" className="author-pic" />
        ) : (
          <span>{post.authorName || 'Unknown'}</span>
        )}
        <span>Posted on {new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <div className="post-content">{post.content}</div>
      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}
      <div className="comments-section">
        <h3>Comments</h3>
        {/* Comments component can be integrated here */}
      </div>
      <div style={{ marginTop: 16 }}>
        <Link to="/blog">← Back to Blog</Link>
      </div>
    </div>
  );
}

export default PostDetail;
