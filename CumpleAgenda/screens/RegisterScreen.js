import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!user || !email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      await AsyncStorage.setItem('user', user);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);

      Alert.alert('Registro exitoso');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el registro');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nombre de usuario" 
        value={user} 
        onChangeText={setUser} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="Correo electrónico" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        value={password} 
        secureTextEntry 
        onChangeText={setPassword} 
      />

      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
