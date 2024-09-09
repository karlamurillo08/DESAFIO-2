import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const AddContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const validateFields = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return false;
    }
    if (!lastname.trim()) {
      Alert.alert('Error', 'El apellido es obligatorio.');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'El teléfono es obligatorio.');
      return false;
    }
    if (!/^\d+$/.test(phone)) {
      Alert.alert('Error', 'El teléfono debe contener solo números.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'El correo es obligatorio.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'El correo electrónico no es válido.');
      return false;
    }
    if (!birthday || birthday.toString() === 'Invalid Date') {
      Alert.alert('Error', 'La fecha de nacimiento es obligatoria.');
      return false;
    }
    return true;
  };
  

  const handleSaveContact = async () => {
    if (!validateFields()) return;

    const newContact = {
      name,
      lastname,
      phone,
      email,
      birthday: formattedBirthday, // Formato DD-MM-YYYY
      
    };

    // Verificar si el contacto ya existe
    let contacts = await AsyncStorage.getItem('contacts');
    contacts = contacts ? JSON.parse(contacts) : [];

    const contactExists = contacts.some(contact => contact.phone === newContact.phone);
    
    if (contactExists) {
      Alert.alert('Error', 'El contacto con este número de teléfono ya existe.');
      return;
    }

    // Si el contacto no existe, agregarlo
    contacts.push(newContact);
    await AsyncStorage.setItem('contacts', JSON.stringify(contacts));

    // Limpiar los campos del formulario
    setName('');
    setLastname('');
    setPhone('');
    setEmail('');
    setBirthday(new Date()); // Reiniciar la fecha de cumpleaños al valor predeterminado
    
    // Mostrar mensaje de éxito y navegar
    Alert.alert('Contacto guardado', '', [
      { text: 'OK', onPress: () => navigation.navigate('Contacts', { refresh: true }) }
    ]);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const formattedBirthday = moment(birthday).format('DD-MM-YYYY');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastname}
        onChangeText={setLastname}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento"
        value={formattedBirthday}
        onFocus={() => setShowPicker(true)} // Show picker on focus
        editable={true} // Prevent manual editing
      />
      {showPicker && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Button 
       style={styles.button} 
       title="Guardar Contacto" 
       onPress={handleSaveContact} 
       color="#4682b4" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 12,
  },
  birthdayMessage: {
    fontSize: 14,
    color: '#fff',
  },
});

export default AddContactScreen;







