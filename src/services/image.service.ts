import ImageModel from '@/models/image.model';
import { ICommentGroup } from '@/types';

const saveImage = async ({
    filename,
    localPath,
}: {
    filename: string;
    localPath: string;
}) => {
    const image = await ImageModel.create({
        image: filename,
        localPath,
        commentGroups: [],
    });
    return image.toObject();
};

const applyComments = async (
    imageId: string,
    commentGroups: ICommentGroup[]
) => {
    const image = await ImageModel.findOneAndUpdate(
        {
            _id: imageId,
        },
        {
            $set: {
                commentGroups: commentGroups.map((cg) => {
                    const { id, ...group } = cg;
                    return group;
                }),
            },
        },
        {
            new: true,
        }
    );

    return image;
};

const getImageById = async (imageId: string) => {
    const image = await ImageModel.findById(imageId).select('+localPath');

    return image;
};

export default {
    saveImage,
    applyComments,
    getImageById,
};
