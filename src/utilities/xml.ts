import { xml2js } from 'xml-js';
import { Dictionary } from '../types';

/**
 *  Converts an XML string to a JS object.
 */
export const parseXml = (xml: string): Dictionary => {
  return xml2js(xml, {
    compact: true,
    attributesKey: 'attributes',
  });
};
