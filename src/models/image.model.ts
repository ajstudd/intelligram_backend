import { IComment, ICommentGroup, IImage } from '@/types';
import { Schema, model } from 'mongoose';

const CommentSchema = new Schema<IComment>(
    {
        type: {
            type: String,
            required: true,
            enum: ['text', 'image'],
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: false,
        _id: false,
        id: false,
    }
);

const CommentGroupSchema = new Schema<ICommentGroup>(
    {
        x: {
            type: Number,
            required: true,
            min: 0,
        },
        y: {
            type: Number,
            required: true,
            min: 0,
        },
        comments: [{ type: CommentSchema, default: [] }],
    },
    {
        timestamps: false,
        _id: false,
        id: true,
    }
);

const ImageSchema = new Schema<IImage>(
    {
        image: {
            type: String,
            required: true,
        },
        localPath: {
            type: String,
            required: true,
            select: false,
        },
        commentGroups: [{ type: CommentGroupSchema, default: [] }],
    },
    {
        timestamps: true,
        _id: true,
        id: true,
    }
);

export default model<IImage>('IImage', ImageSchema, 'images');
