import { Strophe, $msg, $iq, $pres } from 'strophe.js';
import has from 'lodash.has';
import get from 'lodash.get';
import { parseXml } from '../utilities';
import { Message, Contact, ConnectionStatus, Dictionary } from '../types';

const { getBareJidFromJid, Connection, Status } = Strophe;

/**
 *  Establishes a connection with an XMPP
 *  server using given credentials.
 */
export const connect = ({
  url,
  username,
  password,
  onConnectionStatusChange,
  onContactsLoaded,
  onMessageReceived,
}: {
  url: string;
  username: string;
  password: string;
  onConnectionStatusChange?: (status: ConnectionStatus) => void;
  onContactsLoaded?: (contacts: Contact[]) => void;
  onMessageReceived?: (message: Message) => void;
}): Strophe.Connection => {
  const connection = new Connection(url);

  connection.connect(username, password, async status => {
    const connectionStatus = decodeConnectionStatus(status);

    if (onConnectionStatusChange) {
      onConnectionStatusChange(connectionStatus);
    }

    if (connectionStatus === 'CONNECTED') {
      const contacts = await getContactsList({ connection });

      if (onContactsLoaded) {
        onContactsLoaded(contacts);
      }

      if (onMessageReceived) {
        connection.addHandler(
          stanza => {
            const parsedStanza = parseStanza(stanza);

            /* TODO: Refine code */
            if (has(parsedStanza, 'message.body')) {
              onMessageReceived({
                from: extractBareJid(
                  get(parsedStanza, 'message.attributes.from'),
                ),
                to: get(parsedStanza, 'message.attributes.to'),
                text: get(parsedStanza, 'message.body._text'),
              });
            }

            return true;
          },
          null,
          'message',
          'chat',
          null,
          null,
        );

        connection.send($pres().tree());
      }
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

  return response.iq.query.item.map(
    (element: Dictionary) => element.attributes,
  );
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
    connection.sendIQ(query, stanza => {
      return resolve(parseStanza(stanza));
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

/**
 *  Converts an XML stanza to a JS object.
 */
export const parseStanza = (xml: Element): Dictionary => {
  return parseXml(xml.outerHTML);
};

/**
 *  Removes the resource component from a full
 *  JID to get a bare JID.
 */
export const extractBareJid = (fullJid: string): string => {
  return getBareJidFromJid(fullJid);
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
