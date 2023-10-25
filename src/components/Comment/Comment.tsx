import React, { useState } from 'react';
import css from './Comment.module.scss';
import CommentIcon from '../../icons/comment_icon.svg';
import MinSizeIcon from '../../icons/min-size.svg';
import { CommentModelUI } from '../../types/types';
import { ActionTypeEnum, ButtonTypeEnum } from '../../types/enum';
import { ButtonText } from '../../ui/ButtonText';

interface Props
{
    model: CommentModelUI
    actionHandler : (model: CommentModelUI, action: ActionTypeEnum) => Promise<void>;
}

interface CommentState
{
    isEditMode : boolean,
    isViewAsIcon : boolean
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
                updateState(false, false);

                if(!model.comment.id)
                    actionHandler(model, action);
                else
                    setCommentText(model.comment.text);
                break;
            case ActionTypeEnum.Edit:
                updateState(true, false);
                break;
            case ActionTypeEnum.Save:
                model.comment.text = commentText;

                updateState(false, true);
                actionHandler(model, ActionTypeEnum.Save);
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
        setCommentState({isEditMode: false, isViewAsIcon: false});
    }

    function updateState(isEditMode: boolean, isViewAsIcon: boolean)
    {
        setCommentState({ isEditMode: isEditMode, isViewAsIcon: isViewAsIcon });
        model.isEditMode = isEditMode;
        model.isViewAsIcon = isViewAsIcon;
    }

    React.useEffect(() => {
        const isEditMode = model.isEditMode;
        const isViewAsIcon = model.isViewAsIcon;

        setCommentState({ isEditMode, isViewAsIcon });
    }, [model.isEditMode, model.isViewAsIcon]);

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
                onClick={_ => updateState(false, true)}
                alt="min size"/>
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