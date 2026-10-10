export const startUpdateTypes = [
    'apply', 'recruiterReachOut', 'referral'
] as const
export type StartUpdateType = typeof startUpdateTypes[number]

export const interviewUpdateTypes = [
    'inviteToInterview', 'takeHomeTask', 'trialPeriod'
] as const
export type InterviewUpdateType = typeof interviewUpdateTypes[number]

export const checkUpdateTypes = [
    'securityCheck', 'referenceCheck', 'backgroundCheck'
] as const
export type CheckUpdateType = typeof checkUpdateTypes[number]

export const endUpdateTypes = [
    'offer', 'reject', 'selfReject'
] as const
export type EndUpdateType = typeof endUpdateTypes[number]

export type UpdateType = StartUpdateType | InterviewUpdateType | CheckUpdateType | EndUpdateType

export type VacancyUpdate = {
    id: number;
    vacancyId: number;
    type: UpdateType;
    datetime: string;  // YYYY-MM-DDThh:mm
    description: string;
    stepDatetime?: string;  // YYYY-MM-DDThh:mm
}

export type StepType = 'posted' | UpdateType | 'interview' | 'deadline'
export type VacancyStep = {
    baseId?: number;
    type: StepType;
    datetime: string;
    description: string;
}