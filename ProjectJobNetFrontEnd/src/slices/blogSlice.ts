import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  likes: number;
  tags: string[];
  createdAt: string;
  userId: string;
  authorName?: string;
  authorPicUrl?: string;
  imageData?: string;
  imageContentType?: string;
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
    createPostRequest(state, action: PayloadAction<FormData>) {
      state.loading = true;
      state.error = null;
    },
    createPostSuccess(state, action: PayloadAction<BlogPost>) {
      state.posts = [action.payload, ...state.posts];
      state.loading = false;
    },
    createPostFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    votePostRequest(state, action: PayloadAction<{ id: string, isUpvote: boolean }>) {
      state.loading = true;
      state.error = null;
    },
    votePostSuccess(state, action: PayloadAction<{ id: string, isUpvote: boolean, score?: number }>) {
      state.loading = false;
      const post = state.posts.find(p => p.id === action.payload.id);
      if (post) {
        if (action.payload.score !== undefined) {
          post.upvotes = action.payload.score;
          post.downvotes = 0;
        } else {
          if (action.payload.isUpvote) {
            post.upvotes++;
          } else {
            post.downvotes++;
          }
        }
      }
      
      if (state.currentPost && state.currentPost.id === action.payload.id) {
        if (action.payload.score !== undefined) {
          state.currentPost.upvotes = action.payload.score;
          state.currentPost.downvotes = 0;
        } else {
          if (action.payload.isUpvote) {
            state.currentPost.upvotes++;
          } else {
            state.currentPost.downvotes++;
          }
        }
      }
    },
    votePostFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    savePostRequest(state, action: PayloadAction<{ id: string }>) {
      state.loading = true;
      state.error = null;
    },
    savePostSuccess(state) {
      state.loading = false;
    },
    savePostFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCommentsRequest(state, action: PayloadAction<{ postId: string }>) {
      state.loading = true;
      state.error = null;
    },
    fetchCommentsSuccess(state, action: PayloadAction<{ postId: string, comments: any[] }>) {
      state.loading = false;
    },
    fetchCommentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addCommentRequest(state, action: PayloadAction<{ postId: string, content: string }>) {
      state.loading = true;
      state.error = null;
    },
    addCommentSuccess(state) {
      state.loading = false;
    },
    addCommentFailure(state, action: PayloadAction<string>) {
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
} = blogSlice.actions;
export default blogSlice.reducer;
