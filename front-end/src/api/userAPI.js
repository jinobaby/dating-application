import { basicRequest, UserRequest } from "../axios/AxiosCreate";

export const userSignupApi = async ( data ) => {
    try {
        var response = await basicRequest.post('/User/Signup', data)
        console.log(response.data);
        alert(response.data.message)
        
    } catch  (error) {
        console.log('Error from user signup API', error);
        
    }
}

export const userLoginApi = async ( data ) => {
    try {
        var response = await basicRequest.post('User/login', data)
        console.log(response);
        return response;
    } catch (error) {
        console.log('Error from user login API', error);
    }
}

