const initialize = () => {
  document.addEventListener('deviceready', onDeviceReady, false);
};

const onDeviceReady = () => {
  console.log('✅ Device is ready');

  const domain = 'uni-konstanz.de';
  const url = 'https://xmpp.uni-konstanz.de:5280/http-bind/';

  const jsxc = initializeJSXC({
    domain,
    url,
  });

  $('#login').click(() => {
    const username = $('#username').val();
    const password = $('#password').val();

    connectToXMPPServer({
      jsxc,
      domain,
      url,
      username,
      password,
    });

    return false;
  });
};

const initializeJSXC = ({ domain, url }) => {
  return new JSXC({
    loadConnectionOptions: () => {
      return Promise.resolve({
        xmpp: {
          domain,
          url,
        },
      });
    },
  });
};

const connectToXMPPServer = ({ jsxc, domain, url, username, password }) => {
  const jid = [username, '@', domain].join('');

  jsxc
    .start(url, jid, password)
    .then(() => {
      console.log('✅ Connected to XMPP server');
    })
    .catch(() => {
      console.log('❌ Failed to connect to XMPP server');
    });
};

initialize();
