import { Strophe, $pres } from 'strophe.js';
import has from 'lodash.has';
import get from 'lodash.get';
import { plugins, addPlugins } from './plugins';
import { getContactsList } from './contacts';
import { getRooms, joinRoom } from './multi-user-chat';
import {
  parseStanza,
  extractBareJid,
  decodeConnectionStatus,
} from './utilities';
import { Message, Contact, ConnectionStatus } from '../types';

const { Connection } = Strophe;

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
  onRawInput,
  onRawOutput,
}: {
  url: string;
  username: string;
  password: string;
  onConnectionStatusChange?: (status: ConnectionStatus) => void;
  onContactsLoaded?: (contacts: Contact[]) => void;
  onMessageReceived?: (message: Message) => void;
  onRawInput?: (data: string) => void;
  onRawOutput?: (data: string) => void;
}): Strophe.Connection => {
  const connection = new Connection(url);

  addPlugins([plugins.MUC]);

  if (onRawInput) {
    connection.rawInput = onRawInput;
  }

  if (onRawOutput) {
    connection.rawOutput = onRawOutput;
  }

  connection.connect(username, password, async status => {
    /**
     *  Strophe invokes this callback whenever the connection
     *  status changes.
     */

    const connectionStatus = decodeConnectionStatus(status);

    if (onConnectionStatusChange) {
      onConnectionStatusChange(connectionStatus);
    }

    if (connectionStatus === 'CONNECTED') {
      /* Retrieve contacts list */
      const contacts = await getContactsList({ connection });

      if (onContactsLoaded) {
        onContactsLoaded(contacts);
      }

      /* Set online status */
      connection.send($pres().tree());

      /* Handle incoming messages */
      connection.addHandler(
        stanza => {
          const parsedStanza = parseStanza(stanza);

          /* TODO: Refine code */
          if (has(parsedStanza, 'message.body')) {
            if (onMessageReceived) {
              onMessageReceived({
                from: extractBareJid(
                  get(parsedStanza, 'message.attributes.from'),
                ),
                to: get(parsedStanza, 'message.attributes.to'),
                text: get(parsedStanza, 'message.body._text'),
              });
            }
          }

          return true;
        },
        null,
        'message',
        'chat',
        null,
        null,
      );
    }
  });

  return connection;
};
