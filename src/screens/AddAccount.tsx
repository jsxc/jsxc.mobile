import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { withStyles, createStyles } from '@material-ui/styles';
import { KeyboardArrowRight } from '@material-ui/icons';
import classNames from 'classnames';
import { AccountManager, httpGET } from '../utils';
import ImageLogo from '../assets/jsxc-icon-white.svg';

const styles = ({ spacing }) =>
  createStyles({
    root: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: '#2e7bcf',
      zIndex: 999,
    },
    inner: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 500,
      margin: 'auto',
      color: 'white',
      marginTop: 40,
      padding: 30,
    },
    button: {
      color: 'white',
      marginTop: spacing(3),
      float: 'right',
    },
    buttonDisabled: {
      color: 'rgba(255,255,255,0.7)',
    },
    label: {
      color: 'rgba(255,255,255,0.8)',
    },
    field: {
      color: 'white',
      marginBottom: spacing(2),
      '&:before': {
        borderColor: 'rgba(255,255,255,0.5)',
      },
      '&:hover:before': {
        borderColor: 'rgba(255,255,255,0.5) !important',
      },
    },
    warning: {
      padding: '1rem 3rem',
      marginTop: 24,
      backgroundColor: '#214a75',
    },
  });

const STATUS = {
  Idle: 0,
  Connecting: 1,
  Connected: 2,
};

class AddAccount extends React.Component<any, any> {
  state = {
    status: STATUS.Idle,
    warning: '',
    jid: '',
    password: '',
  };

  /**
   *  Fetches the BOSH URL for a given domain
   */
  fetchBoshUrl = async (domain: string): Promise<string> => {
    try {
      const response = await httpGET(
        /* https://github.com/ar-maged/XCDaaS */
        `https://xcdaas.now.sh/api/discover/${domain}`,
      );

      return response.data.services.xbosh[0].server;
    } catch (error) {
      console.error('Could not fetch BOSH URL for domain: ' + domain);
    }
  };

  onChange = name => ev => {
    let value = ev.target.value;

    this.setState({ [name]: value });
    this.setState({ warning: '' });
  };

  onSubmit = async ev => {
    ev.preventDefault();

    this.setState({ status: STATUS.Connecting });

    const { jid, password } = this.state;

    const domain = this.getDomainFromJid(jid);

    try {
      const url = await this.fetchBoshUrl(domain);

      await (window as any).JSXC.testBOSHServer(url, domain);
      await this.props.jsxc.start(url, jid, password);

      AccountManager.get().add(url, jid, password);

      this.setState({ status: STATUS.Connected });
      this.props.onConnected();
    } catch (error) {
      if (typeof error === 'string') {
        this.setState({ warning: error });
      } else if (error.message) {
        this.setState({ warning: error.message });
      } else {
        this.setState({
          warning:
            'Sorry we could not connect. Maybe your Jabber ID or password is wrong.',
        });
      }

      this.setState({ status: STATUS.Idle });
    }
  };

  getDomainFromJid(jid) {
    let parts = jid.split('@');

    return parts[1];
  }

  render() {
    const { classes } = this.props;
    const { status } = this.state;
    const disabled = status === STATUS.Connecting;
    let buttonLabel = disabled ? 'Connecting...' : 'Connect';

    return (
      <div className={classes.root}>
        <div className={classes.inner}>
          <img
            src={ImageLogo}
            style={{ maxWidth: '100%', margin: 40, minWidth: 180 }}
            alt="Logo"
          />

          <form onSubmit={this.onSubmit}>
            <TextField
              type="email"
              disabled={disabled}
              required
              label="Jabber Id"
              onChange={this.onChange('jid')}
              InputProps={{
                className: classes.field,
              }}
              InputLabelProps={{
                className: classes.label,
              }}
              autoComplete="off"
              fullWidth
            />
            <TextField
              type="password"
              disabled={disabled}
              required
              label="Password"
              onChange={this.onChange('password')}
              InputProps={{
                className: classes.field,
              }}
              InputLabelProps={{
                className: classes.label,
              }}
              autoComplete="off"
              fullWidth
            />

            {/* @TODO clear button */}
            <Button
              type="submit"
              disabled={disabled}
              className={classNames(
                classes.button,
                disabled && classes.buttonDisabled,
              )}
              color="primary"
            >
              {buttonLabel} <KeyboardArrowRight />
            </Button>
            <div style={{ clear: 'both' }} />

            {this.state.warning ? (
              <div className={classes.warning}>{this.state.warning}</div>
            ) : (
              ''
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AddAccount);
