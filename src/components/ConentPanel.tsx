import React, { useEffect, useState } from 'react';
import { getDateNow, getUTCDate } from '../services/helpers';
import { AddCommentToImageAsync, DeleteCommentAsync, GetCommentAsync, UpdateCommentAsync } from '../services/image-api';
import { ActionTypeEnum } from '../types/enum';
import { CommentModelUI } from '../types/types';
import { Comment } from './Comment/Comment';
import css from './ContentPanel.module.scss';

interface Props
{
    imageId? : number,
    imageData? : string
}

export const ContentPanel : React.FC<Props> = ({ imageId, imageData }) => {
    const [data, setData] = useState<CommentModelUI[]>();

    useEffect(() => 
    {
        async function GetComments()
        {
            if(imageId)
            {
                const comments = await GetCommentAsync(imageId);
                var uiComments : CommentModelUI[] = [];

                for(var i in comments)
                {
                    const uiComment : CommentModelUI = { 
                        isEditMode: false, 
                        isViewAsIcon: true,
                        isNew : false, 
                        comment: comments[i] }

                    uiComments.push(uiComment);
                } 
                
                setData(uiComments);
            }else{
                setData([]);
            }
        }

        GetComments();
    }, [imageId]);

    async function actionHandler(model: CommentModelUI, actionType: ActionTypeEnum)
    {
        if(imageId)
        {
            switch (actionType)
            {
                case ActionTypeEnum.Save:
                    if(model.comment.id)
                    {
                        await UpdateCommentAsync(model.comment);
                    }
                    else
                    {
                        const comment = model.comment;

                        var newCommentId = await AddCommentToImageAsync(
                            comment.imageId, 
                            comment.text, 
                            comment.positionX, 
                            comment.positionY,
                            comment.createdAt);

                        model.isNew = false;
                        model.isEditMode = false;
                        model.isViewAsIcon = true;
                        model.comment.id = newCommentId;
                        model.comment.createdAt = getUTCDate(model.comment.createdAt);

                        var comments = data?.filter(c => !c.isNew);

                        const newComments = comments?.concat(model) ?? [model];
                        setData(newComments);
                    }

                    break;
                case ActionTypeEnum.Cancel:
                    if(model.isNew) 
                    {
                        const newComments = data?.filter(c => !c.isNew);
                        setData(newComments);
                    }
                    else
                    {
                        model.isEditMode = false;
                    }

                    break;
                case ActionTypeEnum.Delete:
                    await DeleteCommentAsync(model.comment.id!);

                    var newComments = data?.filter(c => c.comment.id !== model.comment.id);
                    setData(newComments);

                    break;
            }
        }
    }

    function onAddComment(event : React.MouseEvent<HTMLDivElement>)
    {
        if(imageId)
        {        
            const currentComments = data?.filter(c => !c.isNew);

            const newComment = {
                comment: { imageId: imageId!, positionX: event.clientX, positionY: event.clientY, text: '', createdAt: getDateNow() },
                isNew: true,
                isEditMode: true,
                isViewAsIcon: false
            }

            const newComments = currentComments?.concat(newComment) ?? [newComment];
            setData(newComments);
        }
    }

    return (
        <div className={css.container} onClick={onAddComment}>
        {(imageData ? (<img className={css.image} src={imageData} alt="some text"/>) : <></>)}
            {data?.map((comment, index) => (
                <Comment key={index} model={comment} actionHandler={actionHandler}/>
            ))}
        </div>)
}