import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';
import './PostDetail.css';

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

type Comment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  authorName?: string;
};

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/posts/${id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => setComments([]));
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/posts/${id}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content: newComment })
    });
    if (res.ok) {
      const comment = await res.json();
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } else alert('Failed to post comment.');
  };

  if (loading) return <div>Loading post...</div>;
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
        {comments.map(c => (
          <div key={c.id} className="comment">
            <div className="comment-author">{c.authorName || 'Anonymous'}</div>
            <div className="comment-content">{c.content}</div>
            <div className="comment-date">{new Date(c.createdAt).toLocaleString()}</div>
          </div>
        ))}
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            required
          />
          <button type="submit" className="submit-comment-btn">Submit</button>
        </form>
      </div>
      <div style={{ marginTop: 16 }}>
        <Link to="/blog">← Back to Blog</Link>
      </div>
    </div>
  );
}

export default PostDetail;
