export type Contact = {
  jid: string;
  name?: string;
};

export type Room = {
  jid: string;
  name: string;
};

export type Thread = {
  with: string;
  messages: Message[];
};

export type Message = {
  from: string;
  to: string;
  text: string;
};

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
