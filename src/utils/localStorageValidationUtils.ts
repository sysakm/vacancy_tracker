import {
    type Company, type ContactType, contactTypes,
    type Salary,
    type SalaryType,
    salaryTypes,
    type Vacancy,
    type VacancyContact, type VacancyNote
} from "@/types/vacancyTypes.ts"
import type {RootState} from "@/app/store.ts"
import {
    allUpdateTypes,
    type InterviewUpdateType,
    interviewUpdateTypes,
    type UpdateType,
    type VacancyUpdate
} from "@/types/processUpdateTypes.ts"

function validateUniqueIds<T extends {id: number}>(entries: Array<T>) {
    const encountered = new Set<number>()
    for (const entry of entries) {
        if (typeof entry.id !== 'number' || entry.id <= 0 || !Number.isInteger(entry.id) || encountered.has(entry.id)) {
            return false
        } else {
            encountered.add(entry.id)
        }
    }
    return true
}

function validateCompanyIdsPresent<T extends {companyId: number}>(entries: Array<T>, companies: Array<Company>) {
    const companyIds = companies.map(company => company.id)
    for (const entry of entries) {
        if (!companyIds.includes(entry.companyId)) {
            return false
        }
    }
    return true
}

function validateVacancyIdsPresent<T extends {vacancyId: number}>(entries: Array<T>, vacancies: Array<Vacancy>) {
    const vacancyIds = vacancies.map(vacancy => vacancy.id)
    for (const entry of entries) {
        if (!vacancyIds.includes(entry.vacancyId)) {
            return false
        }
    }
    return true
}

function validateNonEmptyString(str: string) {
    return !!str.trim()
}

function validateOptionalNonEmptyString(object: Record<string, unknown>, key: string) {
    return !(key in object) || (typeof object[key] === 'string' && !!object[key].trim())
}

function validateISODateString(date: string) {
    if (date.length !== 10) return false
    const parts = date.split('-')
    if (parts.length !== 3) return false

    const [yearStr, monthStr, dayStr] = parts
    if (yearStr.length !== 4 || monthStr.length !== 2 || dayStr.length !== 2) return false

    const year = Number(yearStr)
    const month = Number(monthStr)
    const day = Number(dayStr)
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return false
    if (year <= 0 || month <= 0 || day <= 0) return false
    const parsedDate = new Date(Date.UTC(year, month - 1, day))

    return (
        parsedDate.getUTCFullYear() === year &&
        parsedDate.getUTCMonth() === month - 1 &&
        parsedDate.getUTCDate() === day
    )
}

function validateISOTimeString(time: string) {
    if (time.length !== 5) return false
    const parts = time.split(':')
    if (parts.length !== 2) return false

    const [hourStr, minStr] = parts
    if (hourStr.length !== 2 || minStr.length !== 2) return false

    const hour = Number(hourStr);
    const min = Number(minStr);
    if (Number.isNaN(hour) || Number.isNaN(min)) return false

    return (
        hour >= 0 && hour < 24 &&
        min >= 0 && min < 60
    )
}

function validateISODatetimeString(datetime: string) {
    if (datetime.length !== 16) return false
    const parts = datetime.split('T')
    if (parts.length !== 2) return false
    return validateISODateString(parts[0]) && validateISOTimeString(parts[1])
}

function validateMoneyNumber(value: number, allowZero: boolean, allowNonInteger: boolean) {
    if (isNaN(value) || !isFinite(value)) return false
    if (value < 0) return false
    if (value === 0 && !allowZero) return false
    return allowNonInteger || Number.isInteger(value)
}

function validateSalaryObject(salary: unknown): salary is Salary {
    if (typeof salary !== 'object' || salary === null) return false
    if (!('type' in salary) || !salaryTypes.includes(salary.type as SalaryType)) return false
    if (salary.type === 'fixed' && (
        !('value' in salary) || typeof salary.value !== 'number' || !validateMoneyNumber(salary.value, false, false)
    )) return false
    if (salary.type === 'fork' && (
        !('start' in salary) || typeof salary.start !== 'number' || !validateMoneyNumber(salary.start, false, false) ||
        !('end' in salary) || typeof salary.end !== 'number' || !validateMoneyNumber(salary.end, false, false) ||
        salary.start >= salary.end
    )) return false
    return true
}

function validateCompany(company: unknown): company is Company {
    if (typeof company !== 'object' || company === null) return false
    if (!('id' in company)) return false
    if (!('name' in company) || typeof company.name !== 'string' || !validateNonEmptyString(company.name)) return false
    if ('link' in company && typeof company.link !== 'string') return false
    return true
}

function validateVacancy(vacancy: unknown): vacancy is Vacancy {
    if (typeof vacancy !== 'object' || vacancy === null) return false
    if (!('id' in vacancy)) return false
    if (!('companyId' in vacancy)) return false
    if (!('name' in vacancy) || typeof vacancy.name !== 'string' || !validateNonEmptyString(vacancy.name)) return false
    if (!('salary' in vacancy) || !validateSalaryObject(vacancy.salary)) return false
    if (!('description' in vacancy) || typeof vacancy.description !== 'string' || !validateNonEmptyString(vacancy.description)) return false
    if (!('datePosted' in vacancy) || typeof vacancy.datePosted !== 'string' || !validateISODateString(vacancy.datePosted)) return false
    if ('link' in vacancy && typeof vacancy.link !== 'string') return false
    return true
}

