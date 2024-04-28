import { Injectable, NotFoundException } from '@nestjs/common';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'ollie.mollie',
    title: 'my first server app',
    content: 'everything is going fine, YET.',
    commentCount: 0,
    likeCount: 115,
  },
  {
    id: 2,
    author: 'ollie.mollie',
    title: 'creating the second post',
    content: 'still going fine ... but?',
    commentCount: 0,
    likeCount: 115,
  },
  {
    id: 3,
    author: 'betty botter',
    title: 'betty botter bought some butter',
    content: "but she said the butter's bitter",
    commentCount: 0,
    likeCount: 115,
  },
];

@Injectable()
export class PostsService {
  getAllPosts() {
    return posts;
  }

  getPostById(id: number) {
    const post = posts.find((p) => p.id === +id);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  createPost({
    author,
    title,
    content,
  }: Pick<PostModel, 'author' | 'title' | 'content'>) {
    const id = posts[posts.length - 1].id + 1;
    const post: PostModel = {
      id,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [...posts, post];

    return post;
  }

  updatePost({
    id,
    author,
    title,
    content,
  }: {
    id: number;
    author?: string;
    title?: string;
    content?: string;
  }) {
    const _post = posts.find((p) => p.id === id);
    const post = { ..._post };

    if (!post) {
      throw new NotFoundException();
    }

    if (author) {
      post.author = author;
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    posts = posts.map((p) => (p.id === id ? post : p));

    return post;
  }

  deletePost(id: number) {
    const post = posts.find((p) => p.id === id);

    if (!post) {
      throw new NotFoundException();
    }

    posts = posts.filter((p) => p.id !== id);

    return id;
  }
}
