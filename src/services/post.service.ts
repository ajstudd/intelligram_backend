import bcrypt from 'bcryptjs';
import { IComment, IPost } from '../types';
import postModel from '@/models/post.model';

const createPost = async (payload: Partial<IPost>) => {
    if (payload.password) {
        const hashedPassword = bcrypt.hashSync(payload.password);
        payload.password = hashedPassword;
    }
    const post = await postModel.create(payload);
    return post;
};

const applyComments = async (comment: IComment) => {
    const image = await postModel.findOneAndUpdate(
        {
            _id: comment.postid,
        },
        {
            $set: {
                comments: comment,
            },
        },
        {
            new: true,
        }
    );

    return image;
};

const getPostImageWithPassword = async (postId: string, password: string) => {
    const post = await postModel.findById(postId);
    if (!post) {
        return null;
    }
    const isMatch = await bcrypt.compare(password, post.password);
    if (!isMatch) {
        return null;
    }
    return post;
};

export const getPostById = async (postId: string) => {
    const post = await postModel.findById(postId);
    if (post?.isLocked) {
        post.images = [];
    }
    return post;
};

export const getAllPosts = async () => {
    const posts = await postModel.find();
    posts.map((post) => {
        if (post.isLocked) {
            post.images = [];
        }
    });
    return posts;
};

export default {
    createPost,
    applyComments,
    getPostById,
    getPostImageWithPassword,
    getAllPosts,
};
