import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { API_BASE_URL } from '../constants.ts';
import { 
  fetchPostDetailRequest, 
  votePostRequest, 
  savePostRequest,
  fetchCommentsRequest,
  addCommentRequest
} from '../slices/blogSlice.ts';
import { logout } from '../slices/authSlice.ts'; // Fix: import logout from authSlice instead
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost: post, loading, error } = useSelector((s: RootState) => s.blog);
  const { token, user } = useSelector((s: RootState) => s.auth);
  const [newComment, setNewComment] = useState('');
  const [votes, setVotes] = useState(0);
  const [saved, setSaved] = useState(false);
  const [voteStatus, setVoteStatus] = useState<'none' | 'up' | 'down'>('none');
  const [comments, setComments] = useState<any[]>([]);
  const [author, setAuthor] = useState<string>('Loading...');

  // Load post details when the component mounts or id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchPostDetailRequest({ id }));
      dispatch(fetchCommentsRequest({ postId: id }));
      
      // Check saved state if user is logged in
      if (token && user) {
        // Use the correct endpoint for checking saved status
        fetch(`${API_BASE_URL}/BlogPost/saved`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(r => r.ok ? r.json() : [])
          .then(savedPosts => {
            // Check if current post is in the saved posts array
            const isSaved = savedPosts.some((post: any) => post.id === id);
            setSaved(isSaved);
          })
          .catch(() => setSaved(false));
      }
      
      // Check vote status if user is logged in
      if (token && user) {
        fetch(`${API_BASE_URL}/BlogPost/${id}/vote`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(r => {
            if (r.status === 401) {
              console.error("Unauthorized access to vote status");
              return null;
            }
            return r.ok ? r.json() : null;
          })
          .then(v => {
            if (v && v.voted) {
              setVoteStatus(v.isUpvote ? 'up' : 'down');
            } else {
              setVoteStatus('none');
            }
          })
          .catch(() => setVoteStatus('none'));
      }
    }
  }, [id, token, user, dispatch]);

  // Update local state when post is loaded
  useEffect(() => {
    if (post) {
      setVotes((post.upvotes ?? 0) - (post.downvotes ?? 0));
      
      // Fetch author name
      fetch(`${API_BASE_URL}/users/${post.userId}/username`)
        .then(r => r.ok ? r.text() : 'Unknown')
        .then(setAuthor)
        .catch(err => {
          console.error("Error fetching author:", err);
          setAuthor("Unknown");
        });
        
      // Load comments with better error handling
      console.log(`Fetching comments for post ${id}`);
      fetch(`${API_BASE_URL}/BlogPost/${id}/comments`)
        .then(r => {
          console.log(`Comments response status: ${r.status}`);
          if (!r.ok) {
            return r.text().then(errorText => {
              console.error(`Error response body: ${errorText}`);
              throw new Error(`Comments fetch failed with status ${r.status}: ${errorText}`);
            });
          }
          return r.json();
        })
        .then(data => {
          console.log(`Received comments:`, data);
          // Handle case where the server returns null instead of an array
          if (!data) {
            setComments([]);
            return;
          }
          
          // Ensure we're handling an array
          const commentsArray = Array.isArray(data) ? data : [data];
          
          Promise.all(commentsArray.map(async (c) => {
            try {
              const name = await fetch(`${API_BASE_URL}/users/${c.userId}/username`)
                .then(r => r.ok ? r.text() : 'Unknown')
                .catch(() => 'Unknown');
              return { ...c, userName: name || 'Unknown' };
            } catch (err) {
              console.error("Error fetching username:", err);
              return { ...c, userName: 'Unknown' };
            }
          })).then(withUser => {
            setComments(withUser);
          });
        })
        .catch(err => {
          console.error("Error loading comments:", err);
          setComments([]);
        });
    }
  }, [post, id]);

  // Fix vote toggling to work consistently with multiple clicks
  const handleVotePost = (up: boolean) => {
    if (!token || !id || !user) {
      alert("You must be logged in to vote");
      navigate('/login');
      return;
    }
    
    // Determine the new vote status based on current status and button clicked
    let newVoteStatus;
    if ((up && voteStatus === 'up') || (!up && voteStatus === 'down')) {
      // Clicking same button again - remove vote
      newVoteStatus = 'none';
    } else {
      // Casting new vote or changing vote
      newVoteStatus = up ? 'up' : 'down';
    }
    
    // Determine the action - remove vote, change vote, or add vote
    const requestMethod = newVoteStatus === 'none' ? 'DELETE' : 'POST';
    
    // Make the API call
    fetch(`${API_BASE_URL}/BlogPost/${id}/vote`, {
      method: requestMethod,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        userId: user.id, 
        isUpvote: up 
      })
    })
    .then(response => {
      if (response.status === 401) {
        dispatch(logout());
        navigate('/login');
        throw new Error('Your session has expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error(`Vote operation failed: ${response.status}`);
      }
      
      // Update UI immediately
      setVoteStatus(newVoteStatus);
      
      // Get updated score
      return fetch(`${API_BASE_URL}/BlogPost/${id}/score`);
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to get updated score');
      return response.json();
    })
    .then(data => {
      // Update the votes with the actual score from server
      setVotes(data.score);
    })
    .catch(err => {
      console.error("Error with voting operation:", err);
      alert(`Error: ${err.message}`);
    });
  };

  // Handle save toggle with correct endpoint and parameters
  const toggleSave = () => {
    if (!token || !id || !user) return;
    
    if (saved) {
      // Unsave post - use URL parameters with DELETE request
      fetch(`${API_BASE_URL}/BlogPost/saved?blogPostId=${id}&userId=${user.id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Unsave operation failed: ${response.status}`);
        }
        setSaved(false);
      })
      .catch(err => {
        console.error("Error unsaving post:", err);
        alert("Failed to unsave post. Please try again later.");
      });
    } else {
      // Save post - use POST with body
      fetch(`${API_BASE_URL}/BlogPost/saved`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blogPostId: id, userId: user.id })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Save operation failed: ${response.status}`);
        }
        setSaved(true);
      })
      .catch(err => {
        console.error("Error saving post:", err);
        alert("Failed to save post. Please try again later.");
      });
    }
  };

  // Handle reporting
  const handleReport = () => {
    if (!token || !id) return;
    const reason = prompt('Report reason') || '';
    fetch(`${API_BASE_URL}/BlogPost/${id}/report`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body:JSON.stringify({ description: reason })
    });
  };

  // Handle adding comment with better error handling
  const handleAddComment = () => {
    if (!token || !id || !newComment.trim() || !user) return;
    
    fetch(`${API_BASE_URL}/BlogPost/${id}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        postId: id,
        content: newComment 
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Adding comment failed with status ${response.status}`);
      }
      setNewComment('');
      
      // Reload comments
      return fetch(`${API_BASE_URL}/BlogPost/${id}/comments`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Fetching comments failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(async data => {
      if (!Array.isArray(data)) {
        setComments([]);
        return;
      }
      
      const withUser = await Promise.all(data.map(async (c: any) => {
        const name = await fetch(`${API_BASE_URL}/users/${c.userId}/username`)
          .then(r => r.ok ? r.text() : 'Unknown')
          .catch(() => 'Unknown');
        return { ...c, userName: name || 'Unknown' };
      }));
      setComments(withUser);
    })
    .catch(err => {
      console.error("Error with comment operation:", err);
      alert("Failed to add comment. Please try again later.");
    });
  };

  // Handle back button to maintain scroll position
  const handleBackClick = () => {
    navigate(-1); // Use browser history to go back
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found</div>;

  return (
    <div className="post-detail-container">
      {/* Single back button */}
      <button className="back-btn" onClick={handleBackClick}>← Back</button>
      
      <h2>{post.title}</h2>
      <div className="post-meta">
        <span>Author: {author}</span>
        <span>Posted on {new Date(post.createdAt).toLocaleString()}</span>
      </div>
      
      {/* Display post image first if available */}
      {post.imageData && (
        <div className="post-image-container">
          <img 
            src={`data:${post.imageContentType || 'image/jpeg'};base64,${post.imageData}`}
            alt="Post image"
            className="post-image"
          />
        </div>
      )}
      
      {/* Content and actions below the image */}
      <div className="post-content">{post.content}</div>
      
      <div className="detail-actions">
        {token && <>
          <button 
            className={`vote-button upvote ${voteStatus === 'up' ? 'active' : ''}`}
            onClick={() => handleVotePost(true)}
          >
            <span className="vote-icon">▲</span>
            <span className="vote-text">Upvote</span>
          </button>
          <button 
            className={`vote-button downvote ${voteStatus === 'down' ? 'active' : ''}`}
            onClick={() => handleVotePost(false)}
          >
            <span className="vote-icon">▼</span>
            <span className="vote-text">Downvote</span>
          </button>
          <span className="vote-score">Score: {votes}</span>
          <button 
            className={`action-button save-btn ${saved ? 'active' : ''}`}
            onClick={toggleSave}
          >
            <span className="action-icon">{saved ? '★' : '☆'}</span>
            <span className="action-text">{saved ? 'Saved' : 'Save'}</span>
          </button>
          <button 
            className="action-button report-btn"
            onClick={handleReport}
          >
            <span className="action-icon">⚠️</span>
            <span className="action-text">Report</span>
          </button>
        </>}
      </div>
      
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
              placeholder="Write a comment..."
            />
            <button
              className="add-comment-btn"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Add Comment
            </button>
          </div>
        )}
        <div className="comment-list">
          {comments.length === 0 && <div className="no-comments">No comments yet. Be the first to comment!</div>}
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar">
                <img
                  src={`https://i.pravatar.cc/40?u=${c.userId}`}
                  alt="User avatar"
                />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <a href={`/users/${c.userId}`} className="comment-username">
                    {c.userName}
                  </a>
                  <span className="comment-date">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="comment-text">{c.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <Link to="/blog">← Back to Blog</Link>
      </div>
    </div>
  );
}

export default PostDetail;
