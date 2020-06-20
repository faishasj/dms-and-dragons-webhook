import axios, { AxiosInstance } from 'axios';


let messengerApi: AxiosInstance | null = null;


export const init = (accessToken: string): void => {
  messengerApi = axios.create({
    baseURL: 'https://graph.facebook.com/v7.0/',
    headers: { 'Content-Type': 'application/json' },
  });
  messengerApi.interceptors.request.use((config) => ({
    ...config,
    params: { ...config.params, access_token: accessToken },
  }));
};


export const getApi = (): AxiosInstance => {
  if (!messengerApi) throw new Error('Messenger API must be initialized before being used');
  return messengerApi;
};
