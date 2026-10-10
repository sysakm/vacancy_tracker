import VacancyEditorForm from "@/components/VacancyEditorForm.tsx"
import {useAppDispatch} from "@/app/hooks.ts"
import { addCompany } from "@/features/companies/companiesSlice"
import type {Vacancy} from "@/types/vacancyTypes.ts"
import {addVacancy} from "@/features/vacancies/vacanciesSlice.ts"
import {useNavigate} from "react-router-dom"

function VacancyCreationPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    function handleCreateNewCompany(id: number, name: string, link: string | undefined) {
        dispatch(addCompany({id, name, link}))
    }
    function handleFormSubmit(newVac: Vacancy) {
        dispatch(addVacancy(newVac))
        navigate('/vacancy/' + newVac.id.toString())
    }

    return (
        <section>
            <h1>Create A Vacancy</h1>
            <VacancyEditorForm
                onCreateNewCompany={handleCreateNewCompany}
                onSubmit={handleFormSubmit}
            />
        </section>
    )
}

export default VacancyCreationPage