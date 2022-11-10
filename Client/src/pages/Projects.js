import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { apiSend } from '../utils/services.js'

function Projects() {

    const { user, getAccessTokenSilently } = useAuth0();

    async function saveUser({ sub, nickname, picture, email }) {
        const accessToken = await getAccessTokenSilently();
        console.log("----->", accessToken)

        apiSend('/user', 'POST', accessToken, { sub, nickname, picture, email })
            .then(data => {
                console.log("RESPONSE: ", data);
            });
    }
    /* async function getProjects() {
        const accessToken = await getAccessTokenSilently();
        apiSend('/api/messages/protected', 'GET', accessToken)
            .then(data => {
                console.log("GET PROTECTED MESSAGE: ", data);
            });
    }

    getProjects(); */

    if (user) saveUser(user);

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
                    <p id="page-description">
                        <span>
                            You can use the <strong>ID Token</strong> to get the profile
                            information of an authenticated user.
                        </span>
                        <span>
                            <strong>Only authenticated users can access this page.</strong>
                        </span>
                    </p>
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