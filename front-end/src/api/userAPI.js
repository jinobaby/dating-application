import { basicRequest, UserRequest } from "../axios/AxiosCreate";

export const userSignupApi = async (data) => {
    try {
        const response = await basicRequest.post('/User/Signup', data)
        return response;
    } catch (error) {
        console.log('Error from user signup API', error);
        throw error;
    }
}

export const userLoginApi = async (data) => {
    try {
        const response = await basicRequest.post('/User/Login', data)
        return response;
    } catch (error) {
        console.log('Error from user login API', error);
        throw error;
    }
}

