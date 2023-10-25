import React, { useState } from 'react';
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
                createAt: new Date(), 
            }

            var id = await CreateImageAsync(
                newImage.title, 
                newImage.description, 
                newImage.fileName, 
                newImage.fileDataAsString, 
                newImage.createAt);

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
        (<div className={css['popup-container']} style={{ width: clientWidth, height: clientHeight }}>
            <form onSubmit={onSubmitForm}>
                <div className={css['add-picture-container']}>
                    <div className={css['input-item']}>
                        <div className={css['field-title']}>
                            <span>Title</span>
                        </div>
                        <input name='title'/>
                    </div>
                    <div className={css['input-item']}>
                        <div className={css['field-title']}>
                            <span>Description</span>
                        </div>
                        <input name='description'/>
                    </div>
                    <div className={css['input-item']}>
                        <div className={css['field-title']}>
                            <span>Image</span>
                        </div>
                        <input type='file' name='file' onChange={onFileChange}/>
                    </div>
                    <div className={css.actions}>
                        <button className={css.accept} type="submit">Add</button>
                        <button className={css.cancel} onClick={_ => stateHandler(false)}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>) 
        : <></>
};