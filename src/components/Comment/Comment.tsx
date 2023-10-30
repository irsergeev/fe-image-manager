import React, { useState } from 'react';
import css from './Comment.module.scss';
import CommentIcon from '../../icons/comment_icon.svg';
import MinSizeIcon from '../../icons/min-size.svg';
import { CommentModelUI } from '../../types/types';
import { ActionTypeEnum, ButtonTypeEnum } from '../../types/enum';
import { ButtonText } from '../../ui/ButtonText';
import { getDateNow, utcToLocalString } from '../../services/helpers';

interface Props
{
    model: CommentModelUI
    actionHandler : (model: CommentModelUI, action: ActionTypeEnum) => Promise<void>;
}

interface CommentState
{
    isEditMode : boolean,
    isViewAsIcon : boolean,
    isNew : boolean,
}

export const Comment : React.FC<Props> = ({ model, actionHandler }) => {
    
    const [commentText, setCommentText] = useState(model.comment.text);
    const [commentState, setCommentState] = useState<CommentState>();

    
    async function commonClickHandler(event: React.MouseEvent<HTMLButtonElement>, action: ActionTypeEnum)
    {
        event.stopPropagation();
        
        switch (action)
        {
            case ActionTypeEnum.Cancel:

                if(!model.comment.id)
                {
                    updateState(false, false, true);
                    actionHandler(model, action);
                }
                else
                {
                    updateState(false, false, false);
                    setCommentText(model.comment.text);
                }
                break;
            case ActionTypeEnum.Edit:
                updateState(true, false, false);
                break;
            case ActionTypeEnum.Save:
                model.comment.text = commentText;

                if(!model.comment.id)
                {
                    updateState(false, true, true);
                    actionHandler(model, ActionTypeEnum.Save);
                }
                else
                {
                    updateState(false, true, false);
                    actionHandler(model, ActionTypeEnum.Save);
                }
                break;
            case ActionTypeEnum.Delete:
                actionHandler(model, ActionTypeEnum.Delete);
                break;
            default: 
                break;
        }
    }

    async function onClickIcon(event: React.MouseEvent<HTMLImageElement>)
    {
        event.stopPropagation();
        setCommentState({isEditMode: false, isViewAsIcon: false, isNew: false});
    }

    function updateState(isEditMode: boolean, isViewAsIcon: boolean, isNew: boolean)
    {
        setCommentState({ isEditMode: isEditMode, isViewAsIcon: isViewAsIcon, isNew: isNew });
        model.isEditMode = isEditMode;
        model.isViewAsIcon = isViewAsIcon;
        model.isNew = isNew
    }

    React.useEffect(() => {
        const isEditMode = model.isEditMode;
        const isViewAsIcon = model.isViewAsIcon;
        const isNew = model.isNew;

        setCommentState({ isEditMode, isViewAsIcon, isNew });
    }, [model.isEditMode, model.isViewAsIcon, model.isNew]);

    return commentState?.isEditMode ? 
    (<div className={css['comment-container']} 
        style={{ position: 'absolute', top: model.comment.positionY, left: model.comment.positionX}} 
        onClick={e => e.stopPropagation()}>
        <div className={css['comment-content-edit']}>
            <input defaultValue={commentText} onChange={e => setCommentText(e.target.value)} onClick={e => e.stopPropagation()}/>
        </div>
        <div className={css.actions}>
            <ButtonText 
                text='Save' 
                buttonType={ButtonTypeEnum.Save} 
                clickHandler={e => commonClickHandler(e, ActionTypeEnum.Save)} />
            <ButtonText 
                text='Cancel' 
                buttonType={ButtonTypeEnum.Cancel} 
                clickHandler={e => commonClickHandler(e, ActionTypeEnum.Cancel)} />
        </div>
    </div>)
    : (commentState?.isViewAsIcon ? 
    <img 
        src={CommentIcon} 
        className={css['comment-as-icon']} 
        style={{ position: 'absolute', top: model.comment.positionY, left: model.comment.positionX}} 
        onClick={onClickIcon} 
        alt="comment icon"/>
    :
    (<div className={css['comment-container']} 
            style={{ position: 'absolute', top: model.comment.positionY, left: model.comment.positionX}} 
            onClick={e => e.stopPropagation()}>
        <div className={css['min-size-container']}>
            <img 
                src={MinSizeIcon} 
                className={css['min-size-icon']}
                onClick={_ => updateState(false, true, false)}
                alt="min size"/>
            <div className={css.createdAt}>
                <span>{utcToLocalString(model.comment?.createdAt)}</span>
            </div>
        </div>
        <div className={css['comment-content']}>
            <span>{commentText}</span>
        </div>
        <div className={css.actions}>
            <ButtonText 
                text='Edit' 
                buttonType={ButtonTypeEnum.Edit} 
                clickHandler={e => commonClickHandler(e, ActionTypeEnum.Edit)} />
            <ButtonText 
                text='Delete' 
                buttonType={ButtonTypeEnum.Delete} 
                clickHandler={e => commonClickHandler(e, ActionTypeEnum.Delete)} />
        </div>
    </div>));
}