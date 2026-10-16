import type {Company, Vacancy} from "@/types/vacancyTypes.ts"
import {
    type CheckUpdateType,
    checkUpdateTypes,
    type InterviewUpdateType,
    interviewUpdateTypes,
    type UpdateType,
    type VacancyUpdate
} from "@/types/processUpdateTypes.ts"

export const vacancyStatuses = [
    'Not Applied',
    'Applied',
    'Interviewing',
    'Take Home Task',
    'Trial Period',
    'Checking',
    'Reject',
    'Drop Out',
    'Offer'
] as const

export type VacancyStatus = (typeof vacancyStatuses)[number]

export type VacancyDashboardEntry = {
    vacancy: Vacancy;
    salary: string;
    companyName: string;
    status: VacancyStatus;
    lastUpdate: string;
    nextStep: string;
}

export function lastUpdateToStatusUtil(update: UpdateType | undefined): VacancyStatus {
    if (!update) return 'Not Applied'
    if (update === 'apply' || update === 'recruiterReachOut' || update === 'referral') return 'Applied'
    if (update === 'inviteToInterview') return 'Interviewing'
    if (update === 'takeHomeTask') return 'Take Home Task'
    if (update === 'trialPeriod') return 'Trial Period'
    if (update === 'backgroundCheck' || update === 'referenceCheck' || update === 'securityCheck') return 'Checking'
    if (update === 'reject') return 'Reject'
    if (update === 'selfReject') return 'Drop Out'
    if (update === 'offer') return 'Offer'
    throw new Error('Unexpected update')
}

export function statusToNumberValue(status: VacancyStatus): number {
    if (status === 'Not Applied') return -1000
    if (status === 'Reject' || status === 'Drop Out') return 1000
    if (status === 'Offer') return 500
    if (status === 'Applied') return 0
    if (status === 'Interviewing') return 100
    if (status === 'Take Home Task') return 200
    if (status === 'Trial Period') return 400
    if (status === 'Checking') return 300
    return 0
}

export function updateTypeToHandleUtil(update: UpdateType) {
    if (update === 'apply') return 'Apply'
    if (update === 'reject') return 'Reject'
    if (update === 'referenceCheck') return 'Reference Check'
    if (update === 'backgroundCheck') return 'Background Check'
    if (update === 'offer') return 'Offer'
    if (update === 'inviteToInterview') return 'Interview Invite'
    if (update === 'takeHomeTask') return 'Take Home Task'
    if (update === 'selfReject') return 'Drop Out'
    if (update === 'trialPeriod') return 'Trial Period'
    if (update === 'recruiterReachOut') return 'Recruiter Reach Out'
    if (update === 'referral') return 'Apply With Referral'
    if (update === 'securityCheck') return 'Security Check'
    throw new Error('Unexpected update')
}

export function updateTypeToStepTypeUtil(update: InterviewUpdateType) {
    if (update === 'inviteToInterview') return 'Interview'
    if (update === 'takeHomeTask') return 'Task Deadline'
    if (update === 'trialPeriod') return 'Trial Period End'
    throw new Error('Unexpected update')
}

export function calculateStatuses(vacancies: Array<Vacancy>, updates: Array<VacancyUpdate>): Array<VacancyStatus> {
    function vacancyToStatus(vacancy: Vacancy): VacancyStatus {
        const vacancyUpdates = updates.filter(update => update.vacancyId === vacancy.id)
        const lastUpdate = vacancyUpdates.length > 0 ? vacancyUpdates.reduce(
            (last, cur) => last.datetime.localeCompare(cur.datetime) < 0 ? cur : last
        ) : null

        return lastUpdateToStatusUtil(lastUpdate?.type)
    }
    return vacancies.map(vacancyToStatus)

}

