import {Link, useNavigate, useParams} from "react-router-dom"
import {useAppDispatch, useAppSelector} from "@/app/hooks.ts"
import {companiesSelector, vacanciesSelector} from "@/app/selectors.ts"
import {addCompany} from "@/features/companies/companiesSlice.ts"
import type {Vacancy} from "@/types/types.ts"
import {removeVacancy, updateVacancy} from "@/features/vacancies/vacanciesSlice.ts"
import {useState} from "react"
import VacancyEditorForm from "@/components/VacancyEditorForm.tsx"
import VacancyCard from "@/components/VacancyCard.tsx";

const subPageEntries = [
    'description', 'contacts'
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
        <section>
            <h1>{vacancy ? `${vacancy.name} @ ${company?.name ?? 'Unknown Company'}` : 'Error displaying vacancy'}</h1>
            {vacancy ?
                <>
                    <nav>
                        {subPageEntries.map(entry => (
                            <button key={'sub-page'+entry} type='button' disabled={subPage===entry} onClick={() => setSubPage(entry)}>
                                {entry}
                            </button>
                        ))}
                    </nav>
                    {subPage === 'description' && (<>
                        <VacancyCard vacancy={vacancy} company={company}/>
                        <div>
                            {isEditing ?
                                <>
                                    <VacancyEditorForm
                                        key={vacancy.id}
                                        vacancy={vacancy}
                                        onCreateNewCompany={handleCreateNewCompany}
                                        onSubmit={handleFormSubmit}
                                    />
                                    <button type='button' onClick={() => setIsEditing(false)}>Leave without editing</button>
                                </>
                                :
                                <button type='button' onClick={() => setIsEditing(true)}>
                                    Edit this vacancy
                                </button>
                            }
                            <button type='button' onClick={handleDeleteVacancy}>
                                Delete vacancy
                            </button>
                        </div>
                    </>)}
                    {subPage === 'contacts' && (<>
                        {company?.link && <a href={company.link}>Company page</a>}
                        {vacancy?.link && <a href={vacancy.link}>Vacancy posting</a>}
                    </>)}
                </>
            :
                <>
                    <p>Something went wrong - no such trip in store</p>
                    <Link to='/'>Back To Dashboard</Link>
                </>
            }
        </section>
    )
}

export default VacancyPage