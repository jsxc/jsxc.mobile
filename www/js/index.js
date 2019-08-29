const initialize = () => {
  document.addEventListener('deviceready', onDeviceReady, false);
};

const onDeviceReady = () => {
  const parentElement = document.getElementById('deviceready');
  const listeningElement = parentElement.querySelector('.listening');
  const receivedElement = parentElement.querySelector('.received');

  listeningElement.setAttribute('style', 'display:none;');
  receivedElement.setAttribute('style', 'display:block;');

  console.log('Device is ready');
};

initialize();
