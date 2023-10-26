import css from './ImagePanel.module.scss';
import { ImageModel } from '../types/types';
import React, { useState } from 'react';
import { ImageItem } from './Image/ImageItem';
import { AddImageForm } from './Image/AddImageForm';
import { DeleteImageAsync, GetImagesAsync } from '../services/image-api';

interface Props
{
    selectedImageHandler : (image: ImageModel | undefined) => void;
}

export const ImagePanel : React.FC<Props> = ({selectedImageHandler}) => {

    const [images, setImages] = useState<ImageModel[]>();
    const [addFormState, setAddFormState] = useState(false);

    function onAddImage(image: ImageModel)
    {
        const items = images;
        const newItems = items?.concat(image) ?? [image];

        setImages(newItems);
    }

    async function onDeleteImage(imageId: number)
    {
        await DeleteImageAsync(imageId);

        var newImages = images?.filter(c => c.id !== imageId);
        setImages(newImages);
        selectedImageHandler(undefined);
    }

    React.useEffect(() => 
    {
        async function LoadImages()
        {
            var data = await GetImagesAsync();
            
            if(data) setImages(data);
        }

        LoadImages();
    }, []);

    return(
    <div className={css.container}>
        <div className={css.header}>
            <span>Список файлов</span>
        </div>
        <div className={css.content}>
            <div className={css['item-group-container']}>
                {images?.map((image, index) => 
                    <ImageItem 
                        key={index} 
                        image={image} 
                        action={selectedImageHandler}
                        deleteHandler={onDeleteImage} />
                )}
            </div>
        </div>
        <div className={css.action}>
            <button className={css['add-button']} onClick={_ => setAddFormState(true)}>+ Добавить изображение</button>
        </div>

        <AddImageForm 
            isActive={addFormState} 
            stateHandler={setAddFormState} 
            newImageHandler={onAddImage} />
    </div>)
};