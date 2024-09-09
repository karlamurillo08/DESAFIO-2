import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');  // Puede ser el nombre de usuario o el correo electrónico
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    const storedEmail = await AsyncStorage.getItem('email');
    const storedPassword = await AsyncStorage.getItem('password');

    // Verificar si el identificador es el usuario o el correo
    const isUserOrEmailValid = (identifier === storedUser || identifier === storedEmail);

    if (isUserOrEmailValid && password === storedPassword) {
      navigation.navigate('Drawer');
    } else {
      Alert.alert('Error', 'Usuario, correo o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Usuario o correo electrónico" 
        value={identifier}
        onChangeText={setIdentifier} 
        keyboardType="default"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        value={password} 
        secureTextEntry 
        onChangeText={setPassword} 
      />

      <Button title="Iniciar sesión" onPress={handleLogin} />

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButton}>Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 5,
  },
});


