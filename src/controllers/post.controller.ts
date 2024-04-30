import imageService from '@/services/image.service';
import postService from '@/services/post.service';
import userService from '@/services/user.service';
import { Request, Response } from 'express';
import { get } from 'http';

export const createPost = async (req: Request, res: Response) => {
    const { body } = req;
    const postRes = await postService.createPost(body);
    return res.json({ message: 'Post created', post: postRes });
};

export const getAllPosts = async (req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    return res.json({ posts });
};

export const getPostById = async (
    req: Request<{ postId: string }>,
    res: Response
) => {
    const { postId } = req.params;
    const post = await postService.getPostById(postId);
    return res.json({ post });
};

export const addComment = async (req: Request, res: Response) => {
    const { body } = req;
    const post = await postService.applyComments(body);
    return res.json({ message: 'Comment added', post });
};

export default {
    createPost,
    getAllPosts,
    getPostById,
    addComment,
};
