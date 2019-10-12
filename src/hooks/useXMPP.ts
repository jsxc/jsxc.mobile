import { useState, useRef, useEffect } from 'react';
import { Strophe } from 'strophe.js';
import { connect, sendMessage } from '../xmpp';

type State = {
  connection: {
    status: string;
  };
  data: {
    receivedMessages: Element[];
  };
};

type Actions = {
  sendMessage: (message: string) => void;
};

const useXMPP = ({
  url,
  username,
  password,
}: {
  url: string;
  username: string;
  password: string;
}): [State, Actions] => {
  const connectionRef = useRef<Strophe.Connection>();

  const [status, setStatus] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState('');

  useEffect(() => {
    connectionRef.current = connect({
      url,
      username,
      password,
      onConnectionStatusChange: setStatus,
      onMessageReceived: message => {
        setReceivedMessages(messages => messages.concat(message));
      },
    });

    /* TODO: Return destruction function */
  }, [url, username, password]);

  useEffect(() => {
    const connection = connectionRef.current;

    if (connection && status === 'CONNECTED') {
      sendMessage({
        connection,
        from: connection.jid,
        to: connection.jid,
        text: messageToSend,
      });
    }
  }, [messageToSend]);

  const state: State = {
    connection: {
      status,
    },
    data: {
      receivedMessages,
    },
  };

  const actions: Actions = {
    sendMessage: setMessageToSend,
  };

  return [state, actions];
};

export default useXMPP;
