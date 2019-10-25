import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Avatar, List, ListItem } from 'react-native-ui-kitten';
import { useXmpp } from '../xmpp';

const Chats = () => {
  const [state, actions] = useXmpp();

  return (
    <Layout style={styles.container}>
      <Text style={styles.header} category="h3">
        Contacts
      </Text>

      <List
        data={state.data.contacts}
        renderItem={({ item }) => (
          <ListItem>
            <Avatar
              style={styles.avatar}
              source={{
                uri:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
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
