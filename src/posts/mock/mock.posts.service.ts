export const mockPostsService = () => ({
  createPost: jest.fn(),
  getAllPostsCount: jest.fn(),
  getAllPosts: jest.fn(),
  getPostById: jest.fn(),
  updatePostById: jest.fn(),
  deletePostById: jest.fn(),
  getAllCommentsByPostId: jest.fn(),
  getCommentsCountByPostId: jest.fn(),
});
