import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Avatar, List, ListItem } from 'react-native-ui-kitten';
import { NavigationStackProp } from 'react-navigation-stack';
import { useXmpp } from '../xmpp';

type Props = {
  navigation: NavigationStackProp;
};

const Chats = (props: Props) => {
  const { navigation } = props;

  const [state, actions] = useXmpp();

  return (
    <Layout style={styles.container}>
      <Text style={styles.header} category="h3">
        Contacts
      </Text>

      <List
        data={state.data.contacts}
        renderItem={({ item }) => (
          <ListItem
            onPress={() => {
              navigation.navigate('Chat', { username: item.jid });
            }}
          >
            <Avatar
              style={styles.avatar}
              source={{
                uri:
                  'http://dental266-2i09v4zdrcmtpsrxer.stackpathdns.com/wp-content/uploads/2015/07/placeholder_avatar.png',
              }}
            />

            <Text>{item.name || item.jid}</Text>
          </ListItem>
        )}
        keyExtractor={contact => contact.jid}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    alignSelf: 'center',
    margin: 16,
  },
  avatar: {
    marginLeft: 8,
    marginRight: 16,
  },
});

export default Chats;
