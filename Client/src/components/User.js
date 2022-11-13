
function User({ user }) {
    return (
        <>
            <img className="user_img" src={user.picture}></img>
            <span className="user">{user.nickname}</span>
        </>
    );
}
export default User