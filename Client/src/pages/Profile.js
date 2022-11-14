import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Tableview from '../components/Tableview.js'
import { apiSend, getFullDate } from '../utils/services.js'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Projects() {

    //Dialog Window
    const [invites, setInvites] = useState({ data: [], user: {} });

    //Access Token
    let token = useSelector(state => state.token);

    const { user } = useAuth0();

    const getInvites = async () => {
        const res = await apiSend('/invites', 'GET', token);
        console.log("API RESPONSE:", res);
        setInvites(res);
    }

    const toggleCollab = async (checked, project_id) => {
        let action = checked === false ? 'reject' : 'accept';
        console.log("executING:", project_id, action);
        const res = await apiSend('/invites/' + project_id + '/' + action, 'GET', token);
        console.log("TOGGLE API RESPONSE:", res);
        const res2 = await apiSend('/invites/', 'GET', token);
        console.log("TOGGLE API RESPONSE:", res2);
        setInvites(res2);
    }

    useEffect(() => {
        if (user) getInvites();
    }, [user]);
    if (!user) {
        return null;
    }


    return (
        <>

            <h2>
                Profile
            </h2>

            <div className="profile_details">
                <div>
                    <img
                        src={user.picture}
                        alt="Profile"
                        className="profile__avatar"
                    />
                </div>
                <div >
                    <ul>
                        <li><b>Name:</b> {user.name}</li>
                        <li><b>Nickname:</b> {user.nickname}</li>
                        <li><b>Email:</b> {user.email}</li>
                        <li><b>Social login:</b> {user.sub.split("|")[0]}</li>
                    </ul>
                </div>
            </div>

            <h3>
                Invites received:
            </h3>

            <div className="">
                <Tableview data={invites.data} uid={invites.user._id} toggleCollab={toggleCollab} />
            </div>

        </>
    );
};

export default Projects