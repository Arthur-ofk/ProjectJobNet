import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.ts';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants.ts';
import {
  fetchPostsRequest,
  resetPosts,
  createPostRequest,
  votePostRequest,
  savePostRequest
} from '../slices/blogSlice.ts';
import { logout } from '../slices/authSlice.ts';
import './BlogSection.css';

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
	imageData?: string;
	imageContentType?: string;
};

function BlogSection() {
	const dispatch = useDispatch();
	const { posts, loading, error, skip, hasMore } = useSelector((state: RootState) => state.blog);
	const { token, user } = useSelector((state: RootState) => state.auth);
	const loader = useRef<HTMLDivElement>(null);
	const limit = 10;
	const navigate = useNavigate();
  
	const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
	const [showCreatePost, setShowCreatePost] = useState(false);
	const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
	const [creating, setCreating] = useState(false);
	const [newPostImage, setNewPostImage] = useState<File | null>(null);
  
	// initial load
	useEffect(() => {
		dispatch(resetPosts());
		dispatch(fetchPostsRequest({ skip: 0, take: limit }));
	}, [dispatch, limit]);
  
	// infinite scroll
	useEffect(() => {
		if (loading || !hasMore) return;
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				dispatch(fetchPostsRequest({ skip: skip + limit, take: limit }));
			}
		}, { threshold: 1 });
		if (loader.current) obs.observe(loader.current);
		return () => loader.current && obs.unobserve(loader.current);
	}, [loading, hasMore, skip, dispatch]);
  
	// quick actions
	const doVote = (id: string, up: boolean) => {
		if (!token) return navigate('/login');
		dispatch(votePostRequest({ id, isUpvote: up }));
	};
  
	const doSave = (id: string) => {
		if (!token) return navigate('/login');
		dispatch(savePostRequest({ id }));
	};
  
	const doReport = (id: string) => {
		if (!token) return navigate('/login');
		const reason = prompt('Reason for report?') || '';
		fetch(`${API_BASE_URL}/BlogPost/${id}/report`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify({ description: reason })
		});
	};
  
	const handleCreatePost = async (e: React.FormEvent) => {
		e.preventDefault();
		const form = new FormData();
		form.append('Title', newPost.title);
		form.append('Content', newPost.content);
		form.append('UserId', user.id);
		form.append('Tags', newPost.tags);
		if (newPostImage) form.append('Image', newPostImage);
		dispatch(createPostRequest(form));
	};
  
	return (
		<div className="blog-section">
			<h2>Blog Posts</h2>
			{error && <div className="error">{error}</div>}
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
					<input
						type="file"
						accept="image/*"
						onChange={e => setNewPostImage(e.target.files?.[0] || null)}
						style={{ marginBottom: 8 }}
					/>
					<button type="submit" disabled={creating} style={{ padding: '8px 16px', background: '#245ea0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
						{creating ? 'Posting...' : 'Post'}
					</button>
				</form>
			)}
			{/* Render blog posts */}
			{posts.map(post => (
				<div
					key={post.id}
					className="post-preview"
					style={{ cursor: 'pointer' }}
					onClick={() => navigate(`/posts/${post.id}`)}
				>
					<div className="post-preview-content">
						<h4>{post.title}</h4>
						<p>{post.content.substring(0, 100)}...</p>
						<div className="meta">
							<span>Votes: {(post.likes ?? 0) - (post.comments ?? 0)}</span>
						</div>
					</div>

					{/* Add image display */}
					{post.imageData && (
						<div className="post-preview-image">
							<img 
								src={`data:${post.imageContentType || 'image/jpeg'};base64,${post.imageData}`}
								alt="Post thumbnail"
							/>
						</div>
					)}
					
					<div className="actions">
						<button onClick={e => { 
							e.stopPropagation(); 
							doVote(post.id, true); 
						}}>▲</button>
						<button onClick={e => { 
							e.stopPropagation(); 
							doVote(post.id, false); 
						}}>▼</button>
						<button className="comment-btn" onClick={e => { 
							e.stopPropagation(); 
							navigate(`/posts/${post.id}`); 
						}}>💬</button>
						<button onClick={e => { e.stopPropagation(); doSave(post.id); }}>💾</button>
						<button onClick={e => { e.stopPropagation(); doReport(post.id); }}>⚠️</button>
					</div>
				</div>
			))}
			<div ref={loader} className="loader">{loading ? 'Loading…' : hasMore ? 'Scroll to load more' : 'No more posts'}</div>
		</div>
	);
}

export default BlogSection;
