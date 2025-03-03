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
	margin-right: 10px;

	&:hover {
		background: #ddd;
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
	const [gender, setGender] = useState(""); // Toggle between "MALE" or "FEMALE"
	const [email, setEmail] = useState("");
	const [contacts, setContacts] = useState([]);

	const addContactToList = () => {
		if (!firstName || !lastName || !email || !gender) {
			alert("All fields are required");
			return;
		}

		setContacts([...contacts, { firstName, lastName, email, gender }]);
		setFirstName("");
		setLastName("");
		setEmail("");
		setGender(""); // Reset gender selection
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (contacts.length === 0) {
			alert("Add at least one contact before submitting.");
			return;
		}

		fetch("http://localhost:3001/contacts/bulk", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ contacts }),
		})
			.then((res) => res.json())
			.then(
				(result) => {
					onSuccess(result);
					setContacts([]);
				},
				(error) => onError(error)
			);
	};

	return (
		<FormWrapper>
			<h2>Create Contacts</h2>
			<form onSubmit={handleSubmit}>
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
				<Button type="submit">Save All</Button>
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
				</div>
			)}
		</FormWrapper>
	);
}