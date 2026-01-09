let metaAccessToken: string | null = null;

export const setMetaToken = (token: string) => {
  metaAccessToken = token;
};

export const getMetaToken = () => metaAccessToken;
