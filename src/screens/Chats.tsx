import React from 'react';
import { View, StyleSheet } from 'react-native';
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
          <ListItem style={styles.listItem}>
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
        ListFooterComponent={<View style={styles.footer} />}
        keyExtractor={contact => contact.jid}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 8,
    alignSelf: 'center',
  },
  listItem: {
    borderTopColor: '#eee',
    borderTopWidth: 0.5,
  },
  avatar: {
    marginLeft: 8,
    marginRight: 16,
  },
  footer: {
    borderTopColor: '#eee',
    borderTopWidth: 0.5,
  },
});

export default Chats;
