import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "../auth0/login-button";
import { LogoutButton } from "../auth0/logout-button";
import { Link } from "react-router-dom";

function Navigation() {
    const { isAuthenticated } = useAuth0();
    return (
        <>
            <nav className='nav-bar'>
                <div className='nav-container'>
                    <div className='logo'>TasKit</div>
                    <div className='navigation'>
                        <Link to="/">Home</Link>
                        <Link to="/projects">Projects</Link>
                        {isAuthenticated
                            ? <><Link to="/profile">Profile</Link> <LogoutButton /></>
                            : <LoginButton />
                        }
                    </div>
                </div>
            </nav>
        </>
    );
}
export default Navigation