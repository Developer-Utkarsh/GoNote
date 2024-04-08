import React, { useState, useEffect } from 'react';
import ImageUpload from './ImgUpload';

function ImageContainer({ handleImageUpload, uploadedImages, handleImageRemoval, setOpenedImage }) {
    const [showImages, setShowImages] = useState()
    useEffect(() => {
        if (uploadedImages = '') {
            setShowImages(false)
        }
        setShowImages(true)
    }, [uploadedImages])

    return (
        <div className="image-container">
            <div className="images">
                <ImageUpload onImageUpload={handleImageUpload} />

                {showImages === true &&
                    uploadedImages.map((imageDataURL, index) => (
                        <div className="image-wrapper" key={index}>
                            <img
                                src={imageDataURL}
                                alt={`Uploaded Image ${index + 1}`}
                                style={{ maxWidth: '100%' }}
                                onClick={() => setOpenedImage(imageDataURL)}
                            />
                            <div className="delete-icon" onClick={() => handleImageRemoval(index)}>
                                <i className='fa fa-trash'></i>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default ImageContainer;