function validateContact(contact: unknown): contact is VacancyContact {
    if (typeof contact !== 'object' || contact === null) return false
    if (!('id' in contact)) return false
    if (!('vacancyId' in contact)) return false
    if (!('type' in contact) || typeof contact.type !== 'string' || !contactTypes.includes(contact.type as ContactType)) return false
    if (!('name' in contact) || typeof contact.name !== 'string' || !validateNonEmptyString(contact.name)) return false
    if (!('description' in contact) || typeof contact.description !== 'string' || !validateNonEmptyString(contact.description)) return false
    if (!validateOptionalNonEmptyString(contact, 'phone')) return false
    if (!validateOptionalNonEmptyString(contact, 'email')) return false
    if (!validateOptionalNonEmptyString(contact, 'telegram')) return false
    if (!('phone' in contact) && !('email' in contact) && !('telegram' in contact)) return false
    return true
}

function validateNote(note: unknown): note is VacancyNote {
    if (typeof note !== 'object' || note === null) return false
    if (!('id' in note)) return false
    if (!('vacancyId' in note)) return false
    if (!('note' in note) || typeof note.note !== 'string' || !validateNonEmptyString(note.note)) return false
    return true
}

function validateUpdate(update: unknown): update is VacancyUpdate {
    if (typeof update !== 'object' || update === null) return false
    if (!('id' in update)) return false
    if (!('vacancyId' in update)) return false
    if (!('type' in update) || typeof update.type !== 'string' || !allUpdateTypes.includes(update.type as UpdateType)) return false
    if (!('datetime' in update) || typeof update.datetime !== 'string' || !validateISODatetimeString(update.datetime)) return false
    if (!('description' in update) || typeof update.description !== 'string' || !validateNonEmptyString(update.description)) return false
    if (interviewUpdateTypes.includes(update.type as InterviewUpdateType)) {
        if (!('stepDatetime' in update) || typeof update.stepDatetime !== 'string' ||
            !validateISODatetimeString(update.stepDatetime) || update.datetime.localeCompare(update.stepDatetime) > 0) return false
    } else {
        if ('stepDatetime' in update && (
                typeof update.stepDatetime !== 'string' ||
                !validateISODatetimeString(update.stepDatetime) ||
                update.datetime.localeCompare(update.stepDatetime) > 0
            )) return false
    }
    return true
}

function validateUpdateForVacancy(update: VacancyUpdate, vacancy: Vacancy) {
    if (update.datetime.slice(0, 10) < vacancy.datePosted) return false
    if (update.stepDatetime && update.stepDatetime.slice(0, 10) < vacancy.datePosted) return false
    return true
}

function validateArray(array: unknown): array is Array<unknown> {
    return Array.isArray(array)
}

export function validateRootState(state: unknown): state is RootState {
    if (typeof state !== 'object' || state === null) return false

    if (!('companies' in state) || typeof state.companies !== 'object' || state.companies === null) return false
    if (!('companies' in state.companies) || !validateArray(state.companies.companies)) return false
    if (!state.companies.companies.every(company => validateCompany(company))) return false
    if (!validateUniqueIds(state.companies.companies)) return false

    if (!('vacancies' in state) || typeof state.vacancies !== 'object' || state.vacancies === null) return false
    if (!('vacancies' in state.vacancies) || !validateArray(state.vacancies.vacancies)) return false
    if (!state.vacancies.vacancies.every(vacancy => validateVacancy(vacancy))) return false
    if (!validateUniqueIds(state.vacancies.vacancies)) return false
    if (!validateCompanyIdsPresent(state.vacancies.vacancies, state.companies.companies)) return false

    if (!('contacts' in state) || typeof state.contacts !== 'object' || state.contacts === null) return false
    if (!('contacts' in state.contacts) || !validateArray(state.contacts.contacts)) return false
    if (!state.contacts.contacts.every(contact => validateContact(contact))) return false
    if (!validateUniqueIds(state.contacts.contacts)) return false
    if (!validateVacancyIdsPresent(state.contacts.contacts, state.vacancies.vacancies)) return false

    if (!('notes' in state) || typeof state.notes !== 'object' || state.notes === null) return false
    if (!('notes' in state.notes) || !validateArray(state.notes.notes)) return false
    if (!state.notes.notes.every(note => validateNote(note))) return false
    if (!validateUniqueIds(state.notes.notes)) return false
    if (!validateVacancyIdsPresent(state.notes.notes, state.vacancies.vacancies)) return false

    if (!('updates' in state) || typeof state.updates !== 'object' || state.updates === null) return false
    if (!('updates' in state.updates) || !validateArray(state.updates.updates)) return false
    if (!state.updates.updates.every(update => validateUpdate(update))) return false
    if (!validateUniqueIds(state.updates.updates)) return false
    if (!validateVacancyIdsPresent(state.updates.updates, state.vacancies.vacancies)) return false
    for (const update of state.updates.updates) {
        const vacancy = state.vacancies.vacancies.find(vacancy => vacancy.id === update.vacancyId)
        if (!vacancy || !validateUpdateForVacancy(update, vacancy)) return false
    }

    return true
}