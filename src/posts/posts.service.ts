import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { Repository } from 'typeorm';
import { PostCreateDto } from './dto/post-create.dto';
import { UserEntity } from '../users/entity/user.entity';
import { Utils } from '../common/utils';
import { PostResponseDto } from './dto/post-response.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { CommentEntity } from '../comments/entity/comment.entity';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { CategoryEntity } from '../categories/entity/category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity) private readonly postsRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity) private readonly commentsRepository: Repository<CommentEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    private readonly utils: Utils,
  ) {}

  async createPost(
    loggedInUser: UserEntity,
    postCreateDto: PostCreateDto,
  ): Promise<PostResponseDto> {
    await this.validateCategoryId(postCreateDto.category.id);

    const newPost = await this.postsRepository.create(postCreateDto);
    newPost.author = loggedInUser;
    const savedPost = await this.postsRepository.save(newPost);

    return this.utils.postEntityToPostResponseDto(savedPost);
  }

  async getAllPostsCount(): Promise<number> {
    return await this.postsRepository.count();
  }

  async getAllPosts(page, itemSize): Promise<PostResponseDto[]> {
    const postsQuery = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category');

    let posts: PostEntity[];

    if (page === 0 || itemSize === 0) {
      posts = await postsQuery.getMany();
    } else if (page > 0 && itemSize > 0) {
      posts = await postsQuery
        .skip((page - 1) * itemSize)
        .take(itemSize)
        .getMany();
    } else {
      throw new BadRequestException('쿼리 파라미터는 양수 또는 0이어야 합니다.');
    }

    return posts.map((post) => this.utils.postEntityToPostResponseDto(post));
  }

  async getPostById(id: number): Promise<PostResponseDto> {
    const post = await this.getPostByIdOrThrow404(id);
    return this.utils.postEntityToPostResponseDto(post);
  }

  async updatePostById(
    id: number,
    loggedInUser: UserEntity,
    postUpdateDto: PostUpdateDto,
  ): Promise<PostResponseDto> {
    const post = await this.getPostByIdOrThrow404(id);

    this.isAuthor(loggedInUser, post);

    await this.validateCategoryId(postUpdateDto.category.id);

    const updatedPost = { ...post, ...postUpdateDto };
    const savedPost = await this.postsRepository.save(updatedPost);
    return this.utils.postEntityToPostResponseDto(savedPost);
  }

  async deletePostById(id: number, loggedInUser: UserEntity): Promise<void> {
    const post = await this.getPostByIdOrThrow404(id);

    this.isAuthor(loggedInUser, post);

    await this.postsRepository.delete({ id });
  }

  async getAllCommentsByPostId(
    id: number,
    page: number,
    itemSize: number,
  ): Promise<CommentResponseDto[]> {
    await this.validatePostId(id);

    const commentsQuery = this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.post = :id', { id });

    let comments: CommentEntity[];

    if (page === 0 || itemSize === 0) {
      comments = await commentsQuery.getMany();
    } else if (page > 0 && itemSize > 0) {
      comments = await commentsQuery
        .skip((page - 1) * itemSize)
        .take(itemSize)
        .getMany();
    } else {
      throw new BadRequestException('페이지, 아이템 사이즈는 0 또는 양수여야 합니다.');
    }

    return comments.map((comment) => this.utils.commentsEntityToCommentResponseDto(comment));
  }

  async getCommentsCountByPostIdOrThrow404(id: number) {
    await this.validatePostId(id);
    return await this.commentsRepository.count({ where: { post: id } });
  }

  private async validatePostId(id) {
    const isExist = await this.postsRepository.findOne({ id });

    if (!isExist) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
  }

  private async validateCategoryId(id: number) {
    const isExist = await this.categoriesRepository.findOne({ id });

    if (!isExist) {
      throw new BadRequestException('카테고리를 찾을 수 없습니다.');
    }
  }

  private async getPostByIdOrThrow404(id: number): Promise<PostEntity> {
    const post: PostEntity = await this.postsRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.author', 'author')
      .innerJoinAndSelect('post.category', 'category')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다..');
    }

    return post;
  }

  private isAuthor(loggedInUser: UserEntity, post: PostEntity) {
    if (post.author.id !== loggedInUser.id) {
      throw new ForbiddenException('게시물의 작성자가 아닙니다.');
    }
  }
}
