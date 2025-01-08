import { sendRequest } from './sendRequest';

export const startRequestInterval = (interval: number) => {
  setInterval(sendRequest, interval);

  sendRequest();
};
