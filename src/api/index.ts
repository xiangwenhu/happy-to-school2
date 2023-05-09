import axios from 'axios';

export function getPageContent(url: string, cookie: string = "") {
    return axios.get(url, {
        headers: {
            cookie
        }
    })
}
