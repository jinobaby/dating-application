import axios from 'axios';

var Baseurl = import.meta.env.VITE_BASE_URL;

export const basicRequest = axios.create({
    baseURL: Baseurl,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const UserRequest = axios.create({
    baseURL: Baseurl
})

UserRequest.interceptors.request.use(
    (config) => {
        var persistLogindata = localStorage.getItem('persist:logindata')
        var Logindata = persistLogindata ? JSON.parse(persistLogindata) : {}
        var loginInfo = Logindata.UserLogin ? JSON.parse(Logindata.UserLogin).UserLoginStore : null
        var Token = loginInfo.Token
        if (Token) {
            config.headers.Authorization = `${Token}`
        }
        return config
    }
)