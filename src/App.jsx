
import { useState, useEffect } from 'react';
import { getContacts, addContact, updateContact,deleteContact } from './component/axxioss';
import FilterComponent from './component/filter';
import PersonForm from './component/personform';
import Persons from './component/persons';
import './index.css';
import Notification from './component/alerta';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modedit, setModEdit] = useState(false);
  const [personToUpdate, setPersonToUpdate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    getContacts().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const updatePerson = (id, personObject) => {
    return updateContact(id, personObject)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        return returnedPerson;
      })
      .catch(error => {
        alert(`El contacto '${personObject.name}' ya fue eliminado del servidor`)
        setPersons(persons.filter(n => n.id !== id))
        throw error;
      });
  };
  
  const addOrUpdatePerson = (event) => {
    event.preventDefault();
    if (modedit && personToUpdate) {
      // Verificar si el contacto aún existe
      const personExists = persons.find(person => person.id === personToUpdate.id);
      if (personExists) {
        const updatedPerson = { ...personToUpdate, name: newName, number: newNumber };
        updatePerson(personToUpdate.id, updatedPerson)
          .then(() => {
            setModEdit(false);
            setPersonToUpdate(null);
            setNewName('');
            setNewNumber('');
          })
          .catch(error => console.error(error));
      } else {
        setErrorMessage(`El contacto ya fue eliminado del servidor`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setModEdit(false);
        setPersonToUpdate(null);
        setNewName('');
        setNewNumber('');
      }
    } else {
      const personExists = persons.find(person => person.name === newName);
      if (personExists) {
        setErrorMessage(`'${newName}' ya está en la agenda telefónica`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        const updatedPerson = { ...personExists, name: newName, number: newNumber };
        updatePerson(personExists.id, updatedPerson)
          .then(() => {
            setNewName('');
            setNewNumber('');
          })
          .catch(error => console.error(error));
      } else {
        const personObject = {
          name: newName,
          number: newNumber,
        };
        addContact(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => console.error(error));
      }
    }
  };
  

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
}
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const edicion = (objeto) => {
    setNewName(objeto.name);
    setNewNumber(objeto.number);
    setModEdit(true);
    setPersonToUpdate(objeto);
  };
  const deletePerson = (id) => {
    deleteContact(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
      })
      .catch(error => console.error(error));
  };
  

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} />
      <div>
      <FilterComponent searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>
      </div>
      <>
      <h1>ADD CONTACT</h1>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addOrUpdatePerson={addOrUpdatePerson}
        modedit={modedit}
      />
      </>
      <h1>Numbers</h1>
      <Persons
        persons={persons}
        searchTerm={searchTerm}
        edicion={edicion}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;