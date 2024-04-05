import React from 'react'

function user(props) {
    return (
        <>
            <div className="user-container">
                <div className="userDetails">
                    <i className="fa-solid fa-circle-user"></i>
                    <h2 className="userName">{props.userName}</h2>
                </div>

            </div>

        </>
    )
}

export default user
