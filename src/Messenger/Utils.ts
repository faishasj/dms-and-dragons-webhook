import { toggleTyping } from './Messages';
import { wait } from '../Utils';


export const waitTyping = async (psid: string, duration = 1000, personaId?: string): Promise<void> => {
  await toggleTyping(psid, true, personaId);
  await wait(duration);
  toggleTyping(psid, false, personaId);
};
