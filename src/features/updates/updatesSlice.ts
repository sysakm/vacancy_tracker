import type {VacancyUpdate} from "@/types/processUpdateTypes.ts"
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {removeVacancy} from "@/features/vacancies/vacanciesSlice.ts";
import {clearCompanies} from "@/features/companies/companiesSlice.ts";

type UpdatesState = {
    updates: Array<VacancyUpdate>;
}

const initialState: UpdatesState = {
    updates: []
}

const updatesSlice = createSlice({
    name: 'updates',
    initialState,
    reducers: {
        addUpdate(state, action: PayloadAction<VacancyUpdate>) {
            state.updates.push(action.payload)
        },
        removeUpdate(state, action: PayloadAction<number>) {
            state.updates = state.updates.filter(update => update.id !== action.payload)
        }
    },
    extraReducers: builder => {
        builder.addCase(
            removeVacancy,
            (state, action) => {
                state.updates = state.updates.filter(update => update.vacancyId !== action.payload)
            }
        ).addCase(
            clearCompanies,
            () => {
                return initialState
            }
        )
    }
})

export const {addUpdate, removeUpdate} = updatesSlice.actions
export default updatesSlice.reducer