import React, { useState, useEffect } from "react";
import "./App.css";
import ContactsComponent from "./contact/contacts-component";
import ContactForm from "./contact/ContactForm";

function App() {
    const [contacts, setContacts] = useState([]); // Store contacts list
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch initial contacts list when the app loads
        fetch("http://localhost:3001/contacts")
            .then(res => res.json())
            .then(
                result => setContacts(result || []),
                error => setError(error)
            );
    }, []);

    return (
        <div className="App">
            {error && <div>Error: {error.message}</div>}
            <ContactForm
                onError={setError}
                onSuccess={(newContacts) => setContacts(newContacts)}
            />
            <ContactsComponent contacts={contacts} />
        </div>
    );
}

export default App;