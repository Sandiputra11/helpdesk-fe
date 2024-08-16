import axios from "axios";
import  errorHandler  from "./errorHandler";

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
    apiDownload: async (uri: string, filename: string,) :Promise<any> => {
        try {
            const resp = await axios({
                url: API + uri,
                method: 'GET',
                responseType: 'blob'
            });

           
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // Adjust the filename as needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
        } catch (error) {
            errorHandler(error)
        }
    },
   
};

export {
    apiService
};