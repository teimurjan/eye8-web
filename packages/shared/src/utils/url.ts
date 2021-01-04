import { match } from 'react-router';

export const getNumberParam = <T extends { [key: string]: string }>(
  m: match<T>,
  paramKey: keyof T,
): number | undefined => {
  const paramStr = m.params[paramKey];

  return paramStr ? parseInt(paramStr, 10) : undefined;
};

export const formatMediaURL = (url: string) => (url.startsWith('/') ? `${process.env.CLIENT_API_URL}${url}` : url);

export const withPublicURL = (url: string) => `${process.env.PUBLIC_URL || ''}${url.startsWith('/') ? '' : '/'}${url}`;

export const getCookieDomain = () =>
  process.env.PUBLIC_URL ? `.${process.env.PUBLIC_URL.replace('https://', '')}` : undefined;
