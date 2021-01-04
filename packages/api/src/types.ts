export interface Client {
  get: <T>(...args: any[]) => Promise<{ data: T }>;
  post: <T>(...args: any[]) => Promise<{ data: T }>;
  put: <T>(...args: any[]) => Promise<{ data: T }>;
  patch: <T>(...args: any[]) => Promise<{ data: T }>;
  delete: <T>(...args: any[]) => Promise<{ data: T }>;
  head: <T>(...args: any[]) => Promise<{ data: T }>;
}
