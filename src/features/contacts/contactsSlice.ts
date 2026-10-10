import type {VacancyContact} from "@/types/types.ts"
import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import {removeVacancy} from "@/features/vacancies/vacanciesSlice.ts"
import {clearCompanies} from "@/features/companies/companiesSlice.ts"

type ContactsState = {
    contacts: Array<VacancyContact>;
}

const initialState: ContactsState = {
    contacts: []
}

const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        addContact(state, action: PayloadAction<VacancyContact>) {
            state.contacts.push(action.payload)
        },
        updateContact(state, action: PayloadAction<VacancyContact>) {
            const idx = state.contacts.findIndex(contact => contact.id === action.payload.id)
            if (idx !== -1) {
                state.contacts[idx] = action.payload
            }
        },
        removeContact(state, action: PayloadAction<number>) {
            state.contacts = state.contacts.filter(contact => contact.id !== action.payload)
        }
    },
    extraReducers: builder => {
        builder.addCase(
            removeVacancy,
            (state, action) => {
                state.contacts = state.contacts.filter(contact => contact.vacancyId !== action.payload)
            }
        ).addCase(
            clearCompanies,
            () => {
                return initialState
            }
        )
    }
})

export const {addContact, updateContact, removeContact} = contactsSlice.actions
export default contactsSlice.reducer