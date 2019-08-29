const app = {
  /* Application constructor */
  initialize: function() {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false,
    );
  },
  /**
   *  deviceready event handler
   *
   *  Bind any cordova events here. Common events are:
   *  'pause', 'resume', etc.
   */
  onDeviceReady: function() {
    this.receivedEvent('deviceready');
  },

  /* Update DOM on a received event */
  receivedEvent: function(id) {
    const parentElement = document.getElementById(id);
    const listeningElement = parentElement.querySelector('.listening');
    const receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  },
};

app.initialize();
