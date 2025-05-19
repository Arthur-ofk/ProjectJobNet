import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import { logout } from '../slices/authSlice.ts';
import {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostDetailRequest,
  fetchPostDetailSuccess,
  fetchPostDetailFailure,
  createPostRequest,
  createPostSuccess,
  createPostFailure,
  votePostRequest,
  votePostSuccess,
  votePostFailure,
  savePostRequest,
  savePostSuccess,
  savePostFailure,
  fetchCommentsRequest,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure
} from '../slices/blogSlice.ts';
import { API_BASE_URL } from '../constants.ts';

// Fetch posts using dynamic loading with skip and take.
function* handleFetchPosts(action: ReturnType<typeof fetchPostsRequest>) {
  try {
    const { skip, take } = action.payload;
    const res: Response = yield call(fetch, `${API_BASE_URL}/BlogPost/paged?skip=${skip}&take=${take}`);
    if (res.status === 401) {
      yield put(logout());
      return;
    }
    if (!res.ok) throw new Error('Failed to load BlogPost');
    const text: string = yield call([res, res.text]);
    const data = text ? JSON.parse(text) : [];
    // Determine if there are more posts based on count.
    const hasMore = data.length === take;
    yield put(fetchPostsSuccess({ posts: data, skip, hasMore }));
  } catch (error: any) {
    yield put(fetchPostsFailure(error.message || 'Failed to load blog posts'));
  }
}

function* handleFetchPostDetail(action: ReturnType<typeof fetchPostDetailRequest>) {
  try {
    const { id } = action.payload;
    const res: Response = yield call(fetch, `${API_BASE_URL}/BlogPost/${id}`);
    if (res.status === 401) {
      yield put(logout());
      return;
    }
    if (!res.ok) throw new Error('Failed to load BlogPost detail');
    const text: string = yield call([res, res.text]);
    const data = text ? JSON.parse(text) : null;
    yield put(fetchPostDetailSuccess(data));
  } catch (error: any) {
    yield put(fetchPostDetailFailure(error.message || 'Failed to load blog post detail'));
  }
}

function* handleCreatePost(action: ReturnType<typeof createPostRequest>) {
  try {
    const token: string = yield select((s: any) => s.auth.token);
    if (!token) throw new Error('Authentication token is missing');

    const isForm = action.payload instanceof FormData;
    console.log('isForm', isForm);
    console.log('action.payload', action.payload);
    console.log('token', token);
    
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      ...(isForm ? {} : { 'Content-Type': 'application/json' })
    };
    const body = isForm
      ? action.payload
      : JSON.stringify(action.payload);
console.log('headers', headers); 
console.log('body', body);
    const res: Response = yield call(fetch, `${API_BASE_URL}/BlogPost`, {
      method: 'POST',
      headers,
      body
    });
    if (res.status === 401) {
      yield put(logout());
      return;
    }
    if (!res.ok) throw new Error('Failed to create blog post');
    const data = yield res.json();
    yield put(createPostSuccess(data));
  } catch (err: any) {
    yield put(createPostFailure(err.message));
  }
}

function* handleVotePost(action: ReturnType<typeof votePostRequest>) {
  try {
    const token: string = yield select((s: any) => s.auth.token);
    if (!token) {
      yield put(logout());
      return;
    }
    
    const { id, isUpvote } = action.payload;
    const userId: string = yield select((s: any) => s.auth.user.id);
    
    const res: Response = yield call(fetch, `${API_BASE_URL}/BlogPost/${id}/vote`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        userId: userId, 
        isUpvote: isUpvote 
      })
    });
    
    if (res.status === 401) {
      yield put(logout());
      return;
    }
    
    if (!res.ok) throw new Error('Failed to vote on post');
    
    // Parse the response to get the score
    const data = yield res.json();
    
    // Pass the score in the success action
    yield put(votePostSuccess({ 
      id, 
      isUpvote,
      score: data.score // Include the score from the server response
    }));
  } catch (err: any) {
    yield put(votePostFailure(err.message || 'Failed to vote on post'));
  }
}

