import { call, put, takeLatest, select } from 'redux-saga/effects';
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
  createPostFailure
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

export function* watchBlog() {
  yield takeLatest(fetchPostsRequest.type, handleFetchPosts);
  yield takeLatest(fetchPostDetailRequest.type, handleFetchPostDetail);
  yield takeLatest(createPostRequest.type, handleCreatePost);
}
