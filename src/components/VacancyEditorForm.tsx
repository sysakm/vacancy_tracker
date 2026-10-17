import {type Company, type Salary, type SalaryType, salaryTypes, type Vacancy} from "@/types/vacancyTypes.ts"
import {useAppSelector} from "@/app/hooks.ts"
import {companiesSelector, nextCompanyIdSelector, nextVacancyIdSelector} from "@/app/selectors.ts"
import {type SubmitEvent, useState} from "react"
import {getCurrentDateUtil} from "@/utils/dateUtils.ts"

type Props = {
    onCreateNewCompany: (companyId: number, name: string, link?: string) => void;
    onSubmit: (formData: Vacancy) => void;
    vacancy?: Vacancy;
    firstUpdateDatetime?: string;
}

function validateForm(
    selectedCompany: Company | undefined, newCompanyName: string, newCompanyLink: string,
    name: string, description: string, date: string, link: string,
    salaryType: SalaryType, salaryFirst: number, salarySecond: number,
    firstUpdateDatetime?: string): string | null {
    if (!selectedCompany && !newCompanyName.trim()) return 'New company name can not be empty'
    if (!selectedCompany && newCompanyLink && !newCompanyLink.trim()) return 'Please enter a valid company link or leave the field empty'
    if (!name.trim()) return 'Vacancy name can not be empty'
    if (!description.trim()) return 'Vacancy description can not be empty'
    if (!date) return 'Please enter the date of posting'
    if (link && !link.trim()) return 'Please enter a valid posting link or leave the field empty'
    if (salaryType === 'fixed' && (isNaN(salaryFirst) || salaryFirst <= 0)) return 'Please enter a valid fixed salary'
    if (salaryType === 'fork' && (
        isNaN(salaryFirst) || salaryFirst <= 0 ||
        isNaN(salarySecond) || salarySecond <= 0 || salaryFirst >= salarySecond)) return 'Please enter a valid salary range'
    if (firstUpdateDatetime && firstUpdateDatetime.slice(0, 10).localeCompare(date) < 0)
        return 'Can not set posting date later than the first present update'
    return null
}

function createSalaryObject(salaryType: SalaryType, salaryFirst: number, salarySecond: number): Salary {
    if (salaryType === 'unknown') return {type: 'unknown'}
    else if (salaryType === 'fixed') return {type: 'fixed', value: salaryFirst}
    else return {type: 'fork', start: salaryFirst, end: salarySecond}
}