export function aggregateVacancyDataUtil(vacancies: Array<Vacancy>, companies: Array<Company>, updates: Array<VacancyUpdate>): Array<VacancyDashboardEntry> {
    function vacancyToEntry(vacancy: Vacancy): VacancyDashboardEntry {
        const salary = vacancy.salary.type === 'unknown' ? 'unknown' : (
            vacancy.salary.type === 'fixed' ? `$${vacancy.salary.value}` : `$${vacancy.salary.start}-${vacancy.salary.end}`
        )
        const vacancyUpdates = updates.filter(update => update.vacancyId === vacancy.id)
        const lastUpdate = vacancyUpdates.length > 0 ? vacancyUpdates.reduce(
            (last, cur) => last.datetime.localeCompare(cur.datetime) < 0 ? cur : last
        ) : null
        const nextStep = vacancyUpdates
            .filter(update => interviewUpdateTypes.includes(update.type as InterviewUpdateType))
            .reduce((next: null | VacancyUpdate, cur) => {
                if (!lastUpdate || !cur.stepDatetime) return next
                if (cur.stepDatetime.localeCompare(lastUpdate.datetime) > 0 &&
                    (!next?.stepDatetime || cur.stepDatetime.localeCompare(next.stepDatetime) < 0)) return cur
                return next
            },
            null
        )

        return {
            vacancy,
            salary,
            companyName: companies.find(company => company.id === vacancy.companyId)?.name ?? 'Unknown company',
            status: lastUpdateToStatusUtil(lastUpdate?.type),
            lastUpdate: lastUpdate ? `${lastUpdate.datetime} - ${updateTypeToHandleUtil(lastUpdate.type)}` : '-',
            nextStep: nextStep ? `${nextStep.stepDatetime} - ${updateTypeToStepTypeUtil(nextStep.type as InterviewUpdateType)}` : '-',
        }
    }
    return vacancies.map(vacancyToEntry)
}

export const funnelSteps = ['Total', 'Applied', 'Interview', 'Checks', 'Offer'] as const
export type FunnelStep = typeof funnelSteps[number]

export function calculateVacancyFunnel(vacancies: Array<Vacancy>, updates: Array<VacancyUpdate>): Record<FunnelStep, number> {
    const validVacIds = new Set(vacancies.map(vacancy => vacancy.id))
    const vacancyToFunnelPosition = new Map<number, FunnelStep>()
    for (const update of updates) {
        const vacId = update.vacancyId
        if (!validVacIds.has(update.vacancyId)) continue

        const curPosition = vacancyToFunnelPosition.get(vacId)
        if (!curPosition) {
            if (update.type === 'offer') vacancyToFunnelPosition.set(vacId, 'Offer')
            else if (checkUpdateTypes.includes(update.type as CheckUpdateType)) vacancyToFunnelPosition.set(vacId, 'Checks')
            else if (interviewUpdateTypes.includes(update.type as InterviewUpdateType)) vacancyToFunnelPosition.set(vacId, 'Interview')
            else vacancyToFunnelPosition.set(vacId, 'Applied')
        } else if (curPosition === 'Applied') {
            if (update.type === 'offer') vacancyToFunnelPosition.set(vacId, 'Offer')
            else if (checkUpdateTypes.includes(update.type as CheckUpdateType)) vacancyToFunnelPosition.set(vacId, 'Checks')
            else if (interviewUpdateTypes.includes(update.type as InterviewUpdateType)) vacancyToFunnelPosition.set(vacId, 'Interview')
        } else if (curPosition === 'Interview') {
            if (update.type === 'offer') vacancyToFunnelPosition.set(vacId, 'Offer')
            else if (checkUpdateTypes.includes(update.type as CheckUpdateType)) vacancyToFunnelPosition.set(vacId, 'Checks')
        } else if (curPosition === 'Checks') {
            if (update.type === 'offer') vacancyToFunnelPosition.set(vacId, 'Offer')
        }
    }

    const funnel = {
        'Total': vacancies.length,
        'Applied': 0,
        'Interview': 0,
        'Checks': 0,
        'Offer': 0
    }
    vacancyToFunnelPosition.forEach((val) => {
        funnel['Applied'] += 1
        if (val === 'Interview' || val === 'Checks' || val === 'Offer') funnel['Interview'] += 1
        if (val === 'Checks' || val === 'Offer') funnel['Checks'] += 1
        if (val === 'Offer') funnel['Offer'] += 1
    })

    return funnel
}
