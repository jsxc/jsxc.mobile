import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

let bodyElement = document.getElementsByTagName('body')[0];

bodyElement.classList.add('jsxc-fullscreen');
bodyElement.classList.add('jsxc-two-columns');

ReactDOM.render(<App />, document.getElementById('root'));
