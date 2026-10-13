import type {Company, Vacancy} from "@/types/vacancyTypes.ts"
import {removeCompanyCascade} from "@/features/companies/companiesThunk.ts"
import {useAppDispatch} from "@/app/hooks.ts"
import {type SubmitEvent, useState} from "react"
import {Link} from "react-router-dom"
import {updateCompany} from "@/features/companies/companiesSlice.ts"

type Props = {
    company: Company;
    vacancies: Array<Vacancy>;
}

function validateForm(link: string): string | null {
    if (!link.trim()) return 'Please enter a valid company link'
    return null
}

function CompanyCard({company, vacancies}: Props) {
    const [displayVacancies, setDisplayVacancies] = useState(false)
    const [displayLinkForm, setDisplayLinkForm] = useState(false)
    const [link, setLink] = useState('')

    const [error, setError] = useState('')

    const dispatch = useAppDispatch()

    const isOriginalLinkEmpty = !company.link?.trim()

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const newError = validateForm(link)
        if (newError) {
            setError(newError)
        } else {
            dispatch(updateCompany({id: company.id, name: company.name, link: link.trim()}))
            setDisplayLinkForm(false)
            setLink('')
            setError('')
        }
    }

    return (
        <div key={`company-${company.id}`}>
            {!isOriginalLinkEmpty ? <a href={company.link}>{company.name}</a> : <span>{company.name}</span>}
            {isOriginalLinkEmpty && <button type='button' onClick={() => setDisplayLinkForm(!displayLinkForm)}>
                {displayLinkForm ? 'Close without adding' : 'Add a link'}
            </button>}
            {isOriginalLinkEmpty && displayLinkForm &&
                <form onSubmit={handleSubmit}>
                    <label htmlFor={`companyNewLink-${company.id}`}>
                        <span>Link</span>
                        <input
                            id={`companyNewLink-${company.id}`} type='url' value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </label>
                    <button type='submit'>Save link</button>
                    {error && (<p className='form__error' role='alert'>{error}</p>)}
                </form>
            }
            <button type='button' onClick={() => dispatch(removeCompanyCascade(company.id))}>
                Delete
            </button>
            <button type='button' onClick={() => setDisplayVacancies(!displayVacancies)}>
                {displayVacancies ? 'Hide vacancies' : 'Show vacancies'}
            </button>
            {displayVacancies && vacancies.length > 0 && (vacancies.map(vacancy => <div key={`vacancy-link-${company.id}-${vacancy.id}`}>
                <Link to={`/vacancy/${vacancy.id}`}>{vacancy.name} (posted {vacancy.datePosted})</Link>
            </div>))}
            {displayVacancies && vacancies.length === 0 && <p>No vacancies tracked for {company.name}.</p>}
        </div>
    )
}

export default CompanyCard