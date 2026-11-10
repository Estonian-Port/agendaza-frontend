declare const process: {
  env: {
    NG_APP_REST_SERVER_URL: string;
  };
};

export const environment = {
  REST_SERVER_URL: process.env.NG_APP_REST_SERVER_URL
};