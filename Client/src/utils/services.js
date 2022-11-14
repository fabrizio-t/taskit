
const url = process.env.REACT_APP_API_SERVER_URL;
/* const url = 'https://cw-events-092017.herokuapp.com' */

export const apiSend = (endpoint, method, token, body) => {
    const opt = {
        method: method,
        headers: { 'content-type': 'application/json' }
    }
    if (token) opt['headers']['Authorization'] = `Bearer ${token}`;
    if (body) opt['body'] = JSON.stringify(body);
    return fetch(url + endpoint, opt)
        .then(result => result.json())
        .catch(error => console.log(error));
}

export const registerUserAndGetProjects = async (accessToken, { sub, nickname, picture, email }) => {
    await apiSend('/user', 'POST', accessToken, { sub, nickname, picture, email });
    const data = await apiSend('/projects', 'GET', accessToken);
    console.log("API RESPONSE:", data);
    return data;
}

export const formInitial = () => ({
    name: '',
    deadline: new Date().toISOString().slice(0, 16),
    color: '',
    priority: ''
});

export function getShortDate(d) {

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let date = new Date(d);
    let day = '' + date.getDate();
    if (day.substring(-1) === '1') day = day + "st";
    else if (day.substring(-1) === '2') day = day + "nd";
    else if (day.substring(-1) === '3') day = day + "rd";
    else day = day + "th";

    return day + ' ' + months[date.getMonth()];
}

export function getFullDate(d) {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date(d);
    let time = date.toLocaleString('en-UK', { hour: 'numeric', minute: 'numeric', hour12: true });
    let month = months[date.getMonth()]
    let day = getShortDate(d).split(" ")[0];
    let year = date.getFullYear();
    return `${day} ${month}, ${year}`;//${time} -
}