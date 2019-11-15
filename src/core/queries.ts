import { Strophe } from 'strophe.js';
import { parseStanza } from './utilities';
import { Dictionary } from '../types';

/**
 *  Sends an info query.
 */
export const sendQuery = ({
  connection,
  query,
}: {
  connection: Strophe.Connection;
  query: Strophe.Builder;
}): Promise<Dictionary> => {
  return new Promise(resolve => {
    connection.sendIQ(query, stanza => {
      return resolve(parseStanza(stanza));
    });
  });
};
