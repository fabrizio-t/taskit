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