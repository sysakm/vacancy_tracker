import {type Salary, type SalaryType, salaryTypes, type Vacancy} from "@/types/types.ts"
import {useAppSelector} from "@/app/hooks.ts"
import {companiesSelector, nextCompanyIdSelector, nextVacancyIdSelector} from "@/app/selectors.ts"
import {type SubmitEvent, useState} from "react"
import {getCurrentDateUtil} from "@/utils/dateUtils.ts";

type Props = {
    onCreateNewCompany: (companyId: number, name: string, link?: string) => void;
    onSubmit: (formData: Vacancy) => void;
    vacancy?: Vacancy;
}

function createSalaryObject(salaryType: SalaryType, salaryFirst: number, salarySecond: number): Salary {
    if (salaryType === 'unknown') return {type: 'unknown'}
    else if (salaryType === 'fixed') return {type: 'fixed', value: salaryFirst}
    else return {type: 'fork', start: salaryFirst, end: salarySecond}
}

function VacancyEditorForm({onCreateNewCompany, onSubmit, vacancy}: Props) {
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

    const nextId = useAppSelector(nextVacancyIdSelector)
    const nextCompanyId = useAppSelector(nextCompanyIdSelector)
    const companies = useAppSelector(companiesSelector)
    const selectedCompany = companies.find(company => company.id.toString() === companyId)

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!selectedCompany) {
            onCreateNewCompany(nextCompanyId, newCompanyName, newCompanyLink)
        }
        onSubmit({
            id: vacancy?.id ?? nextId,
            companyId: selectedCompany?.id ?? nextCompanyId,
            name,
            salary: createSalaryObject(salaryType as SalaryType, salaryFirst, salarySecond),
            description,
            datePosted: date,
            link
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
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
                <input
                    id='description' type='text' value={description}
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
            <div>
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
            <div>
                <button type='submit'>{vacancy ? 'Update vacancy' : 'Add vacancy'}</button>
            </div>
        </form>
    )
}

export default VacancyEditorForm