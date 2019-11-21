import { Strophe, $pres } from 'strophe.js';
import has from 'lodash.has';
import get from 'lodash.get';
import { getContactsList } from './contacts';
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

  if (onRawInput) {
    connection.rawInput = onRawInput;
  }

  if (onRawOutput) {
    connection.rawOutput = onRawOutput;
  }

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
