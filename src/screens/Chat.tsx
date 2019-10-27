import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout } from 'react-native-ui-kitten';
import { GiftedChat } from 'react-native-gifted-chat';
import { NavigationStackProp } from 'react-navigation-stack';
import { useXmpp } from '../xmpp';
import { getWindowWidth, getWindowHeight } from '../utilities';

type Props = {
  navigation: NavigationStackProp<{ username: string }>;
};

const Chat = (props: Props) => {
  const { navigation } = props;

  const username = navigation.getParam('username');

  const [state, actions] = useXmpp();

  return (
    <Layout style={styles.container}>
      <GiftedChat
        alwaysShowSend={true}
        user={{ _id: state.credentials.username }}
        messages={
          [
            /* TODO : Inject messages */
          ]
        }
        onSend={([message]) => {
          actions.sendMessage({
            to: username,
            text: message.text,
          });
        }}
      />
    </Layout>
  );
};

Chat.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('username'),
});

const styles = StyleSheet.create({
  container: {
    width: getWindowWidth(),
    height: getWindowHeight() - 65,
  },
  header: {
    alignSelf: 'center',
    margin: 16,
  },
});

export default Chat;
