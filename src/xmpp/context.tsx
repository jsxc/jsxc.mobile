import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from 'react';
import * as strophe from './strophe';
import { match, info, success, warn } from '../utilities';

type Credentials = {
  url: string;
  username: string;
  password: string;
};

type Connection = {
  status: strophe.ConnectionStatus;
};

type Data = {
  contacts: strophe.Contact[];
  receivedMessages: Element[];
};

type State = {
  credentials: Credentials;
  connection: Connection;
  data: Data;
};

type Actions = {
  connect: (credentials: Credentials) => void;
  sendMessage: (message: string) => void;
};

export const XmppContext = createContext<[State, Actions]>([
  {
    credentials: {
      url: null,
      username: null,
      password: null,
    },
    connection: {
      status: null,
    },
    data: {
      contacts: [],
      receivedMessages: [],
    },
  },
  {
    connect: () => {},
    sendMessage: () => {},
  },
]);

export const XmppProvider: React.FC = ({ children }) => {
  const connectionRef = useRef<Strophe.Connection>();

  const [credentials, setCredentials] = useState<Credentials>({
    url: null,
    username: null,
    password: null,
  });

  const [connection, setConnection] = useState<Connection>({
    status: null,
  });

  const [data, setData] = useState<Data>({
    contacts: [],
    receivedMessages: [],
  });

  const [messageToSend, setMessageToSend] = useState<string>('');

  useEffect(() => {
    const { url, username, password } = credentials;

    if (url && username && password) {
      connectionRef.current = strophe.connect({
        url,
        username,
        password,
        onConnectionStatusChange: status => {
          setConnection({
            status,
          });

          const loggingFunction = match([
            { if: 'CONNECTED', then: success },
            { if: 'AUTHFAIL', then: warn },
          ])(info)(status);

          loggingFunction('Connection status changed to:', status);
        },
        onMessageReceived: message => {
          setData(data => ({
            ...data,
            receivedMessages: data.receivedMessages.concat(message),
          }));

          info('Message received:', message);
        },
        onContactsLoaded: contacts => {
          setData(data => ({
            ...data,
            contacts,
          }));

          info('Contacts loaded:', contacts.length);
        },
      });
    }

    /* TODO: Return destruction function */
  }, [credentials]);

  useEffect(() => {
    const connection = connectionRef.current;

    if (connection && status === 'CONNECTED') {
      strophe.sendMessage({
        connection,
        from: connection.jid,
        to: connection.jid,
        text: messageToSend,
      });

      info('Message sent:', messageToSend);
    }
  }, [messageToSend]);

  const state: State = {
    credentials,
    connection,
    data,
  };

  const actions: Actions = {
    connect: setCredentials,
    sendMessage: setMessageToSend,
  };

  return (
    <XmppContext.Provider value={[state, actions]}>
      {children}
    </XmppContext.Provider>
  );
};

export const useXmpp = (): [State, Actions] => {
  return useContext<[State, Actions]>(XmppContext);
};
