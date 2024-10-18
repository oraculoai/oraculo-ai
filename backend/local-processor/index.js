import axios from 'axios';

const BACKEND_API_URL = 'https://oraculo-ai-9yun.onrender.com';

const startProcess = async () => {
  try {
    const response = await axios.post(
      BACKEND_API_URL + '/ai-workforce/start-process/pending',
    );

    console.log(response);
  } catch (error) {
    console.error('Error starting process:', error.message);
  }
};

const main = async () => {
  while (true) {
    await startProcess();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

main();
