import React, { useState } from 'react';
import { ImageModel } from './types/types';
import { ImagePanel } from './components/ImagePanel';
import { ContentPanel } from './components/ConentPanel';

export const App : React.FC = () => {

  const [selectedImage, setSelectedImage] = useState<ImageModel | undefined>();

  function selectedImageHandler(image : ImageModel | undefined)
  {
    setSelectedImage(image);
  }

  return (
    <>
      <ImagePanel selectedImageHandler={selectedImageHandler}/>
      <ContentPanel imageData={selectedImage?.fileDataAsString} imageId={selectedImage?.id}/>
    </>
  );
}

