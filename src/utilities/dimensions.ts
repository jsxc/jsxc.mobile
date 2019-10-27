import { Dimensions } from 'react-native';

export const getWindowWidth = (): number => Dimensions.get('window').width;

export const getWindowHeight = (): number => Dimensions.get('window').height;
