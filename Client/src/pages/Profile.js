import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

function Projects() {

    const { user } = useAuth0();

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Project Page
                </h1>
                <div className="content__body">
                    <div className="profile-grid">
                        <div className="profile__header">
                            <img
                                src={user.picture}
                                alt="Profile"
                                className="profile__avatar"
                            />
                            <div className="profile__headline">
                                <h2 className="profile__title">{user.name}</h2>
                                <span className="profile__description">{user.email}</span>
                            </div>
                        </div>
                        <div className="profile__details">
                            {JSON.stringify(user, null, 2)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Projects