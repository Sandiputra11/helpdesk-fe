import axios from "axios";
import  errorHandler  from "./errorHandler";
import dayjs from "dayjs";

const API = 'http://127.0.0.1:8000'

const apiService = {
    apiGet: async (uri: string, params: any = {}) :Promise<any> => {
        try {
            let res = await axios.get(
                API + uri, { params: params }
            );

            return res;            
        } catch (error) {
            errorHandler(error);
        }
    },
    apiPost: async (uri: string, body: any, options: any = {}) :Promise<any> => {
        try {
            let res = await axios.post(
                API + uri, body, options
            );

            return res;
        } catch (error) {
            errorHandler(error);
        }
    },
    apiPut: async (uri: string, body: any) :Promise<any> => {
        try {
            let res = await axios.put(
                API + uri, body
            );

            return res;      
        } catch (error) {
            errorHandler(error);
        }
    },
    apiDelete: async (uri: string, data: any) :Promise<any> => {
        try {
            let res = await axios.delete(
                API + uri, { data }
            );

            return res;      
        } catch (error) {
            errorHandler(error);
        }
    },
    apiDownload: async (uri: string, params?: any, filename?: string, type?: string) :Promise<any> => {
        try {
            const resp = await axios({
                url: API + uri,
                method: 'GET',
                params: params,
                responseType: 'blob'
            });

            const date = dayjs(new Date()).format('DD-MMM-YYYY')
        
            const fileURL = window.URL.createObjectURL(new Blob([resp.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', filename + '-' + date + '.' + type);
            document.body.appendChild(fileLink);
            fileLink.click();
        
            document.body.removeChild(fileLink);
            window.URL.revokeObjectURL(fileURL);
        } catch (error) {
            errorHandler(error)
        }
    },
   
};

export {
    apiService
};