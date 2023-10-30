import api from './axios-api';
import { CommentModel, ImageModel } from '../types/types';

export const GetImagesAsync = async () : Promise<ImageModel[] | void> => 
{
    var data = await api.get<ImageModel[] | void>('/api/Image')
        .then(result => { return result.data as ImageModel[]; })
        .catch(error => console.log(error));

    return data;
}

export const UpdateImageAsync = async (id : number, title : string, description : string) =>
{
    var updateModel = { id, title, description }

    await api.put('/api/Image', updateModel)
        .catch(error => console.log(error));
}

export const DeleteImageAsync = async (id: number) =>
{
    await api.delete('/api/Image', { params: { id }})
        .catch(error => console.log(error));
}

export const GetCommentAsync = async (imageId: number) : Promise<CommentModel[]> => 
{
    var data : CommentModel[] | any;
    
    await api.get<CommentModel[]>(`/api/Image/${imageId}/Comment`)
        .then(result => data = result.data)
        .catch(error => console.log(error));

    return data;
}

export const AddCommentToImageAsync = async (imageId: number, commentText : string, x: number, y: number, createdAt: Date) : Promise<number> =>
{
    const newComment = { imageId: imageId, text: commentText, positionX: x, positionY: y, createdAt:  createdAt};

    var response = await api.post('/api/Image/Comment', newComment)
        .then(response => { return response.data })
        .catch(error => console.log(error));;

    return response;
}

export const CreateImageAsync = async (title : string, description : string, fileName : string, fileDataAsString : string, createdAt : Date) : Promise<number> => 
{
    const data = { title, description, fileName, fileDataAsString, createdAt: createdAt }

    console.log("create image: ", data);

    var result = await api.post('/api/Image', data)
        .then(response => { return response.data })
        .catch(error => console.log(error));

    return result;
}

export const UpdateCommentAsync = async (data: CommentModel) =>
{
    console.log("update comment async", data);
    await api.put('/api/Image/Comment', data)
        .catch(error => console.log(error));
}

export const DeleteCommentAsync = async (id: number) =>
{
    await api.delete('/api/Image/Comment', { params: { id }})
        .catch(error => console.log(error));
}

export const DeleteCommentsAsync = async (imageId: number) =>
{
    await api.delete('/api/Image/Comment', { params: { imageId }})
        .catch(error => console.log(error));
}