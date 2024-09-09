import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, Modal, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment'; // Asegúrate de tener moment.js instalado
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el componente de íconos

const ContactListScreen = ({ route, navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadContacts = useCallback(async () => {
    const storedContacts = await AsyncStorage.getItem('contacts');
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [route.params?.refresh])
  );

  const deleteContact = async (phone) => {
    const updatedContacts = contacts.filter(contact => contact.phone !== phone);
    setContacts(updatedContacts);
    await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
    Alert.alert('Contacto eliminado');
  };

  const handleLongPress = (phone) => {
    Alert.alert(
      'Eliminar Contacto',
      '¿Seguro que quieres eliminar este contacto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteContact(phone) },
      ]
    );
  };

  const handlePress = (contact) => {
    setSelectedContact(contact);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedContact(null);
  };

  

  const getDays = (birthday) => {
    const today = moment();
    const birthdayDate = moment(birthday, 'DD-MM-YYYY').year(today.year());
    if (birthdayDate.isBefore(today, 'day')) {
      return birthdayDate.diff(today, 'days');; // Verde hoy no hay diferencia de dias
      
    } return birthdayDate.diff(today, 'days'); // rojo o azul diferencias de dias ya sea posituva(futuro) negativa (p)
  };

  const getStyle = (birthday) => {
    const daysUntil = getDays(birthday);

    if (daysUntil === 0) {
      return '#4CAF50'; // Verde hoy
    } else if (daysUntil < 0) {
      return '#F44336'; // Rojo pasado
    } else {
      return '#2196F3'; // Azul futuro
    }
  };

  

  const handleAddContact = () => {
    navigation.navigate('AddContact');
    
  };
  

  return (
    
    <View style={styles.container}>
      {contacts.length === 0 ? (
        <View style={styles.noContactsContainer}>
          <Text style={styles.noContactsMessage}>No hay registros</Text>
          <Icon name="frown-o" size={50} color="gray" style={styles.icon} />
        </View>
      ) : (
        <FlatList
        
          data={contacts}
          keyExtractor={(item) => item.phone}
          renderItem={({ item }) => {
            const daysUntil = getDays(item.birthday);
            const absoluteDays = Math.abs(daysUntil);

            return (
            <TouchableOpacity onPress={() => handlePress(item)} onLongPress={() => handleLongPress(item.phone)}>
              <View style={[styles.contactItem, { backgroundColor: getStyle(item.birthday) }]}>
                <Text style={styles.contactText}>{item.name} {item.lastname} </Text>
                <Text style={styles.calculatedays}>
                {daysUntil === 0
                  ? 'Hoy esta cumpliendo años 🥳'
                  : daysUntil < 0
                  ? `Han pasado ${absoluteDays} dias desde su cumpleaños 😔`
                  : `Faltan ${absoluteDays} días para su cumpleaños 😲`}
                </Text>  
              </View>
            </TouchableOpacity>
          );
        }}
        />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddContact}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {selectedContact && (
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.modalScrollContainer}>
                <Text style={styles.modalTitle}>Detalles del Contacto</Text>
                <View style={styles.modalDetailContainer}>
                  <Text style={styles.modalDetailText}>Nombre: {selectedContact.name} {selectedContact.lastname}</Text>
                  <Text style={styles.modalDetailText}>Teléfono: {selectedContact.phone}</Text>
                  <Text style={styles.modalDetailText}>Correo: {selectedContact.email}</Text>
                  <Text style={styles.modalDetailText}>Fecha de Nacimiento: {selectedContact.birthday}</Text>
                  
                </View>
                <Button title="Cerrar" onPress={closeModal} color="#4682b4"  />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  contactItem: {
    padding: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#ddd',
    borderRadius: 20,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 16,
    color: 'black',
  },
  calculatedays: {
    fontSize: 10,
    color: 'black',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: '#4682b4',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDetailContainer: {
    marginBottom: 20,
  },
  modalDetailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  noContactsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContactsMessage: {
    fontSize: 18,
    color: 'gray',
  },
  icon: {
    marginTop: 10,
  },
});

export default ContactListScreen;
