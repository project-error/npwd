import axios, { AxiosError } from 'axios';
import { ErrorCode } from '../../../shared/Errors';
import { isEnvBrowser } from './game';
import { NUI_CALLBACK_REGISTER_NAME } from '../../../shared/network';

export const fetch = async (url: string, options: RequestInit = {}) => {
  const response = await window.fetch(`http://localhost:3001${url}`, {
    ...options,
    method: 'POST',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');

declare global {
  interface Window {
    GetParentResourceName: () => string;
  }
}

const getResourceName = () => {
  return 'GetParentResourceName' in window ? window.GetParentResourceName() : 'npwd';
};

export const instance = axios.create({
  method: 'POST',
  baseURL: isEnvBrowser() ? 'http://localhost:3001' : `https://${getResourceName()}`,
  headers: {
    'Content-Type': 'application/json',
    'x-source': id,
    'x-device-id': id,
  },
});

instance.interceptors.request.use((config) => {
  if (isEnvBrowser()) {
    return config;
  }

  config.data = {
    ...config.data,
    path: config.url,
    data: config.data,
  };

  config.url = `/${NUI_CALLBACK_REGISTER_NAME}`;

  return config;
});

export type RequestError = AxiosError<{ ok: false; message: string; error: ErrorCode }>;
