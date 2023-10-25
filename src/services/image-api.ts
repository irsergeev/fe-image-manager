import api from './axios-api';
import { CommentModel, ImageModel } from '../types/types';

export const GetImagesAsync = async () : Promise<ImageModel[] | void> => 
{
    var data = await api.get<ImageModel[] | void>("/api/Image", { headers: { Accept: 'application/json' } })
        .then(result => { console.log(result.data); return result.data as ImageModel[]; })
        .catch(error => console.log(error));
    console.log('data parse result', data);
    return data;
}

export const UpdatePicutreAsync = async (id : number, title : string, description : string) =>
{
    var updateModel = { id, title, description }
    await api.put("/api/Image", updateModel, { headers : { Accept: 'application/json' } })
        .catch(error => console.log(error));
}

export const DeleteImageAsync = async (id: number) =>
{
    await api.delete(`/api/Image?id=${id}`, { headers : { Accept: 'application/json' }})
        .catch(error => console.log(error));
}

export const GetCommentAsync = async (imageId: number) : Promise<CommentModel[]> => 
{
    var data : CommentModel[] | any;
    
    await api.get<CommentModel[]>(`/api/Image/${imageId}/Comment`, { headers : { Accept: 'application/json' } })
        .then(result => data = result.data)
        .catch(error => console.log(error));

    return data;
}

export const AddCommentToImageAsync = async (imageId: number, commentText : string, x: number, y: number) : Promise<number> =>
{
    const newComment = { imageId: imageId, text: commentText, positionX: x, positionY: y };
    var response = await api.post(`/api/Image/Comment`, newComment, { headers: { Accept: 'application/json' }})
        .then(response => { return response.data })
        .catch(error => console.log(error));;

    return response;
}

export const CreateImageAsync = async (title : string, description : string, fileName : string, fileDataAsString : string, createAt : Date) : Promise<number> => 
{
    const data = { title, description, fileName, fileDataAsString, createAt: createAt }
    var result = await api.post(`/api/Image`, data, { headers : { Accept: 'application/json' }})
        .then(response => { return response.data })
        .catch(error => console.log(error));

    return result;
}

export const UpdateCommentAsync = async (data: CommentModel) =>
{
    await api.post(`/api/Image/Comment`, data, { headers: { Accept: 'application/json' }})
        .catch(error => console.log(error));
}

export const DeleteCommentAsync = async (id: number) =>
{
    await api.delete('/api/Image/Comment', { params: { id }})
        .catch(error => console.log(error));
}

export const DeleteCommentsAsync = async (imageId: number) =>
{
    await api.delete(`/api/Image/Comment?imageId=${imageId}`)
        .catch(error => console.log(error));
}