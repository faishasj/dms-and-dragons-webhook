import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { getGoogleServiceAccount } from './Utils';

const serviceAccount = getGoogleServiceAccount();
const client = new SecretManagerServiceClient(process.env.NODE_ENV === 'development' ? {
  credentials: serviceAccount,
} : undefined);


/** App Secrets */
export type Secret =
  | 'VERIFY_TOKEN'
  | 'PAGE_ACCESS_TOKEN';


const secretName = (name: string): string => `projects/${serviceAccount.project_id}/secrets/${name}/versions/latest`;

export const getSecret = async (name: Secret): Promise<string> => {
  const [accessResponse] = await client.accessSecretVersion({ name: secretName(name) });
  if (!accessResponse || !accessResponse.payload) return '';
  const secret = accessResponse.payload.data?.toString();
  return secret || '';
};
