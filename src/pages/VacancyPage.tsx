import {useParams} from "react-router-dom"
import {useAppDispatch, useAppSelector} from "@/app/hooks.ts"
import {vacanciesSelector} from "@/app/selectors.ts"
import {addCompany} from "@/features/companies/companiesSlice.ts"
import type {Vacancy} from "@/types/types.ts"
import {updateVacancy} from "@/features/vacancies/vacanciesSlice.ts"
import {useState} from "react"
import VacancyEditorForm from "@/components/VacancyEditorForm.tsx"

function VacancyPage() {
    const params = useParams()
    const vacancy = useAppSelector(vacanciesSelector).find(vac => params.id && vac.id.toString() == params.id)
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false)

    function handleCreateNewCompany(id: number, name: string, link: string | undefined) {
        dispatch(addCompany({id, name, link}))
    }
    function handleFormSubmit(newVac: Vacancy) {
        dispatch(updateVacancy(newVac))
        setIsEditing(false)
    }

    return (
        <section>
            <h1>Vacancy</h1>
            {vacancy ?
                <>
                    <div>
                        {JSON.stringify(vacancy)}
                    </div>
                    {isEditing ? <>
                        <VacancyEditorForm
                            key={vacancy.id}
                            vacancy={vacancy}
                            onCreateNewCompany={handleCreateNewCompany}
                            onSubmit={handleFormSubmit}
                        />
                        <button type='button' onClick={() => setIsEditing(false)}>Leave without editing</button>
                    </> : <button type='button' onClick={() => setIsEditing(true)}>
                        Edit this vacancy
                    </button>}
                </>
            : <p>No such vacancy</p>
            }
        </section>
    )
}

export default VacancyPage