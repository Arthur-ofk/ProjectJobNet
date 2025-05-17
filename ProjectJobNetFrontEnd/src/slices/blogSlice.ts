import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BlogPost = {
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

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  skip: number;
  hasMore: boolean;
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  skip: 0,
  hasMore: true,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // List actions using skip/take
    fetchPostsRequest(state, action: PayloadAction<{ skip: number; take: number }>) {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess(state, action: PayloadAction<{ posts: BlogPost[]; skip: number; hasMore: boolean }>) {
      if (action.payload.skip === 0) {
        state.posts = action.payload.posts;
      } else {
        state.posts = [...state.posts, ...action.payload.posts];
      }
      state.skip = action.payload.skip;
      state.hasMore = action.payload.hasMore;
      state.loading = false;
    },
    fetchPostsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPosts(state) {
      state.posts = [];
      state.skip = 0;
      state.hasMore = true;
      state.error = null;
      state.loading = false;
    },
    // Detail actions
    fetchPostDetailRequest(state, action: PayloadAction<{ id: string }>) {
      state.loading = true;
      state.error = null;
    },
    fetchPostDetailSuccess(state, action: PayloadAction<BlogPost>) {
      state.currentPost = action.payload;
      state.loading = false;
    },
    fetchPostDetailFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPostDetail(state) {
      state.currentPost = null;
      state.error = null;
      state.loading = false;
    },
    // Create post actions (payload is FormData)
    createPostRequest(state, action: PayloadAction<FormData>) {
      state.loading = true;
      state.error = null;
    },
    createPostSuccess(state, action: PayloadAction<BlogPost>) {
      // Prepend new post
      state.posts = [action.payload, ...state.posts];
      state.loading = false;
    },
    createPostFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  resetPosts,
  fetchPostDetailRequest,
  fetchPostDetailSuccess,
  fetchPostDetailFailure,
  resetPostDetail,
  createPostRequest,
  createPostSuccess,
  createPostFailure
} = blogSlice.actions;
export default blogSlice.reducer;
