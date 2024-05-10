import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";

// post.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Post])], // add this line
  controllers: [PostController],
    providers: [PostService],
  })
  
  export class PostModule {}