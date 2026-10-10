import {type SubmitEvent, useState} from "react"
import {type ContactType, contactTypes, type VacancyContact} from "@/types/vacancyTypes.ts"
import {useAppSelector} from "@/app/hooks.ts"
import {nextContactIdSelector} from "@/app/selectors.ts"

type Props = {
    onSubmit: (newContact: VacancyContact) => void;
    contact?: VacancyContact;
    vacancyId?: number;
}

function createContact(id: number, vacancyId: number,
                       contactType: ContactType, name: string, description: string,
                       phone: string, email: string, telegram: string ): VacancyContact {
    let obj: VacancyContact = {id, vacancyId, type: contactType, name}
    if (description) obj.description = description
    if (phone) obj.phone = phone
    if (email) obj.email = email
    if (telegram) obj.telegram = telegram
    return obj
}

function ContactEditorForm({onSubmit, contact, vacancyId}: Props) {
    const [contactType, setContactType] = useState<ContactType>(contact?.type ?? 'recruiter')
    const [name, setName] = useState(contact?.name ?? '')
    const [description, setDescription] = useState(contact?.description ?? '')

    const [phone, setPhone] = useState(contact?.phone ?? '')
    const [email, setEmail] = useState(contact?.email ?? '')
    const [telegram, setTelegram] = useState(contact?.telegram ?? '')

    const nextId= useAppSelector(nextContactIdSelector)

    const realVacancyId = contact?.vacancyId ?? vacancyId ?? null

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (realVacancyId) {
            onSubmit(createContact(contact?.id ?? nextId, realVacancyId, contactType, name, description, phone, email, telegram))
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor='contactType'>
                <span>Type</span>
                <select id='contactType'
                        value={contactType}
                        onChange={(e) => setContactType(e.target.value as ContactType)}>
                    {contactTypes.map(type => (
                        <option key={`contact-type-option-${type}`} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </label>
            <label htmlFor='contactName'>
                <span>Name</span>
                <input
                    id='contactName' type='text' value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label htmlFor='contactDescription'>
                <span>Additional Notes</span>
                <textarea
                    id='contactDescription' value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <div>
                <label htmlFor='contactPhone'>
                    <span>Phone</span>
                    <input
                        id='contactPhone' type='tel' value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </label>
                <label htmlFor='contactEmail'>
                    <span>Email</span>
                    <input
                        id='contactEmail' type='email' value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label htmlFor='contactTelegram'>
                    <span>Telegram Handle</span>
                    <input
                        id='contactTelegram' type='text' value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                    />
                </label>
            </div>
            <button type='submit'>{contact ? 'Update contact' : 'Add contact'}</button>
        </form>
    )
}

export default ContactEditorForm