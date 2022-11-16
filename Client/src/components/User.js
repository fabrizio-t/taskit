
function User({ user }) {
    return (
        <>
            <img alt="user profile" className="user_img" src={user.picture}></img>
            <span className="user">{user.nickname}</span>
        </>
    );
}
export default User