
// Services Utilities

if (process.env.NODE_ENV === 'development' && !process.env.GOOGLE_SERVICE_ACCOUNT)
  throw new Error('Missing Google Service Account Environment Variable');


export const getGoogleServiceAccount = () => 
  JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT as string, 'base64').toString('ascii'));
