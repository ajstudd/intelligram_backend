import imageService from '@/services/image.service';
import { ICommentGroup } from '@/types';
import { Request, Response } from 'express';

const comment = async (
    req: Request<{ imageId: string }, any, ICommentGroup[]>,
    res: Response
) => {
    const { imageId } = req.params;

    const image = await imageService.applyComments(imageId, req.body);

    return res.json({ message: 'Comments applied', image });
};

const getImageById = async (
    req: Request<{ imageId: string }>,
    res: Response
) => {
    const { imageId } = req.params;

    const image = await imageService.getImageById(imageId);

    return res.sendFile(image?.localPath ?? '');
};
export default {
    comment,
    getImageById,
};
