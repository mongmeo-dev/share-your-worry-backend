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
  ) {}

  async createPost(
    loggedInUser: UserEntity,
    postCreateDto: PostCreateDto,
  ): Promise<PostResponseDto> {
    await this.validateCategory(postCreateDto.category);

    const newPost = await this.postsRepository.create(postCreateDto);
    newPost.author = loggedInUser;
    const savedPost = await this.postsRepository.save(newPost);

    return { ...savedPost, author: Utils.removePasswordFromUser(loggedInUser) };
  }

  async getAllPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postsRepository.find({ relations: ['author', 'category'] });

    return posts.map((post) => Utils.postEntityToPostResponseDto(post));
  }

  async getPostById(id: number): Promise<PostResponseDto> {
    const post = await this.getPostByIdOrThrow404(id);
    return Utils.postEntityToPostResponseDto(post);
  }

  async updatePostById(
    id: number,
    loggedInUser: UserEntity,
    postUpdateDto: PostUpdateDto,
  ): Promise<PostResponseDto> {
    const post = await this.getPostByIdOrThrow404(id);

    this.isAuthor(loggedInUser, post);

    await this.validateCategory(postUpdateDto.category);

    const updatedPost = { ...post, ...postUpdateDto };
    const savedPost = await this.postsRepository.save(updatedPost);
    return Utils.postEntityToPostResponseDto(savedPost);
  }

  async deletePostById(id: number, loggedInUser: UserEntity): Promise<void> {
    const post = await this.getPostByIdOrThrow404(id);

    this.isAuthor(loggedInUser, post);

    await this.postsRepository.delete({ id });
  }

  async getAllCommentsByPostId(id: number): Promise<CommentResponseDto[]> {
    const post = await this.getPostByIdOrThrow404(id);

    const comments = await this.commentsRepository.find({
      where: { post: post },
      relations: ['author'],
    });
    return comments.map((comment) => Utils.commentsEntityToCommentResponseDto(comment));
  }

  private async validateCategory(id: CategoryEntity) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new BadRequestException('카테고리가 존재하지 않습니다.');
    }
  }

  private async getPostByIdOrThrow404(id: number) {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
    if (!post) {
      throw new NotFoundException(`id ${id} 게시물을 찾을 수 없음`);
    }
    return post;
  }

  private isAuthor(loggedInUser: UserEntity, post: PostEntity) {
    if (post.author.id !== loggedInUser.id) {
      throw new ForbiddenException('게시물의 작성자가 아닙니다.');
    }
  }
}
