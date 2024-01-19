import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/Pagination";

axios.defaults.baseURL = 'https://localhost:7201/api/';
//Receive cookie and set cookie inside our application storage
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

//fake delay while fetching data
const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.interceptors.response.use(async response =>{
    await sleep();
    const pagination = response.headers['pagination'];
    if(pagination){
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }
    return response
}, (error: AxiosError)=>{
    const {data, status} = error.response as AxiosResponse //destructure
    switch (status) {
        case 400: 
        //Xử lý 2 trường hợp bad request và validation (status code đều là 400)
            if(data.errors){
                const modelStateErrors : string[] = [];
                for (const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])                        
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;

        case 401: 
            toast.error(data.title);
            break;

        case 500: 
            router.navigate('/server-error', {state: {error: data}});
            break;

        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details : (id: number) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get('products/filters')
}

const TestErrors ={
    get400Error: () => requests.get('buggy/bad-requests'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidation: () => requests.get('buggy/validation-error')
}

const Cart = {
    get: () => requests.get("/cart"),
    addItem: (productId: number, quantity =1) => requests.post(`cart?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity =1) => requests.delete(`cart?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    TestErrors,
    Cart
}

export default agent;