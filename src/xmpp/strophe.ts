import { Strophe, $msg, $iq } from 'strophe.js';
import { parseXml } from '../utilities';
import { Dictionary } from '../types';

const { Connection, Status } = Strophe;

export type ConnectionStatus =
  | 'ERROR'
  | 'CONNECTING'
  | 'CONNFAIL'
  | 'AUTHENTICATING'
  | 'AUTHFAIL'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'DISCONNECTING'
  | 'ATTACHED'
  | 'REDIRECT'
  | 'CONNTIMEOUT';

export type Contact = {
  jid: string;
  name?: string;
};

/**
 *  Establishes a connection with an XMPP
 *  server using given credentials.
 */
export const connect = ({
  url,
  username,
  password,
  onConnectionStatusChange,
  onMessageReceived,
  onContactsLoaded,
}: {
  url: string;
  username: string;
  password: string;
  onConnectionStatusChange?: (status: ConnectionStatus) => void;
  onMessageReceived?: (message: Element) => void;
  onContactsLoaded?: (contacts: Contact[]) => void;
}): Strophe.Connection => {
  const connection = new Connection(url);

  connection.connect(username, password, async status => {
    if (status === Status.CONNECTED) {
      const contacts = await getContactsList({ connection });

      if (onContactsLoaded) {
        onContactsLoaded(contacts);
      }

      if (onMessageReceived) {
        connection.addHandler(
          message => {
            onMessageReceived(message);
            return true;
          },
          null,
          'message',
          null,
          null,
          null,
        );
      }
    }

    if (onConnectionStatusChange) {
      onConnectionStatusChange(decodeConnectionStatus(status));
    }
  });

  return connection;
};

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

  return response.query.item.map((element: Dictionary) => element.attributes);
};

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
    connection.sendIQ(query, response => {
      return resolve(parseResponse(response));
    });
  });
};

/**
 *  Sends a message to a user.
 */
export const sendMessage = ({
  connection,
  from,
  to,
  text,
}: {
  connection: Strophe.Connection;
  from: string;
  to: string;
  text: string;
}): void => {
  const message = $msg({
    type: 'chat',
    from,
    to,
  })
    .c('body')
    .t(text);

  connection.send(message);
};

export const parseResponse = (xml: Element): Dictionary => {
  return parseXml(xml.innerHTML);
};

/**
 *  Maps a Strophe connection status constant
 *  from a number to a string.
 *
 *  http://strophe.im/strophejs/doc/1.3.4/files/strophe-umd-js.html#Strophe.Connection_Status_Constants
 */
export const decodeConnectionStatus = (
  status: Strophe.Status,
): ConnectionStatus => {
  switch (status) {
    case Status.ERROR:
      return 'ERROR';
    case Status.CONNECTING:
      return 'CONNECTING';
    case Status.CONNFAIL:
      return 'CONNFAIL';
    case Status.AUTHENTICATING:
      return 'AUTHENTICATING';
    case Status.AUTHFAIL:
      return 'AUTHFAIL';
    case Status.CONNECTED:
      return 'CONNECTED';
    case Status.DISCONNECTED:
      return 'DISCONNECTED';
    case Status.DISCONNECTING:
      return 'DISCONNECTING';
    case Status.ATTACHED:
      return 'ATTACHED';
    case Status.REDIRECT:
      return 'REDIRECT';
    case Status.CONNTIMEOUT:
      return 'CONNTIMEOUT';
  }
};
