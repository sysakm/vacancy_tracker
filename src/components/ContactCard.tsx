import type {VacancyContact} from "@/types/vacancyTypes.ts"

type Props = {
    contact: VacancyContact;
}

function ContactCard({contact}: Props) {
    return (
        <article>
            <h5>{contact.name} ({contact.type === 'other' ? 'contact' : contact.type})</h5>
            {contact.description && <p>{contact.description}</p>}
            <dl>
                {contact.phone && <div>
                    <dt>Phone</dt>
                    <dd>{contact.phone}</dd>
                </div>}
                {contact.email && <div>
                    <dt>Email</dt>
                    <dd>{contact.email}</dd>
                </div>}
                {contact.telegram && <div>
                    <dt>Telegram</dt>
                    <dd>@{contact.telegram}</dd>
                </div>}
                {!contact.phone && !contact.email && !contact.telegram && (<p>No contacts found for {contact.name}</p>)}
            </dl>
        </article>
    )
}

export default ContactCard