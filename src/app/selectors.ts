import type {RootState} from "@/app/store.ts"

export const companiesSelector = (state: RootState) => state.companies.companies
export const nextCompanyIdSelector = (state: RootState): number => {
    if (state.companies.companies.length) {
        return 1 + Math.max(...state.companies.companies.map(company => company.id))
    } else {
        return 1
    }
}

export const vacanciesSelector = (state: RootState) => state.vacancies.vacancies
export const nextVacancyIdSelector = (state: RootState): number => {
    if (state.vacancies.vacancies.length) {
        return 1 + Math.max(...state.vacancies.vacancies.map(vacancy => vacancy.id))
    } else {
        return 1
    }
}