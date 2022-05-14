import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { Repository } from 'typeorm';
import { PostCreateDto } from './dto/post-create.dto';
import { UserEntity } from '../users/entity/user.entity';
import { Utils } from '../common/utils';
import { PostResponseDto } from './dto/post-response.dto';
import { PostUpdateDto } from './dto/post-update.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity) private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async createPost(user: UserEntity, postCreateDto: PostCreateDto): Promise<PostResponseDto> {
    const newPost = await this.postsRepository.create(postCreateDto);
    newPost.author = user;
    const savedPost = await this.postsRepository.save(newPost);

    return { ...savedPost, author: Utils.removePasswordFromUser(user) };
  }

  async getAllPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postsRepository.find({ relations: ['author', 'category'] });

    return posts.map((post) => Utils.postEntityToPostResponseDto(post));
  }

  async getPostById(id: number): Promise<PostResponseDto> {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
    if (!post) {
      throw new NotFoundException(`id ${id} 게시물을 찾을 수 없음`);
    }
    return Utils.postEntityToPostResponseDto(post);
  }

  async updatePostById(
    id: number,
    user: UserEntity,
    postUpdateDto: PostUpdateDto,
  ): Promise<PostResponseDto> {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
    if (!post) {
      throw new NotFoundException(`id ${id} 게시물을 찾을 수 없음`);
    }
    if (post.author.id !== user.id) {
      throw new ForbiddenException('게시물의 작성자만 수정할 수 있습니다.');
    }
    const updatedPost = { ...post, ...postUpdateDto };
    const savedPost = await this.postsRepository.save(updatedPost);
    return Utils.postEntityToPostResponseDto(savedPost);
  }

  async deletePostById(id: number, user): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
    if (!post) {
      throw new NotFoundException(`id ${id} 게시물을 찾을 수 없음`);
    }
    if (post.author.id !== user.id) {
      throw new ForbiddenException('게시물의 작성자만 삭제할 수 있습니다.');
    }
    await this.postsRepository.delete({ id });
  }

  async getAllCommentsByPostId(id: number) {
    // TODO: comment 완성하면 구현할 것
  }
}
