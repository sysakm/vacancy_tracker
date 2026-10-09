import type {AppDispatch, RootState} from "@/app/store.ts"
import {removeVacancy} from "@/features/vacancies/vacanciesSlice.ts"
import {removeCompany} from "@/features/companies/companiesSlice.ts"

export function removeCompanyCascade(id: number) {
    return function (dispatch: AppDispatch, getState: () => RootState): void {
        const state = getState()
        const affectedVacancies = state.vacancies.vacancies.filter(vacancy => vacancy.companyId === id)

        affectedVacancies.forEach(vacancy => dispatch(removeVacancy(vacancy.id)))
        dispatch(removeCompany(id))
    }
}