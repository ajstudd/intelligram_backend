import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { IPost, IRequestUser, IUser, UpdateUserPayload } from '../types';
import { HttpError } from '../helpers/HttpError';
// import configs from '../configs';
import { FilterQuery } from 'mongoose';
import postModel from '@/models/post.model';

const createPost = async (payload: Partial<IPost>) => {
    const post = postModel.create(payload);
    return post;
};

export default {
    createPost,
};
