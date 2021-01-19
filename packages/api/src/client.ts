import axios, { AxiosRequestConfig, AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';

export interface APIClient {
  get: <T>(...args: any[]) => Promise<{ data: T }>;
  post: <T>(...args: any[]) => Promise<{ data: T }>;
  put: <T>(...args: any[]) => Promise<{ data: T }>;
  patch: <T>(...args: any[]) => Promise<{ data: T }>;
  delete: <T>(...args: any[]) => Promise<{ data: T }>;
  head: <T>(...args: any[]) => Promise<{ data: T }>;
}

type ErrorHook = (error: any) => void;
type RespondHook = <T>(promise: AxiosResponse<T>) => void;

class BaseAPIClient implements APIClient {
  private axiosInstance: AxiosInstance;
  private onErrorHooks: ErrorHook[];
  private onRespondHooks: RespondHook[];

  constructor(config: AxiosRequestConfig) {
    this.axiosInstance = axios.create(config);
    this.onErrorHooks = [];
    this.onRespondHooks = [];
  }

  private request = async <T>(
    method: 'get' | 'delete' | 'head' | 'post' | 'put' | 'patch',
    url: string,
    config?: AxiosRequestConfig,
  ) => {
    try {
      const response = await this.axiosInstance.request({ method, url, withCredentials: true, ...config });
      this.onRespondHooks.forEach((hook) => hook<T>(response));
      return response;
    } catch (error) {
      this.onErrorHooks.forEach((hook) => hook(error));
      throw error;
    }
  };

  public onError = (hook: ErrorHook) => {
    this.onErrorHooks.push(hook);
  };

  public onRespond = (hook: RespondHook) => {
    this.onRespondHooks.push(hook);
  };

  public get = <T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return this.request<T>('get', url, config);
  };
  public post = <T>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return this.request<T>('post', url, { data, ...config });
  };
  public put = <T>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return this.request<T>('put', url, { data, ...config });
  };
  public patch = <T>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return this.request<T>('patch', url, { data, ...config });
  };
  public delete = <T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return this.request<T>('delete', url, config);
  };
  public head = <T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return this.request<T>('head', url, config);
  };
}

export default BaseAPIClient;
