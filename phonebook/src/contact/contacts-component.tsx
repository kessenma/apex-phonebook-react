import React from "react";
import styled from "styled-components";
import { ContactShortDisplay } from "./ContactShortDisplay";

const ListWrapper = styled.div`
    max-width: 600px;
    margin: 20px auto;
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ContactList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const ContactItem = styled.li`
    background: #f8f9fa;
    padding: 12px;
    margin: 5px 0;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ContactName = styled.span`
    font-weight: bold;
`;

const ContactEmail = styled.span`
    color: #666;
`;

const ContactShortDisplayStyled = styled(ContactShortDisplay)`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const ContactsComponent = ({ contacts }) => {
	return (
		<ListWrapper>
			<h2>Contacts List</h2>
			<ContactList>
				{contacts.length === 0 ? (
					<p>No contacts available</p>
				) : (
					contacts.map((contact, index) => (
						<ContactItem key={index}>
							<ContactShortDisplayStyled contact={contact} />
						</ContactItem>
					))
				)}
			</ContactList>
		</ListWrapper>
	);
};

export default ContactsComponent;