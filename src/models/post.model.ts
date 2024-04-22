import { Schema, model } from 'mongoose';
import { IPost, IComment } from '@/types';
import { boolean } from 'joi';

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
                url: {
                    type: String,
                    required: true,
                    trim: true,
                },
                alt: {
                    type: String,
                    required: true,
                    trim: true,
                },
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

export default model<IPost>('Post', PostSchema, 'post');
