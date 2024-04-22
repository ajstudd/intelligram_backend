import imageService from '@/services/image.service';
import postService from '@/services/post.service';
import userService from '@/services/user.service';
import { Request, Response } from 'express';

export const createPost = async (req: Request, res: Response) => {
    const { body } = req;

    postService.createPost(body);
};

export default {
    createPost,
};
