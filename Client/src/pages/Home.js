import { Access } from "../auth0/Access.js";
import Img from "../imgs/home.png";
function Home() {
    return (
        <>
            <center>
                <h1>Your Productivity Toolkit</h1>
                <div><Access /></div>
                <img src={Img}></img>
            </center>
        </>
    );
}
export default Home