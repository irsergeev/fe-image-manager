import React, { useEffect, useState } from 'react';
import css from './ButtonText.module.scss';
import { ButtonTypeEnum } from '../types/enum';

interface Props
{
    text: string,
    buttonType: ButtonTypeEnum
    clickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonText : React.FC<Props> = ({ text, buttonType, clickHandler }) => 
{
    const [styleName, setStyleName] = useState('');
    
    useEffect(() =>
    {
        switch (buttonType)
        {
            case ButtonTypeEnum.Cancel: setStyleName('cancel-button');
                break;
            case ButtonTypeEnum.Edit: setStyleName('edit-button');
                break;
            case ButtonTypeEnum.Save: setStyleName('save-button');
                break;
            case ButtonTypeEnum.Delete: setStyleName('delete-button');
                break;
            default: setStyleName('cancel-button');
                break; 
        }


    }, [buttonType]);

    return <button className={css[`${styleName}`]} onClick={clickHandler}>{text}</button>
};

