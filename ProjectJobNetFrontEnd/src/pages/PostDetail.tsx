import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import { API_BASE_URL } from '../constants.ts';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<string>('Loading...');
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const { token, user } = useSelector((s: RootState) => s.auth);
  const [votes, setVotes] = useState(0);
  const [saved, setSaved] = useState(false);
  const [voteStatus, setVoteStatus] = useState<'none' | 'up' | 'down'>('none');

  // quick action handlers
  const handleVote = async (up: boolean) => {
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/BlogPost/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify({ isUpvote: up })
    });
    if (res.ok) setVoteStatus(up ? 'up' : 'down');
  };

  const toggleSave = () => {
    if (!token) return;
    const method = saved ? 'DELETE' : 'POST';
    fetch(`${API_BASE_URL}/BlogPost/${id}/save`, {
      method,
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => setSaved(!saved));
  };

  const handleReport = () => {
    if (!token) return;
    const reason = prompt('Report reason')||'';
    fetch(`${API_BASE_URL}/BlogPost/${id}/report`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body:JSON.stringify({ description: reason })
    });
  };

  useEffect(() => {
    // load post & author
    fetch(`${API_BASE_URL}/BlogPost/${id}`)
      .then(r => r.json()).then(p => {
        setPost(p);
        setVotes((p.upvotes ?? 0) - (p.downvotes ?? 0));
        return fetch(`${API_BASE_URL}/users/${p.userId}/username`);
      })
      .then(r => r.ok ? r.text() : 'Unknown')
      .then(setAuthor);

    // load comments + usernames
    const loadComments = () =>
      fetch(`${API_BASE_URL}/BlogPost/${id}/comments`)
        .then(r => r.json())
        .then(async data => {
          const withUser = await Promise.all(data.map(async (c: any) => {
            const name = await fetch(`${API_BASE_URL}/users/${c.userId}/username`)
                              .then(r => r.ok ? r.text() : 'Unknown');
            return { ...c, userName: name||'Unknown' };
          }));
          setComments(withUser);
        });
    loadComments();

    // load saved state
    if (token) {
      fetch(`${API_BASE_URL}/BlogPost/${id}/save`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : false)
        .then(setSaved)
        .catch(() => setSaved(false));
    }

    if (token && user) {
      fetch(`${API_BASE_URL}/BlogPost/${id}/vote`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : null)
        .then(v => setVoteStatus(v?.isUpvote ? 'up' : 'down'))
        .catch(() => setVoteStatus('none'));
    }
  }, [id, token, user]);

  const handleAddComment = () => {
    if (!token) return;
    fetch(`${API_BASE_URL}/BlogPost/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify({ content:newComment })
    })
      .then(() => setNewComment(''))
      .then(() => {
        // reload comments with usernames
        return fetch(`${API_BASE_URL}/BlogPost/${id}/comments`);
      })
      .then(r => r.json())
      .then(async data => {
        const withUser = await Promise.all(data.map(async (c: any) => {
          const name = await fetch(`${API_BASE_URL}/users/${c.userId}/username`)
                            .then(r => r.ok ? r.text() : 'Unknown');
          return { ...c, userName: name||'Unknown' };
        }));
        setComments(withUser);
      });
  };

  if (!post) return <div>Loading…</div>;

  return (
    <div className="post-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>{post.title}</h2>
      <div className="post-meta">
        <span>Author: {author}</span>
        <span>Posted on {new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <div className="detail-actions">
        {token && <>
          <button disabled={voteStatus !== 'none'} onClick={() => handleVote(true)}>▲ Upvote</button>
          <button disabled={voteStatus !== 'none'} onClick={() => handleVote(false)}>▼ Downvote</button>
          <span style={{ margin: '0 12px', fontWeight: 600 }}>Score: {votes}</span>
          <button onClick={toggleSave}>
            {saved ? '★ Saved' : '☆ Save'}
          </button>
          <button onClick={handleReport}>⚠️ Report</button>
        </>}
      </div>
      <div className="post-content">{post.content}</div>
      {post.tags?.length > 0 && (
        <div className="post-tags">
          {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}
      <div className="comments-section">
        <h3>Comments</h3>
        {token && (
          <div className="add-comment-section">
            <textarea
              className="add-comment-textarea"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button
              className="add-comment-btn"
              onClick={handleAddComment}
            >Add Comment</button>
          </div>
        )}
        {comments.map(c => (
          <div key={c.id} className="comment-item">
            <b>{c.userName}:</b> {c.content}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <Link to="/blog">← Back to Blog</Link>
      </div>
    </div>
  );
}

export default PostDetail;
