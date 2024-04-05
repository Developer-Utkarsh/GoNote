import React, { useState, useEffect } from 'react';

function FormattingContainer(props) {
    const [selectionRange, setSelectionRange] = useState(null);

    const handleTextFormatting = (format) => {
        if (selectionRange) {
            const { startContainer, startOffset, endContainer, endOffset } = selectionRange;
            const selection = window.getSelection();
            const selectedText = selection.toString();

            // Create a span element with the appropriate class name based on the format
            const spanElement = document.createElement('span');
            spanElement.classList.add(format);

            // Wrap the selected text with the span element
            const range = selection.getRangeAt(0).cloneRange();
            range.surroundContents(spanElement);

            // Clear the selection
            selection.removeAllRanges();

            // Update the document with the new formatting
            const updatedHtml = range.cloneContents();
            range.deleteContents();
            range.insertNode(updatedHtml);
            props.setShowFormatting('not-hidden')
        }
    };


    const handleSelectionChange = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            setSelectionRange(selection.getRangeAt(0));
        } else {
            setSelectionRange(null);
        }
    };

    useEffect(() => {
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    return (
        <>
            <div className={`formattingContainer ${props.showFormatting ? '' : 'hiddenFormatter'}`}>
                <div className="formattings">
                    <div className="formattingItems" onClick={() => handleTextFormatting('bold')}>
                        <i className="fa fa-bold"></i>
                    </div>
                    <div className="formattingItems" onClick={() => handleTextFormatting('underline')}>
                        <i className="fa fa-underline"></i>
                    </div>
                    <div className="formattingItems" onClick={() => handleTextFormatting('italic')}>
                        <i className="fa fa-italic"></i>
                    </div>
                    <div className="formattingItems" onClick={() => handleTextFormatting('ul')}>
                        <i className="fa fa-list"></i>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FormattingContainer;