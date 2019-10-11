import { Strophe } from 'strophe.js';

const { Status } = Strophe;

/**
 *  Maps a Strophe connection status constant
 *  from a number to a string.
 *
 *  http://strophe.im/strophejs/doc/1.3.4/files/strophe-umd-js.html#Strophe.Connection_Status_Constants
 */
export const decodeConnectionStatusConstant = (status: number): string => {
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
