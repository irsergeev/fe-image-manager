export interface CommentModel 
{
    id? : number,
    imageId : number,
    text : string,
    positionX : number,
    positionY : number,
    createdAt : Date,
}

export interface CommentModelUI
{
    comment : CommentModel,
    isEditMode : boolean,
    isViewAsIcon : boolean,
    isNew : boolean
}

export interface ImageModel
{
    id : number,
    title : string,
    description : string,
    fileName : string,
    fileDataAsString? : string,
    createdAt : Date
}