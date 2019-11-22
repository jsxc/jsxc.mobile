import { Strophe } from 'strophe.js';
import mucPlugin from 'strophejs-plugin-muc';
import { Dictionary } from '../types';

type Plugin = {
  name: string;
  prototype: Dictionary;
};

/**
 *  Extends the connection object with the specified plugin.
 */
export const addPlugins = (plugins: Plugin[]): void => {
  plugins.forEach(plugin => {
    Strophe.addConnectionPlugin(plugin.name, plugin.prototype);
  });
};

export const plugins = {
  MUC: { name: 'muc', prototype: mucPlugin },
};
