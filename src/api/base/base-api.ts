import axios, { type AxiosInstance } from 'axios';

export class BaseApi {
  protected instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: `${import.meta.env.VITE_APP_API_URL}`,
      withCredentials: false,
    });
  }

  protected getAxiosInstance() {
    return this.instance;
  }
}
