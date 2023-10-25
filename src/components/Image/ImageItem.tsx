import css from './ImageItem.module.scss';
import { useState } from 'react';
import { ImageModel } from '../../types/types';
import { UpdatePicutreAsync } from '../../services/image-api';
import { ButtonText } from '../../ui/ButtonText';
import { ButtonTypeEnum } from '../../types/enum';
import { getDateString } from '../../services/helpers';

export interface Props
{
    image : ImageModel,
    action: (image: ImageModel) => void,
    deleteHandler: (imageId: number) => void,
}

export const  ImageItem : React.FC<Props> = ({ image, action, deleteHandler }) => {
    
    const [ editMode, setEditMode ] = useState(false);
    const [ titleValue, setTitleValue ] = useState(image.title);
    const [ descriptionValue, setDescriptionValue ] = useState(image.description);

    const [ changeTitle, setChangeTitle ] = useState(image.title);
    const [ changeDescription, setChangeDescription ] = useState(image.description);

    function pictureItemClickHandler()
    {
        action({...image});
    }

    function onCancelClick() 
    {
        setChangeTitle(titleValue);
        setEditMode(false); 
    }
    
    async function onSaveClick()
    {
        if(titleValue !== changeTitle || descriptionValue !== changeDescription)
        {
            await UpdatePicutreAsync(image.id!, changeTitle, changeDescription);
        }

        setTitleValue(changeTitle);
        setDescriptionValue(changeDescription);

        setEditMode(false);
    }

    async function onDeleteClick() { deleteHandler(image.id!); }
    
    return editMode ? 
    (<div className={css['picture-item-container']} onClick={pictureItemClickHandler}>
        <div className={css.title}>
            <input className={css['title-input']} defaultValue={titleValue} onChange={e => setChangeTitle(e.target.value)}/>
        </div>
        <div className={css.description}>
            <input className={css['description-input']} defaultValue={descriptionValue} onChange={e => setChangeDescription(e.target.value)}/>
        </div>
        <div className={css.actions}>
            <ButtonText text='Save' buttonType={ButtonTypeEnum.Save} clickHandler={onSaveClick} />
            <ButtonText text='Cancel' buttonType={ButtonTypeEnum.Cancel} clickHandler={onCancelClick} />
        </div>
    </div>)
    :
    (<div className={css['picture-item-container']} onClick={pictureItemClickHandler}>
        <div className={css.title}>
            <span>{titleValue}</span>
            <span className={css.createdAt}>{getDateString(image.createAt)}</span>
        </div>
        <div className={css.description}>
            <span>{descriptionValue}</span>
        </div>
        <div className={css.actions}>
            <ButtonText text='Edit' buttonType={ButtonTypeEnum.Edit} clickHandler={_ => setEditMode(true)} />
            <ButtonText text='Delete' buttonType={ButtonTypeEnum.Delete} clickHandler={onDeleteClick} />
        </div>
    </div>)
}