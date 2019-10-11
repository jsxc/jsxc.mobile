/**
 *  Performs an HTTP GET request
 */
export const httpGET = async (uri: string): Promise<any> => {
  const response = await fetch(uri);
  return response.json();
};
