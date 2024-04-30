import { Schema, model } from 'mongoose';
import { IPost } from '@/types';

const PostSchema = new Schema<IPost>(
    {
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'IComment',
                required: true,
            },
        ],
        content: {
            type: String,
            required: true,
            unique: false,
        },
        isLocked: {
            type: Boolean,
            required: true,
            default: false,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,
            trim: true,
            select: false,
        },
        visibleTo: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                userId: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],
        images: [
            {
                type: Schema.Types.ObjectId,
                ref: 'IImage',
                required: true,
            },
        ],
        ownerId: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true,
        id: true,
        toJSON: {
            virtuals: true,
            getters: true,
        },
        toObject: {
            virtuals: true,
            getters: true,
        },
    }
);

export default model<IPost>('Post', PostSchema, 'posts');
