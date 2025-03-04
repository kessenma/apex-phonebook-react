import React, { useState } from "react";
import styled from "styled-components";

const FormWrapper = styled.div`
	max-width: 600px;
	margin: 20px auto;
	padding: 20px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	font-family: "Inter", sans-serif;
`;

const Input = styled.input`
	width: 100%;
	padding: 10px;
	margin: 5px 0;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 16px;
	outline: none;
	transition: all 0.2s ease;

	&:focus {
		border-color: #4a90e2;
		background: #f7f9fc;
	}
`;

const ToggleWrapper = styled.div`
	display: flex;
	gap: 10px;
	margin: 10px 0;
`;

const ToggleButton = styled.button<{ active: boolean }>`
	flex: 1;
	padding: 10px;
	border: none;
	border-radius: 6px;
	font-size: 16px;
	cursor: pointer;
	transition: all 0.2s ease;
	background: ${({ active }) => (active ? "#4a90e2" : "#f0f0f0")};
	color: ${({ active }) => (active ? "white" : "#333")};

	&:hover {
		background: ${({ active }) => (active ? "#357ae8" : "#ddd")};
	}
`;

const Button = styled.button`
	background: #4a90e2;
	color: white;
	padding: 10px 15px;
	border: none;
	border-radius: 6px;
	font-size: 16px;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: #357ae8;
	}
`;

const AddButton = styled(Button)`
	background: #eee;
	color: #333;
	margin-top: 10px;

	&:hover {
		background: #ddd;
	}
`;

const SaveAllButton = styled(Button)`
	background: #28a745;  /* Green to differentiate */
	margin-top: 15px;

	&:hover {
		background: #218838;
	}
`;

const ContactList = styled.ul`
	list-style: none;
	padding: 0;
	margin-top: 20px;
`;

const ContactItem = styled.li`
    background: #f8f9fa;
    padding: 10px;
    margin: 5px 0;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
`;

export default function ContactForm({ onSuccess, onError }) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [gender, setGender] = useState("");
	const [email, setEmail] = useState("");
	const [contacts, setContacts] = useState([]);

	const addContactToList = () => {
		if (!firstName.trim() || !lastName.trim() || !email.trim() || !gender) {
			alert("All fields are required.");
			return;
		}

		const newContact = { firstName, lastName, email, gender };

		// Ensure no empty contact is added
		if (Object.values(newContact).some(value => value.trim() === "")) return;

		setContacts([...contacts, newContact]);

		// Reset form fields AFTER adding a valid contact
		setFirstName("");
		setLastName("");
		setEmail("");
		setGender("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (contacts.length === 0) {
			alert("Add at least one contact before submitting.");
			return;
		}

		try {
			// Send each contact one by one to /contacts
			const savePromises = contacts.map(contact =>
				fetch("http://localhost:3001/contacts", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(contact),
				}).then(res => res.json())
			);

			// Wait for all contacts to be saved
			await Promise.all(savePromises);

			// Fetch the updated contact list from the backend
			const updatedContacts = await fetch("http://localhost:3001/contacts").then(res => res.json());

			onSuccess(updatedContacts); // Update UI with new contacts
			setContacts([]); // Clear pending contacts
		} catch (error) {
			onError(error);
		}
	};

	return (
		<FormWrapper>
			<h2>Create Contacts</h2>
			<form>
				<label>First Name:</label>
				<Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

				<label>Last Name:</label>
				<Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

				<label>Gender:</label>
				<ToggleWrapper>
					<ToggleButton active={gender === "MALE"} onClick={() => setGender("MALE")}>
						Male
					</ToggleButton>
					<ToggleButton active={gender === "FEMALE"} onClick={() => setGender("FEMALE")}>
						Female
					</ToggleButton>
				</ToggleWrapper>

				<label>Email:</label>
				<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

				<AddButton type="button" onClick={addContactToList}>+ Add More</AddButton>
			</form>

			{contacts.length > 0 && (
				<div>
					<h3>Pending Contacts:</h3>
					<ContactList>
						{contacts.map((contact, index) => (
							<ContactItem key={index}>
								{contact.firstName} {contact.lastName} - {contact.gender} - {contact.email}
							</ContactItem>
						))}
					</ContactList>

					{/* "Save All" button only appears when there are pending contacts */}
					<SaveAllButton onClick={handleSubmit}>Save All</SaveAllButton>
				</div>
			)}
		</FormWrapper>
	);
}