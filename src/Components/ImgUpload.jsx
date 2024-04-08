import React, { useState } from 'react';
import './App.css'; // Import the CSS file

const ImageUpload = ({ onImageUpload }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageUpload(reader.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    return (
        <div className="image-upload">
            <label htmlFor="file-input" className="file-input-label">
                <span className="plus-icon"><i className="fa fa-plus"></i></span>
                <span className="text">Add Image</span>
            </label>
            <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ImageUpload;