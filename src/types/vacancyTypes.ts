export const salaryTypes = ['unknown', 'fixed', 'fork'] as const
export type SalaryType = typeof salaryTypes[number]

export type Salary =
    | {type: 'unknown'}
    | {type: 'fixed', value: number}
    | {type: 'fork', start: number, end: number}

export type Vacancy = {
    id: number;
    companyId: number;
    name: string;
    salary: Salary;
    description: string;
    datePosted: string;  // YYYY-MM-DD
    link?: string;
}

export type Company = {
    id: number;
    name: string;
    link?: string;
}

export const contactTypes = ['recruiter', 'manager', 'other'] as const
export type ContactType = typeof contactTypes[number]
export type VacancyContact = {
    id: number;
    vacancyId: number;
    type: ContactType;
    name: string;
    description: string;

    phone?: string;
    email?: string;
    telegram?: string;
}

export type VacancyNote = {
    id: number;
    vacancyId: number;
    note: string;
}