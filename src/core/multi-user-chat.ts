import { Strophe } from 'strophe.js';
import has from 'lodash.has';
import get from 'lodash.get';
import { parseStanza, extractBareJid, extractResource } from './utilities';
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

export const joinRoom = ({
  connection,
  roomJid,
  nickname,
  onMessageReceived,
}: {
  connection: Strophe.Connection;
  roomJid: string;
  nickname?: string;
  onMessageReceived?: (message: Dictionary) => void;
}): void => {
  /* TODO: Account for nickname conflict error */
  connection.muc.join(roomJid, nickname, data => {
    const parsedData = parseStanza(data);

    if (has(parsedData, 'message.body')) {
      if (onMessageReceived) {
        onMessageReceived({
          /* TODO: How to get JID instead of nickname? */
          from: extractResource(get(parsedData, 'message.attributes.from')),
          to: extractBareJid(get(parsedData, 'message.attributes.to')),
          text: get(parsedData, 'message.body._text'),
        });
      }
    }

    return true;
  });
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
