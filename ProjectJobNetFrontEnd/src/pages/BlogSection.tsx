import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';
import { fetchPostsRequest, createPostRequest } from '../slices/blogSlice.ts';

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
	const dispatch = useDispatch();
	// Use unified blog state
	const { posts, loading, error } = useSelector((state: RootState) => state.blog);
	const { token, user } = useSelector((state: RootState) => state.auth);
	const [page, setPage] = useState(1);
	const limit = 10;
	const navigate = useNavigate();
  
	const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
	const [showCreatePost, setShowCreatePost] = useState(false);
	const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
	const [newPostImage, setNewPostImage] = useState<File | null>(null);
	const [creating, setCreating] = useState(false);
  
	useEffect(() => {
		// Correctly calculate skip and take
		const skip = (page - 1) * limit;
		dispatch(fetchPostsRequest({ skip, take: limit }));
	}, [page, dispatch]);
  
	const sortedPosts = [...posts].sort((a, b) => {
		if (activeTab === 'popular') return b.likes - a.likes;
		else return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});
  
	// Fixed: using top-level 'user' from state instead of calling useSelector in the handler.
	const handleCreatePost = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('Title', newPost.title);
		formData.append('Content', newPost.content);
		formData.append('Tags', newPost.tags);
		formData.append('UserId', user ? user.id : '');
		if (newPostImage) {
			formData.append('Image', newPostImage);
		}
		dispatch(createPostRequest(formData));
	};
  
	return (
		<div style={{ padding: 16, background: '#fff', borderRadius: 16, margin: '16px 0' }}>
			<h2>Blog Posts</h2>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			{loading && <div>Loading...</div>}
			{/* Tabs and Create button */}
			<div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
				<button onClick={() => setActiveTab('popular')} style={{ background: activeTab === 'popular' ? '#245ea0' : '#eaf4fb', color: activeTab === 'popular' ? '#fff' : '#245ea0', padding: '8px 16px', border: 'none', borderRadius: 6 }}>
					Popular
				</button>
				<button onClick={() => setActiveTab('recent')} style={{ background: activeTab === 'recent' ? '#245ea0' : '#eaf4fb', color: activeTab === 'recent' ? '#fff' : '#245ea0', padding: '8px 16px', border: 'none', borderRadius: 6 }}>
					Recent
				</button>
				<button onClick={() => setShowCreatePost(prev => !prev)} style={{ background: '#28a745', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 6 }}>
					{showCreatePost ? 'Cancel' : 'Create Post'}
				</button>
			</div>
			{/* New Post Creation Section */}
			{showCreatePost && (
				<form onSubmit={handleCreatePost} style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
					<h3>Create a Blog Post</h3>
					<input type="text" placeholder="Title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />
					<textarea placeholder="Content" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} required style={{ width: '100%', padding: 8, marginBottom: 8, height: 100 }} />
					<input type="text" placeholder="Tags (comma separated)" value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
					<input type="file" accept="image/*" onChange={e => setNewPostImage(e.target.files ? e.target.files[0] : null)} style={{ marginBottom: 8 }} />
					<button type="submit" disabled={creating} style={{ padding: '8px 16px', background: '#245ea0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
						{creating ? 'Posting...' : 'Post'}
					</button>
				</form>
			)}
			{/* Render blog posts */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
				{sortedPosts.map(post => (
					<div key={post.id} style={{ padding: 16, background: '#eaf4fb', borderRadius: 8, cursor: 'pointer' }} onClick={() => navigate(`/posts/${post.id}`)}>
						<h4>{post.title}</h4>
						<p>{post.content.substring(0, 100)}...</p>
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
