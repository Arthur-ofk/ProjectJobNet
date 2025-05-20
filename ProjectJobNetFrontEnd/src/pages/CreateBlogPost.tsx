import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store.ts';
import { API_BASE_URL } from '../constants.ts';
import BlogPostForm from '../components/blogs/BlogPostForm.tsx';
import './CreateBlogPost.css';

const CreateBlogPost: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (blogData: any) => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/BlogPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...blogData,
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }

      // Navigate to blog posts list or view the new post
      navigate('/blogs');
    } catch (err: any) {
      setError(err.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <div className="create-blog-header">
        <h2>Create New Blog Post</h2>
        <p>Share your thoughts and insights with the community</p>
      </div>
      
      <BlogPostForm
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Publish Post"
        onCancel={() => navigate('/blogs')}
      />
    </div>
  );
};

export default CreateBlogPost;
