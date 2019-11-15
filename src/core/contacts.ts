import { Strophe, $iq } from 'strophe.js';
import { sendQuery } from './queries';
import { Dictionary, Contact } from '../types';

/**
 *  Fetches the viewer's contacts list.
 */
export const getContactsList = async ({
  connection,
}: {
  connection: Strophe.Connection;
}): Promise<Contact[]> => {
  const query = $iq({
    type: 'get',
  }).c('query', {
    xmlns: Strophe.NS.ROSTER,
  });

  const response = await sendQuery({ connection, query });

  /* TODO: Handle 0 contacts */
  /* TODO: Handle 1 contact */

  return response.iq.query.item.map(
    (element: Dictionary) => element.attributes,
  );
};
