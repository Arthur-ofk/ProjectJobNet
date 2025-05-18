import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  likes: number;  // For backwards compatibility
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
    },
    // Post voting actions
    votePostRequest(state, action: PayloadAction<{ id: string, isUpvote: boolean }>){
      state.loading = true;
      state.error = null;
    },
    votePostSuccess(state, action: PayloadAction<{ id: string, isUpvote: boolean, score?: number }>){
      state.loading = false;
      // Update post votes in current posts array if it exists
      const post = state.posts.find(p => p.id === action.payload.id);
      if (post) {
        // If score is provided by server, use it directly
        if (action.payload.score !== undefined) {
          post.upvotes = action.payload.score;  // Set the upvotes to the score
          post.downvotes = 0;  // Reset downvotes as we're using the score directly
        } else {
          // Fallback to old behavior
          if (action.payload.isUpvote) {
            post.upvotes++;
          } else {
            post.downvotes++;
          }
        }
      }
      
      // Update currentPost if that's what was voted on
      if (state.currentPost && state.currentPost.id === action.payload.id) {
        // If score is provided, use it directly
        if (action.payload.score !== undefined) {
          state.currentPost.upvotes = action.payload.score;  // Set the upvotes to the score
          state.currentPost.downvotes = 0;  // Reset downvotes as we're using the score directly
        } else {
          // Fallback to old behavior
          if (action.payload.isUpvote) {
            state.currentPost.upvotes++;
          } else {
            state.currentPost.downvotes++;
          }
        }
      }
    },
    votePostFailure(state, action: PayloadAction<string>){
      state.loading = false;
      state.error = action.payload;
    },
    
    // Post saving actions
    savePostRequest(state, action: PayloadAction<{ id: string }>){
      state.loading = true;
      state.error = null;
    },
    savePostSuccess(state){
      state.loading = false;
    },
    savePostFailure(state, action: PayloadAction<string>){
      state.loading = false;
      state.error = action.payload;
    },
    
    // Post comments actions
    fetchCommentsRequest(state, action: PayloadAction<{ postId: string }>){
      state.loading = true;
      state.error = null;
    },
    fetchCommentsSuccess(state, action: PayloadAction<{ postId: string, comments: any[] }>){
      state.loading = false;
      // We could store comments in the state if needed
    },
    fetchCommentsFailure(state, action: PayloadAction<string>){
      state.loading = false;
      state.error = action.payload;
    },
    addCommentRequest(state, action: PayloadAction<{ postId: string, content: string }>){
      state.loading = true;
      state.error = null;
    },
    addCommentSuccess(state){
      state.loading = false;
    },
    addCommentFailure(state, action: PayloadAction<string>){
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
