import {Link, useNavigate, useParams} from "react-router-dom"
import {useAppDispatch, useAppSelector} from "@/app/hooks.ts"
import {companiesSelector, vacanciesSelector} from "@/app/selectors.ts"
import {addCompany} from "@/features/companies/companiesSlice.ts"
import type {Vacancy} from "@/types/vacancyTypes.ts"
import {removeVacancy, updateVacancy} from "@/features/vacancies/vacanciesSlice.ts"
import {useState} from "react"
import VacancyEditorForm from "@/components/VacancyEditorForm.tsx"
import VacancyCard from "@/components/VacancyCard.tsx"
import NoteList from "@/components/NoteList.tsx"
import ContactList from "@/components/ContactList.tsx"
import UpdateAdditionForm from "@/components/UpdateAdditionForm.tsx";
import VacancyTimeline from "@/components/VacancyTimeline.tsx";

const subPageEntries = [
    'description', 'timeline', 'contacts', 'notes'
] as const

function VacancyPage() {
    const navigate = useNavigate()
    const params = useParams()
    const vacancy = useAppSelector(vacanciesSelector)
        .find(vac => params.id && vac.id.toString() === params.id)
    const company = useAppSelector(companiesSelector)
        .find(comp => comp.id === vacancy?.companyId)
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [subPage, setSubPage] = useState<typeof subPageEntries[number]>('description')

    function handleCreateNewCompany(id: number, name: string, link: string | undefined) {
        dispatch(addCompany({id, name, link}))
    }
    function handleFormSubmit(newVac: Vacancy) {
        dispatch(updateVacancy(newVac))
        setIsEditing(false)
    }
    function handleDeleteVacancy() {
        if (vacancy) {
            dispatch(removeVacancy(vacancy.id))
            navigate('/')
        }
    }

    return (
        <section className='page page--vacancy'>
            <h1>{vacancy ? `${vacancy.name} @ ${company?.name ?? 'Unknown Company'}` : 'Error displaying vacancy'}</h1>
            {vacancy ?
                <>
                    <nav className='vacancy-page__tabs' aria-label='Vacancy details'>
                        {subPageEntries.map(entry => (
                            <button className='vacancy-page__tab' key={'sub-page'+entry} type='button' aria-pressed={subPage===entry} disabled={subPage===entry} onClick={() => setSubPage(entry)}>
                                {entry}
                            </button>
                        ))}
                    </nav>
                    {subPage === 'description' && (<>
                        <VacancyCard vacancy={vacancy} company={company}/>
                        <div className='vacancy-page__actions'>
                            {isEditing ?
                                <>
                                    <VacancyEditorForm
                                        key={vacancy.id}
                                        vacancy={vacancy}
                                        onCreateNewCompany={handleCreateNewCompany}
                                        onSubmit={handleFormSubmit}
                                    />
                                    <button className='button--quiet' type='button' onClick={() => setIsEditing(false)}>Leave without editing</button>
                                </>
                                :
                                <button type='button' onClick={() => setIsEditing(true)}>
                                    Edit this vacancy
                                </button>
                            }
                            <button className='button--danger' type='button' onClick={handleDeleteVacancy}>
                                Delete vacancy
                            </button>
                        </div>
                    </>)}
                    {subPage === 'contacts' && (
                        <ContactList vacancy={vacancy} company={company}/>
                    )}
                    {subPage === 'notes' && (
                        <NoteList vacancy={vacancy} company={company}/>
                    )}
                    {subPage === 'timeline' && (
                        <>
                            <VacancyTimeline vacancy={vacancy} company={company}/>
                            <UpdateAdditionForm vacancy={vacancy}/>
                        </>
                    )}
                </>
            :
                <>
                    <p>Something went wrong - no such vacancy in store</p>
                    <Link to='/'>Back To Dashboard</Link>
                </>
            }
        </section>
    )
}

export default VacancyPage
