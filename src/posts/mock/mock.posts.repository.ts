export const mockPostsRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue([]),
    getOne: jest.fn(),
  }),
  findOne: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  delete: jest.fn(),
});