function VacancyEditorForm({onCreateNewCompany, onSubmit, vacancy, firstUpdateDatetime}: Props) {
    const [companyId, setCompanyId] = useState(vacancy?.companyId.toString() ?? '')
    const [newCompanyName, setNewCompanyName] = useState('')
    const [newCompanyLink, setNewCompanyLink] = useState('')

    const [name, setName] = useState(vacancy?.name ?? '')
    const [description, setDescription] = useState(vacancy?.description ?? '')
    const [date, setDate] = useState(vacancy?.datePosted ?? getCurrentDateUtil())
    const [link, setLink] = useState(vacancy?.link ?? '')
    const [salaryType, setSalaryType] = useState<SalaryType>(vacancy?.salary.type ?? 'unknown')
    const [salaryFirst, setSalaryFirst] = useState(
        () => {
            if (!vacancy) return 1000
            else if (vacancy.salary.type === 'unknown') return 1000
            else if (vacancy.salary.type === 'fixed') return vacancy.salary.value
            else return vacancy.salary.start
        }
    )
    const [salarySecond, setSalarySecond] = useState(
        () => {
            if (!vacancy) return 1001
            else if (vacancy.salary.type === 'unknown') return 1001
            else if (vacancy.salary.type === 'fixed') return vacancy.salary.value
            else return vacancy.salary.end
        }
    )

    const [error, setError] = useState('')

    const nextId = useAppSelector(nextVacancyIdSelector)
    const nextCompanyId = useAppSelector(nextCompanyIdSelector)
    const companies = useAppSelector(companiesSelector)
    const selectedCompany = companies.find(company => company.id.toString() === companyId)

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const newError = validateForm(
            selectedCompany, newCompanyName, newCompanyLink,
            name, description, date, link,
            salaryType, salaryFirst, salarySecond,
            firstUpdateDatetime
        )
        if (newError) {
            setError(newError)
        } else {
            if (!selectedCompany) {
                onCreateNewCompany(nextCompanyId, newCompanyName.trim(), newCompanyLink.trim())
            }
            onSubmit({
                id: vacancy?.id ?? nextId,
                companyId: selectedCompany?.id ?? nextCompanyId,
                name: name.trim(),
                salary: createSalaryObject(salaryType as SalaryType, salaryFirst, salarySecond),
                description: description.trim(),
                datePosted: date,
                link: link.trim()
            })
            setCompanyId('')
            setNewCompanyName('')
            setNewCompanyLink('')
            setName('')
            setDescription('')
            setDate('')
            setLink('')
            setSalaryType('unknown')
            setSalaryFirst(1000)
            setSalarySecond(1001)
            setError('')
        }
    }

    return (
        <form className='form form--vacancy' onSubmit={handleSubmit}>
            <div className={selectedCompany ? 'form__row' : 'form__row form__row--company'}>
                <label htmlFor='companyId'>
                    <span>Select Company</span>
                    <select id='companyId'
                            value={selectedCompany ? companyId : ''}
                            onChange={(e) => setCompanyId(e.target.value)}>
                        <option value={''}>
                            {companyId && !selectedCompany ? 'Company not found - create a new one' : 'Create new company'}
                        </option>
                        {companies.map(company => (
                            <option key={`company-option-${company.id}`} value={company.id.toString()}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </label>
                {!selectedCompany && <label htmlFor='companyName'>
                    <span>Company Name</span>
                    <input
                        id='companyName' type='text' value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                    />
                </label>}
                {!selectedCompany && <label htmlFor='companyLink'>
                    <span>Company Link</span>
                    <input
                        id='companyLink' type='url' value={newCompanyLink}
                        onChange={(e) => setNewCompanyLink(e.target.value)}
                    />
                </label>}
            </div>
            <label htmlFor='name'>
                <span>Position Name</span>
                <input
                    id='name' type='text' value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label htmlFor='description'>
                <span>Job Description</span>
                <textarea
                    id='description' value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <label htmlFor='date'>
                <span>Date Posted</span>
                <input
                    id='date' type='date' value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </label>
            <label htmlFor='link'>
                <span>Link</span>
                <input
                    id='link' type='url' value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </label>
            <div className={salaryType === 'fork' ? 'form__row form__row--salary' : 'form__row'}>
                <label htmlFor='salaryType'>
                    <span>Select Salary Information</span>
                    <select id='salaryType'
                            value={salaryType}
                            onChange={(e) => setSalaryType(e.target.value as SalaryType)}>
                        {salaryTypes.map(type => (
                            <option key={`salary-type-option-${type}`} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
                {salaryType !== 'unknown' && <label htmlFor='salaryFirst'>
                    <span>{salaryType === 'fork' ? 'From' : 'Value'}</span>
                    <input
                        id='salaryFirst' type='number' value={salaryFirst} min='1' step='1'
                        onChange={(e) => setSalaryFirst(Number(e.target.value))}
                    />
                </label>}
                {salaryType === 'fork' && <label htmlFor='salarySecond'>
                    <span>{'To'}</span>
                    <input
                        id='salarySecond' type='number' value={salarySecond} min='1' step='1'
                        onChange={(e) => setSalarySecond(Number(e.target.value))}
                    />
                </label>}
            </div>
            <div className='record-actions'>
                <button type='submit'>{vacancy ? 'Update vacancy' : 'Add vacancy'}</button>
            </div>
            {error && (<p className='form__error' role='alert'>{error}</p>)}
        </form>
    )
}

export default VacancyEditorForm
