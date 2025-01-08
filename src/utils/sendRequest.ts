import axios from 'axios';

export const sendRequest = async () => {
  const { Local_Host } = process.env;

  try {
    const { data } = await axios.get<string>(`http://${Local_Host}/api`);
    console.log('Server Response:', data);
  } catch (error) {
    console.error('Error making request:', error.message);
  }
};
