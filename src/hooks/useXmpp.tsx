import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from 'react';
import produce from 'immer';
import * as strophe from '../core';
import { match, info, success, warn } from '../utilities';
import { Contact, Thread, Message, ConnectionStatus } from '../types';

type Credentials = {
  url: string;
  username: string;
  password: string;
};

type Connection = {
  status: ConnectionStatus;
};

type Data = {
  contacts: Contact[];
  threads: Thread[];
};

type State = {
  credentials: Credentials;
  connection: Connection;
  data: Data;
};

type Actions = {
  connect: (credentials: Credentials) => void;
  sendMessage: (message: Message) => void;
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
      threads: [],
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
    threads: [],
  });

  const [messageToSend, setMessageToSend] = useState<Message>({
    from: '',
    to: '',
    text: '',
  });

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
        onContactsLoaded: contacts => {
          const threads = contacts.map(contact => ({
            with: contact.jid,
            messages: [],
          }));

          setData(data => ({
            ...data,
            contacts,
            threads,
          }));

          info('Contacts loaded:', contacts.length);
        },
        onMessageReceived: message => {
          /* TODO: Append message to corresponding thread */

          /* TODO: Refactor into reusable function */
          setData(data => {
            /* TODO: Account for non-existent thread */
            const threadIndex = data.threads.findIndex(
              thread => thread.with === message.from,
            );

            /* TODO: Refine code */
            return produce(data, draftData => {
              draftData.threads[threadIndex].messages.unshift(message);
            });
          });

          info('Message received:', message);
        },
      });
    }

    /* TODO: Return destruction function */
  }, [credentials]);

  useEffect(() => {
    if (connectionRef.current && connection.status === 'CONNECTED') {
      strophe.sendMessage({
        connection: connectionRef.current,
        from: messageToSend.from,
        to: messageToSend.to,
        text: messageToSend.text,
      });

      /* TODO: Refactor into reusable function */
      setData(data => {
        /* TODO: Account for non-existent thread */
        const threadIndex = data.threads.findIndex(
          thread => thread.with === messageToSend.to,
        );

        /* TODO: Refine code */
        return produce(data, draftData => {
          draftData.threads[threadIndex].messages.push(messageToSend);
        });
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
