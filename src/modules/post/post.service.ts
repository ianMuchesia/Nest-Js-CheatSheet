import { Injectable, NotFoundException } from '@nestjs/common';

import { v4 as uuid } from 'uuid';

import { CreatePostDto, UpdatePostDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  public async getPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }

  public async getPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({where:{id:id}});
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  public async createPost(postDto: CreatePostDto): Promise<Post> {
    const post =  this.postRepository.create(postDto);
    await this.postRepository.save(post);
    return post;
  }


  public async updatePost(id: string, postDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({where:{id:id}});
    if (!post) {
      throw new NotFoundException(`Post with id ${post.id} not found`);
    }
    const updated = Object.assign(post, postDto);
    updated.updatedAt = Date.now();

    await this.postRepository.save(updated);
    
    return updated;
  }

  public async deletePost(id: string): Promise<void> {
    const post = await this.postRepository.findOne({where:{id:id}});
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    await this.postRepository.delete(post.id);
  }
}
