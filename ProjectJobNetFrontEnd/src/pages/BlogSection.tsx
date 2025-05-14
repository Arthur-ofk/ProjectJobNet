import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants.ts';
import InfoCard from '../components/InfoCard.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';
import { useNavigate } from 'react-router-dom';

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
};

function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
  const { token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/posts`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (activeTab === 'popular') return b.likes - a.likes;
    else return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;
    setCreating(true);
    const tagsArray = newPost.tags.split(',').map(t => t.trim());
    const postData = { ...newPost, tags: tagsArray, userId: user.id };
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(postData)
    });
    if (res.ok) {
      // Refresh posts after creation
      fetch(`${API_BASE_URL}/posts`)
        .then(res => res.json())
        .then(data => setPosts(data));
      setNewPost({ title: '', content: '', tags: '' });
    } else {
      alert('Failed to create post.');
    }
    setCreating(false);
  };

  return (
    <div style={{ padding: 16, background: '#fff', borderRadius: 16, margin: '16px 0' }}>
      <h2>Blog Posts</h2>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <button onClick={() => setActiveTab('popular')} style={{ background: activeTab==='popular' ? '#245ea0' : '#eaf4fb', color: activeTab==='popular' ? '#fff' : '#245ea0', padding: '8px 16px', border: 'none', borderRadius: 6 }}>Popular</button>
        <button onClick={() => setActiveTab('recent')} style={{ background: activeTab==='recent' ? '#245ea0' : '#eaf4fb', color: activeTab==='recent' ? '#fff' : '#245ea0', padding: '8px 16px', border: 'none', borderRadius: 6 }}>Recent</button>
      </div>
      {/* Create Post Form */}
      {token && (
        <form onSubmit={handleCreatePost} style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <h3>Create a Blog Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={e => setNewPost({ ...newPost, title: e.target.value })}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
            required 
          />
          <textarea
            placeholder="Content"
            value={newPost.content}
            onChange={e => setNewPost({ ...newPost, content: e.target.value })}
            style={{ width: '100%', padding: 8, marginBottom: 8, height: 100 }}
            required 
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newPost.tags}
            onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
          />
          <button type="submit" disabled={creating} style={{ padding: '8px 16px', background: '#245ea0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            {creating ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}
      {/* Posts List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {sortedPosts.map(post => (
          <div key={post.id} style={{ padding: 16, background: '#eaf4fb', borderRadius: 8, cursor: 'pointer' }} onClick={() => navigate(`/posts/${post.id}`)}>
            <h4>{post.title}</h4>
            <p>{post.content.substring(0,100)}...</p>
            <div style={{ fontSize: '0.9rem', color: '#555' }}>
              <span>👍 {post.likes}</span> • <span>💬 {post.comments}</span>
            </div>
            {post.tags && (
              <div style={{ marginTop: 4 }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ background: '#fff', padding: '2px 6px', marginRight: 4, borderRadius: 4, fontSize: '0.8rem' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogSection;
