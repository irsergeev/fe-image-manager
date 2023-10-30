import React, { useState } from 'react';
import { getDateNow, getUTCDate } from '../../services/helpers';
import { CreateImageAsync } from '../../services/image-api';
import { ImageModel } from '../../types/types';
import css from './AddImageForm.module.scss';

interface Props
{
    isActive : boolean,
    stateHandler : (isActive: boolean) => void,
    newImageHandler : (image: ImageModel) => void; 
}

export const AddImageForm : React.FC<Props> = ({isActive, stateHandler, newImageHandler}) => {
    
    const clientWidth = window.innerWidth;
    const clientHeight = window.innerHeight;
    const [file, setFile] = useState<string | ArrayBuffer | null>('');
    const [fileName, setFileName] = useState<string | undefined>('');
    
    async function onSubmitForm(e: React.SyntheticEvent){
        e.preventDefault();
        var formData = new FormData(e?.target as HTMLFormElement);
        var title = formData.get('title')?.toString();
        var description = formData.get('description')?.toString();

        if(fileName !== '' && (description !== '' || null))
        {
            if(title === '') title = fileName;

            var newImage = { 
                title: title!, 
                description: description!, 
                fileName: fileName!, 
                fileDataAsString: file!.toString(),
                createdAt: getDateNow(), 
            }

            var id = await CreateImageAsync(
                newImage.title, 
                newImage.description, 
                newImage.fileName, 
                newImage.fileDataAsString, 
                newImage.createdAt);
            
            newImage.createdAt = getUTCDate(newImage.createdAt);
            
            newImageHandler({id: id, ...newImage});

            stateHandler(false);
        }
    }

    function onFileChange(e : React.ChangeEvent<HTMLInputElement>)
    {
        const t = (e.target as HTMLInputElement).files;
        var file = t?.item(0);

        if(file !== undefined)
        {
            setFileName(file?.name);
            var fileReader = new FileReader();

            fileReader.onloadend = () => { setFile(fileReader.result) };
            fileReader.readAsDataURL(file!);
        }
    }

    return isActive ? 
        (<div className={css.container} style={{ width: clientWidth, height: clientHeight }}>
            <form onSubmit={onSubmitForm}>
                <div className={css['image-container']}>
                    <div className={css.item}>
                        <div className={css.title}>
                            <span>Title</span>
                        </div>
                        <input name='title'/>
                    </div>
                    <div className={css.item}>
                        <div className={css.title}>
                            <span>Description</span>
                        </div>
                        <input name='description' required/>
                    </div>
                    <div className={css.item}>
                        <div className={css.title}>
                            <span>Image</span>
                        </div>
                        <input type='file' name='file' onChange={onFileChange} required/>
                    </div>
                    <div className={css.actions}>
                        <button className={css.accept} type="submit">Add</button>
                        <button className={css.cancel} type="reset" onClick={_ => stateHandler(false)}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>) 
        : <></>
};