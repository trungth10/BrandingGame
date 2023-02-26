import axios from 'axios';
import {API_URL} from "@/store/API_KEY";

// ----------------------------------------------------------------------

const parseParams = (params) => {
    const keys = Object.keys(params);
    let options = '';

    keys.forEach((key) => {
        const isParamTypeObject = typeof params[key] === 'object';
        const isParamTypeArray =
            isParamTypeObject && Array.isArray(params[key]) && params[key].length > 0;

        if (!isParamTypeObject) {
            options += `${key}=${params[key]}&`;
        }

        if (isParamTypeObject && isParamTypeArray) {
            params[key].forEach((element) => {
                options += `${key}=${element}&`;
            });
        }
    });

    return options ? options.slice(0, -1) : options;
};

const request = axios.create({
    baseURL: API_URL,
    paramsSerializer: (params) => parseParams(params)
});

request.interceptors.request.use((options) => {
    // const { method } = options;

    Object.assign(options.headers, {
        'Content-Type': 'application/json;charset=UTF-8'
    });


    return options;
});

request.interceptors.response.use(
    (response) => response,
    (error) => {
        // const msg = (error.response && error.response.data) || 'Có lỗi xảy ra';
        if (typeof window !== 'undefined') {
            // toast.error(msg, {
            //   position: 'top-right',
            //   autoClose: 3000,
            //   hideProgressBar: false,
            //   closeOnClick: true,
            //   progress: undefined
            // });
        }
        console.log('error from axios', error, error.response);
        return Promise.reject((error.response && error.response.data) || 'Có lỗi xảy ra');
    }
);

export default request;
