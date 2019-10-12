import { Strophe, $msg } from 'strophe.js';

const { Connection, Status } = Strophe;

/**
 *  Establishes a connection with an
 *  XMPP server using given credentials.
 */
export const connect = ({
  url,
  username,
  password,
  onConnectionStatusChange,
  onMessageReceived,
}: {
  url: string;
  username: string;
  password: string;
  onConnectionStatusChange?: (status: string) => void;
  onMessageReceived?: (message: Element) => void;
}): Strophe.Connection => {
  const connection = new Connection(url);

  connection.connect(username, password, status => {
    if (status === Status.CONNECTED) {
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
 *  Sends a direct message to a recipient.
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
 *  Maps a Strophe connection status constant
 *  from a number to a string.
 *
 *  http://strophe.im/strophejs/doc/1.3.4/files/strophe-umd-js.html#Strophe.Connection_Status_Constants
 */
export const decodeConnectionStatus = (status: Strophe.Status): string => {
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
