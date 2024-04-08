import React from 'react';

const OpenedImage = ({ openedImage, setOpenedImage }) => {
    const handleCloseImage = () => {
        setOpenedImage(null);
    };

    return (
        <div className="image-overlay" onClick={handleCloseImage}>
            <div className="image-overlay-inner" onClick={(e) => e.stopPropagation()}>
                <img src={openedImage} alt="Opened Image" />
                <span className="close-icon" onClick={handleCloseImage}>
                    &times;
                </span>
            </div>
        </div>
    );
};

export default OpenedImage;