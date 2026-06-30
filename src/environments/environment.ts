declare const process: {
  env: {
    NG_APP_PRODUCTION: string;
    NG_APP_REST_SERVER_URL: string;
  };
};

export const environment = {
  production: process.env.NG_APP_PRODUCTION === 'true',
  REST_SERVER_URL: process.env.NG_APP_REST_SERVER_URL
};