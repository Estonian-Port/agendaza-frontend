declare const process: {
  env: {
    PRODUCTION: string;
    API_URL: string;
  };
};

export const environment = {
  production: process.env.PRODUCTION === 'true',
  API_URL: process.env.API_URL
};