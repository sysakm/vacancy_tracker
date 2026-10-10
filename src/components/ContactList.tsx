import type {Company, Vacancy, VacancyContact} from "@/types/vacancyTypes.ts"
import {contactsSelector} from "@/app/selectors.ts"
import {useAppDispatch, useAppSelector} from "@/app/hooks.ts"
import ContactEditorForm from "@/components/ContactEditorForm.tsx"
import {useState} from "react"
import {addContact, removeContact, updateContact} from "@/features/contacts/contactsSlice"
import ContactCard from "@/components/ContactCard.tsx"

type Props = {
    vacancy: Vacancy;
    company?: Company;
}

function ContactList({vacancy, company}: Props) {
    const dispatch = useAppDispatch()
    const contacts = useAppSelector(contactsSelector).filter(contact => contact.vacancyId === vacancy.id)

    const [currentEditingContact, setCurrentEditingContact] = useState<VacancyContact | undefined>(undefined)

    function handleAddContact(newContact: VacancyContact) {
        dispatch(addContact(newContact))
    }
    function handleUpdateContact(newContact: VacancyContact) {
        setCurrentEditingContact(undefined)
        dispatch(updateContact(newContact))
    }
    function handleRemoveContact(id: number) {
        if (currentEditingContact?.id === id) {
            setCurrentEditingContact(undefined)
        }
        dispatch(removeContact(id))
    }
    return (
        <section>
            <h3>Contacts for {vacancy.name} @ {company?.name ?? 'Unknown Company'}</h3>
            {(company?.link || vacancy.link) && <div>
                <h4>Links</h4>
                {company?.link && <a href={company.link}>Company page</a>}
                {vacancy?.link && <a href={vacancy.link}>Vacancy posting</a>}
            </div>}
            <div>
                <h4>Available contacts</h4>
                {contacts.length === 0 && <span>No contacts yet</span>}
                {contacts.map(contact => (contact.id !== currentEditingContact?.id ?
                    <div key={`contact-${contact.id}`}>
                        <ContactCard contact={contact}/>
                        <span>
                            <button type='button' onClick={() => setCurrentEditingContact(contact)}>
                                Edit
                            </button>
                            <button type='button' onClick={() => handleRemoveContact(contact.id)}>
                                Delete
                            </button>
                        </span>
                    </div>
                : <div key={`contact-edit-${contact.id}`}>
                    <ContactEditorForm
                        onSubmit={handleUpdateContact}
                        contact={currentEditingContact}
                        vacancyId={vacancy.id}
                    />
                </div>
                ))}
            </div>
            {!currentEditingContact && <div>
                <h4>Add a new contact</h4>
                <ContactEditorForm
                    key={`contact-editor-${vacancy.id}-${contacts.length}`}
                    onSubmit={handleAddContact}
                    vacancyId={vacancy.id}
                />
            </div>}
        </section>
    )
}

export default ContactList