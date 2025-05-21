import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogPostCard.css';
import { BlogPost } from '../../slices/blogSlice.ts';

interface BlogPostCardProps {
  post: BlogPost;
  onVote?: (e: React.MouseEvent, postId: string, isUpvote: boolean) => void;
  onSave?: (e: React.MouseEvent, postId: string) => void;
  onComment?: (e: React.MouseEvent, postId: string) => void;
  userVoteStatus?: 'up' | 'down' | 'none';
  isSaved?: boolean;
}

// SVG Icon Components
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

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  onVote,
  onSave,
  onComment,
  userVoteStatus = 'none',
  isSaved = false
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <div className="blog-post-card" onClick={handleCardClick}>
      {post.imageData && (
        <div className="blog-post-card-image">
          <img 
            src={`data:${post.imageContentType || 'image/jpeg'};base64,${post.imageData}`}
            alt={post.title}
          />
        </div>
      )}
      
      <div className="blog-post-card-content">
        <h4>{post.title}</h4>
        <p>{post.content.substring(0, 100)}...</p>
      </div>
      
      <div className="blog-post-card-footer">
        <div className="blog-post-card-actions">
          {onVote && (
            <>
              <button 
                className={`vote-button ${userVoteStatus === 'up' ? 'active-up' : ''}`}
                onClick={(e) => onVote(e, post.id, true)}
                aria-label="Upvote"
              >
                <UpArrowIcon />
              </button>
              <span className="vote-score">
                {(post.upvotes || 0) - (post.downvotes || 0)}
              </span>
              <button 
                className={`vote-button ${userVoteStatus === 'down' ? 'active-down' : ''}`}
                onClick={(e) => onVote(e, post.id, false)}
                aria-label="Downvote"
              >
                <DownArrowIcon />
              </button>
            </>
          )}
          
          {onComment && (
            <button 
              className="action-button"
              onClick={(e) => onComment(e, post.id)}
              aria-label="Comment"
            >
              <CommentIcon />
            </button>
          )}
          
          {onSave && (
            <button 
              className={`action-button ${isSaved ? 'saved' : ''}`}
              onClick={(e) => onSave(e, post.id)}
              aria-label="Save"
            >
              <BookmarkIcon />
            </button>
          )}
        </div>
        
        <div className="blog-post-card-meta">
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