function* handleSavePost(action: ReturnType<typeof savePostRequest>) {
  try {
    const token: string = yield select((s: any) => s.auth.token);
    if (!token) {
      yield put(logout());
      return;
    }
    
    const { id } = action.payload;
    const userId: string = yield select((s: any) => s.auth.user.id);
    
    // Log the exact payload we're sending to help with debugging
    const savedBlogPost = {
      blogPostId: id,
      userId: userId
    };
    console.log('Saving post with payload:', savedBlogPost);
    
    // Make the API request with proper headers and payload
    const res: Response = yield call(fetch, `${API_BASE_URL}/BlogPost/saved`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(savedBlogPost)
    });
    
    if (res.status === 401) {
      yield put(logout());
      return;
    }
    
    // More detailed error handling to diagnose issues
    if (!res.ok) {
      const errorText = yield call([res, 'text']);
      const errorDetail = `Status: ${res.status}, Message: ${errorText}`;
      console.error('Save post error details:', errorDetail);
      
      // Show more helpful error message to user
      throw new Error(`Failed to save post (${errorDetail}). Please try again.`);
    }
    
    yield put(savePostSuccess());
    
    // Visual feedback that post was saved
    const savedNotice = document.createElement('div');
    savedNotice.textContent = 'Post saved successfully!';
    savedNotice.style.position = 'fixed';
    savedNotice.style.bottom = '20px';
    savedNotice.style.right = '20px';
    savedNotice.style.background = '#28a745';
    savedNotice.style.color = 'white';
    savedNotice.style.padding = '10px 20px';
    savedNotice.style.borderRadius = '4px';
    savedNotice.style.zIndex = '1000';
    document.body.appendChild(savedNotice);
    
    setTimeout(() => {
      document.body.removeChild(savedNotice);
    }, 3000);
    
  } catch (err: any) {
    console.error("Save post error:", err);
    yield put(savePostFailure(err.message || 'Failed to save post'));
    
    // Show error toast
    const errorToast = document.createElement('div');
    errorToast.textContent = err.message || 'Failed to save post';
    errorToast.style.position = 'fixed';
    errorToast.style.bottom = '20px';
    errorToast.style.right = '20px';
    errorToast.style.background = '#dc3545';
    errorToast.style.color = 'white';
    errorToast.style.padding = '10px 20px';
    errorToast.style.borderRadius = '4px';
    errorToast.style.zIndex = '1000';
    document.body.appendChild(errorToast);
    
    setTimeout(() => {
      document.body.removeChild(errorToast);
    }, 3000);
  }
}

function* handleFetchComments(action: ReturnType<typeof fetchCommentsRequest>) {
  try {
    const { postId } = action.payload;
    const res: Response = yield call(fetch, `${API_BASE_URL}/BlogPost/${postId}/comments`);
    
    if (!res.ok) throw new Error('Failed to fetch comments');
    
    const comments = yield res.json();
    
    // Fetch usernames for comments
    const commentsWithUsernames = yield call(async () => {
      return await Promise.all(comments.map(async (c: any) => {
        const name = await fetch(`${API_BASE_URL}/users/${c.userId}/username`)
                        .then(r => r.ok ? r.text() : 'Unknown');
        return { ...c, userName: name || 'Unknown' };
      }));
    });
    
    yield put(fetchCommentsSuccess({ postId, comments: commentsWithUsernames }));
  } catch (err: any) {
    yield put(fetchCommentsFailure(err.message || 'Failed to fetch comments'));
  }
}

function* handleAddComment(action: ReturnType<typeof addCommentRequest>) {
  try {
    const token: string = yield select((s: any) => s.auth.token);
    if (!token) {
      yield put(logout());
      return;
    }
    
    const { postId, content } = action.payload;
    const res: Response = yield call(fetch, `${API_BASE_URL}/BlogPost/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content })
    });
    
    if (res.status === 401) {
      yield put(logout());
      return;
    }
    
    if (!res.ok) throw new Error('Failed to add comment');
    
    yield put(addCommentSuccess());
    // Re-fetch comments after adding a new one
    yield put(fetchCommentsRequest({ postId }));
  } catch (err: any) {
    yield put(addCommentFailure(err.message || 'Failed to add comment'));
  }
}

export function* watchBlog() {
  yield takeLatest(fetchPostsRequest.type, handleFetchPosts);
  yield takeLatest(fetchPostDetailRequest.type, handleFetchPostDetail);
  yield takeLatest(createPostRequest.type, handleCreatePost);
  yield takeEvery(votePostRequest.type, handleVotePost);
  yield takeEvery(savePostRequest.type, handleSavePost);
  yield takeEvery(fetchCommentsRequest.type, handleFetchComments);
  yield takeEvery(addCommentRequest.type, handleAddComment);
}
