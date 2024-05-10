import { IsString } from "class-validator";

// create-post.dto.ts
export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
  }