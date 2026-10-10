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
        removeCompany(state, action: PayloadAction<number>) {
            state.companies = state.companies.filter(company => company.id !== action.payload)
        },
        clearCompanies() {
            return initialState
        }
    }
})

export const {addCompany, removeCompany, clearCompanies} = companiesSlice.actions
export default companiesSlice.reducer