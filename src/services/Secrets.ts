import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { getGoogleServiceAccount } from './Utils';

const serviceAccount = process.env.NODE_ENV !== 'production' ? getGoogleServiceAccount() : undefined;
const client = new SecretManagerServiceClient({
  credentials: serviceAccount,
});


/** App Secrets */
export type Secret =
  | 'VERIFY_TOKEN'
  | 'PAGE_ACCESS_TOKEN';


const secretName = (name: string): string => `projects/${process.env.NODE_ENV !== 'production'
  ? serviceAccount.project_id
  : process.env.GOOGLE_CLOUD_PROJECT}/secrets/${name}/versions/latest`;

export const getSecret = async (name: Secret): Promise<string> => {
  const [accessResponse] = await client.accessSecretVersion({ name: secretName(name) });
  if (!accessResponse || !accessResponse.payload) return '';
  const secret = accessResponse.payload.data?.toString();
  return secret || '';
};
