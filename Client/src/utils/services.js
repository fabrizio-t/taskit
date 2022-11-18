import { useDispatch } from 'react-redux';

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
    color: '#ffffff',
    priority: '2'
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
    let month = months[date.getMonth()]
    let day = getShortDate(d).split(" ")[0];
    let year = date.getFullYear();
    return `${day} ${month}, ${year}`;//${time} -
}

export const helpProject = () => (`
        <h3>Create a project to manage a group of activities:</h3>
        <ul>
        <li>Add a title, description and a deadline</li>
        <li>Add team members by specifying their email address. Once they log in with a corresponding email,
        they will see an invitation to join the project in their "Profile" section.</li>
        <li>Once somebody joins the project they will be moved from the "Invite" list to the team list</li>
        <li>You can remove members from the project by removing them from the team list and saving the project</li>
        <li>On the top left of the project, click on the 3 vertical dots to edit or delete the project</li>
        </ul>
        <h3>Create Tasks and ToDo lists:</h3>
        <ul>
        <li>Click on a project to begin scheduling  your activities (tasks)</li>
        <li>Click on "new task" to schedule a new activity</li>
        <li>Click on the task and then on "New Todo" to break down the task in smaller activities (ToDos)</li>
        <li>Click on the number corrisponding to a specific ToDo to change it's status</li>
        <li>When all the ToDo are "green", the task progress bar will show "100%"</li>
        <li>You can associate tags to every task so that you can later research and filter tasks according to them</li>
        <li>Tou can add the special tag "milestone" to mark a task as a milestone for the project. When all the "milestone" tasks are completed, the overall progress bar of the project will show "100%"</li>
        </ul>
        `);

export const helpTask = () => (`
        <h3>Create Tasks and ToDo lists:</h3>
        <ul>
        <li>Click on "new task" to schedule a new activity</li>
        <li>Click on the task and then on "New Todo" to break down the task in smaller activities (ToDos)</li>
        <li>Click on the number corrisponding to a specific ToDo to change it's status</li>
        <li>When all the ToDo are "green", the task progress bar will show "100%"</li>
        <li>You can associate tags to every task so that you can later research and filter tasks according to them</li>
        <li>Tou can add the special tag "milestone" to mark a task as a milestone for the project. When all the "milestone" tasks are completed, the overall progress bar of the project will show "100%"</li>
        </ul>
        `);
