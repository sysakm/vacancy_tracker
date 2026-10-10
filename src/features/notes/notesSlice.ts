import type {VacancyNote} from "@/types/vacancyTypes.ts"
import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import {removeVacancy} from "@/features/vacancies/vacanciesSlice.ts"
import {clearCompanies} from "@/features/companies/companiesSlice.ts"

type NotesState = {
    notes: Array<VacancyNote>
}

const initialState: NotesState = {
    notes: []
}

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addNote(state, action: PayloadAction<VacancyNote>) {
            state.notes.push(action.payload)
        },
        updateNote(state, action: PayloadAction<VacancyNote>) {
            const idx = state.notes.findIndex(note => note.id === action.payload.id)
            if (idx !== -1) {
                state.notes[idx] = action.payload
            }
        },
        removeNote(state, action: PayloadAction<number>) {
            state.notes = state.notes.filter(note => note.id !== action.payload)
        }
    },
    extraReducers: builder => {
        builder.addCase(
            removeVacancy,
            (state, action) => {
                state.notes = state.notes.filter(note => note.vacancyId !== action.payload)
            }
        ).addCase(
            clearCompanies,
            () => {
                return initialState
            }
        )
    }
})

export const {addNote, updateNote, removeNote} = notesSlice.actions
export default notesSlice.reducer