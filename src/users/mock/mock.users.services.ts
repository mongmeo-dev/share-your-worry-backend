export const mockUsersServices = () => ({
  join: jest.fn(),
  getCurrentUserInfo: jest.fn(),
  updateCurrentUser: jest.fn(),
  logoutAndDeleteCurrentUser: jest.fn(),
  getAllPostsByUserId: jest.fn(),
});
