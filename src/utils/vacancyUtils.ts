import type {Company, Vacancy} from "@/types/vacancyTypes.ts"
import {
    type InterviewUpdateType,
    interviewUpdateTypes,
    type UpdateType,
    type VacancyUpdate
} from "@/types/processUpdateTypes.ts"

type VacancyDashboardEntry = {
    vacancy: Vacancy;
    companyName: string;
    status: string;
    lastUpdate: string;
    nextStep: string;
}

export function lastUpdateToStatusUtil(update: UpdateType | undefined): string {
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

export function aggregateVacancyDateUtil(vacancies: Array<Vacancy>, companies: Array<Company>, updates: Array<VacancyUpdate>): Array<VacancyDashboardEntry> {
    function vacancyToEntry(vacancy: Vacancy): VacancyDashboardEntry {
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
            companyName: companies.find(company => company.id === vacancy.companyId)?.name ?? 'Unknown company',
            status: lastUpdateToStatusUtil(lastUpdate?.type),
            lastUpdate: lastUpdate ? `${lastUpdate.datetime} - ${updateTypeToHandleUtil(lastUpdate.type)}` : 'No updates yet',
            nextStep: nextStep ? `${nextStep.stepDatetime} - ${updateTypeToStepTypeUtil(nextStep.type as InterviewUpdateType)}` : '-',
        }
    }
    return vacancies.map(vacancyToEntry)
}