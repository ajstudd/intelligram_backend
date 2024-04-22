export interface IComment {
    type: 'text' | 'image';
    content: string;
}

export interface ICommentGroup {
    id: string;
    x: number;
    y: number;
    comments: IComment[];
}

export interface IImage {
    image: string;
    localPath: string;
    _id?: string;
    commentGroups: ICommentGroup[];
}
