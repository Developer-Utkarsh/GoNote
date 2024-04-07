import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react';

function User(props) {
    const [userName, setUserName] = useState(props.userName);

    useEffect(() => {
        if (!props.userName) {
            setUserName("Login/Register");
        }
    }, [props.userName]); // Only re-run the effect if props.userName changes

    return (
        <div className="user-container">
            <div className="userDetails">
                {/* Use Link to navigate to the sign-in page */}

                <SignedOut>
                    <div className="auth">
                        <i className="fa-solid fa-circle-user"></i>
                        <div className="links">

                            <Link to="/login" className="userLink">
                                <h2 className="userName">Login</h2>
                            </Link><span>/</span>
                            <Link to="/register" className="userLink">
                                <h2 className="userName">Register</h2>
                            </Link>
                        </div>
                    </div>

                </SignedOut>
                <SignedIn>
                    <UserButton signInUrl="register" />
                </SignedIn>
            </div>
        </div>
    );
}

export default User;
