import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView
} from 'react-native';

import {
  withAuthenticator,
  useAuthenticator
} from '@aws-amplify/ui-react-native';

import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';

import { post, generateClient } from 'aws-amplify/api';

Amplify.configure(amplifyconfig);

// retrieves only the current value of 'user' from 'useAuthenticator'
const userSelector = (context) => [context.user];

const SignOutButton = () => {
  const { user, signOut } = useAuthenticator(userSelector);
  return (
    <Pressable onPress={signOut} style={styles.buttonContainer}>
      <Text style={styles.buttonText}>
        Hello, {user.username}! Click here to sign out!
      </Text>
    </Pressable>
  );
};

const initialState = { name: '', description: '' };
const client = generateClient();



const App = () => {

  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function postTodo() {
    try {

      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);

      const restOperation = post({
        apiName: 'itemsApi',
        path: '/items',
        options: {
          body: todo
        }
      });

      const { body } = await restOperation.response;
      const response = await body.json();

      console.log('POST call succeeded');
      console.log(response);
    } catch (e) {
      console.log('POST call failed: ', e);
    }
  }



  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <SignOutButton />
        <TextInput
          onChangeText={(value) => setInput('name', value)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <TextInput
          onChangeText={(value) => setInput('description', value)}
          style={styles.input}
          value={formState.description}
          placeholder="Description"
        />
        <Pressable onPress={postTodo} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Create item</Text>
        </Pressable>
        {todos.map((todo, index) => (
          <View key={todo.id ? todo.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{todo.name}</Text>
            <Text style={styles.todoDescription}>{todo.description}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default withAuthenticator(App);

const styles = StyleSheet.create({
  container: { width: 400, flex: 1, padding: 20, alignSelf: 'center' },
  todo: { marginBottom: 15 },
  input: {
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 8
  },
  buttonText: { color: 'white', padding: 16, fontSize: 18 }
});