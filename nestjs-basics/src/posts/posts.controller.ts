import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * @method GET /posts
   * @returns 모든 post를 전부 가져온다.
   */
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  /**
   * @method GET /posts/:id
   * @returns id에 해당하는 post를 가져온다.
   */
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  /**
   * @method POST /posts
   * @returns post를 생성한다.
   */
  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost({ author, title, content });
  }

  /**
   * @method PUT /posts/:id
   * @returns id에 해당하는 post를 변경한다.
   */
  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost({
      id: +id,
      author,
      title,
      content,
    });
  }

  /**
   * @method DELETE /posts/:id
   * @returns id에 해당하는 post를 삭제한다.
   */
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
