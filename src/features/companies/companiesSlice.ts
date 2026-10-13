import type {Company} from "@/types/vacancyTypes.ts"
import {createSlice, type PayloadAction} from "@reduxjs/toolkit"

type CompaniesState = {
    companies: Array<Company>;
}

const initialState: CompaniesState = {
    companies: []
}

const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        addCompany(state, action: PayloadAction<Company>) {
            state.companies.push(action.payload)
        },
        updateCompany(state, action: PayloadAction<Company>) {
            const idx = state.companies.findIndex(company => company.id === action.payload.id)
            if (idx !== -1) {
                state.companies[idx] = action.payload
            }
        },
        removeCompany(state, action: PayloadAction<number>) {
            state.companies = state.companies.filter(company => company.id !== action.payload)
        },
        clearCompanies() {
            return initialState
        }
    }
})

export const {addCompany, updateCompany, removeCompany, clearCompanies} = companiesSlice.actions
export default companiesSlice.reducer