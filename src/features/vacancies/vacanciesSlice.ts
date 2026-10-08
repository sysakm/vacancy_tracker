import type {Vacancy} from "@/types/types.ts"
import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import {clearCompanies, removeCompany} from "@/features/companies/companiesSlice.ts"

type VacanciesState = {
    vacancies: Array<Vacancy>;
}

const initialState: VacanciesState = {
    vacancies: []
}

const vacanciesSlice = createSlice({
    name: 'vacancies',
    initialState,
    reducers: {
        addVacancy(state, action: PayloadAction<Vacancy>) {
            state.vacancies.push(action.payload)
        },
        updateVacancy(state, action: PayloadAction<Vacancy>) {
            const idx = state.vacancies.findIndex(vacancy => vacancy.id === action.payload.id)
            if (idx !== -1) {
                state.vacancies[idx] = action.payload
            }
        },
        removeVacancy(state, action: PayloadAction<number>) {
            state.vacancies = state.vacancies.filter(vacancy => vacancy.id !== action.payload)
        }
    },
    extraReducers: builder => {
        builder.addCase(
            removeCompany,
            (state, action) => {
                state.vacancies = state.vacancies.filter(vacancy => vacancy.companyId !== action.payload)
            }
        ).addCase(
            clearCompanies,
            () => {
                return initialState
            }
        )
    }
})

export const {addVacancy, updateVacancy, removeVacancy} = vacanciesSlice.actions
export default vacanciesSlice.reducer