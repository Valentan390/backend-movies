import axios from 'axios';

export const sendRequest = async () => {
  const { APP_DOMAIN } = process.env;

  try {
    const { data } = await axios.get<string>(`http://${APP_DOMAIN}/api`);
    console.log('Server Response:', data);
  } catch (error) {
    console.error('Error making request:', error.message);
  }
};
