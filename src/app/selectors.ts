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

export const notesSelector = (state: RootState) => state.notes.notes
export const nextNoteIdSelector = (state: RootState): number => {
    if (state.notes.notes.length) {
        return 1 + Math.max(...state.notes.notes.map(vacancy => vacancy.id))
    } else {
        return 1
    }
}

export const contactsSelector = (state: RootState) => state.contacts.contacts
export const nextContactIdSelector = (state: RootState): number => {
    if (state.contacts.contacts.length) {
        return 1 + Math.max(...state.contacts.contacts.map(vacancy => vacancy.id))
    } else {
        return 1
    }
}

export const updatesSelector = (state: RootState) => state.updates.updates
export const nextUpdateIdSelector = (state: RootState): number => {
    if (state.updates.updates.length) {
        return 1 + Math.max(...state.updates.updates.map(vacancy => vacancy.id))
    } else {
        return 1
    }
}