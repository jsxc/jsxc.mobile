import { Strophe } from 'strophe.js';
import { parseStanza } from './utilities';
import { Dictionary, Room } from '../types';

/**
 *  Fetches the service's public rooms.
 */
export const getRooms = async ({
  connection,
  service,
}: {
  connection: Strophe.Connection;
  service: string;
}): Promise<Room[]> => {
  const response = await listRoomsAsync({ connection, service });

  /* TODO: Unify IQ parsing */
  const rooms = response.iq.query.item.map(
    (element: Dictionary) => element.attributes,
  );

  return rooms;
};

const listRoomsAsync = ({
  connection,
  service,
}: {
  connection: Strophe.Connection;
  service: string;
}): Promise<Dictionary> => {
  return new Promise((resolve, reject) => {
    connection.muc.listRooms(
      service,
      data => {
        return resolve(parseStanza(data));
      },
      error => {
        return reject(parseStanza(error));
      },
    );
  });
};
