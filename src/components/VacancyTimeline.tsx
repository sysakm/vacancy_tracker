import type {Company, Vacancy} from "@/types/vacancyTypes.ts"
import {useAppDispatch, useAppSelector} from "@/app/hooks.ts"
import {updatesSelector} from "@/app/selectors.ts"
import type {InterviewUpdateType, VacancyStep, VacancyUpdate} from "@/types/processUpdateTypes.ts"
import {removeUpdate} from "@/features/updates/updatesSlice.ts";
import {updateTypeToHandleUtil, updateTypeToStepTypeUtil} from "@/utils/vacancyUtils.ts"

type Props = {
    vacancy: Vacancy;
    company?: Company;
}

function createTimelineFromUpdates(vacancy: Vacancy, company: Company | undefined, updates: Array<VacancyUpdate>): Array<VacancyStep> {
    let timeline: Array<VacancyStep> = [
        {type: 'posted', label: 'Posted', datetime: `${vacancy.datePosted}T00:00`, description: `${vacancy.name} @ ${company?.name ?? 'Unknown company'}`}
    ]
    for (const update of updates) {
        timeline.push({
            baseId: update.id,
            type: update.type,
            label: updateTypeToHandleUtil(update.type),
            datetime: update.datetime,
            description: update.description
        })
        if (update.stepDatetime) {
            timeline.push({
                type: update.type==='inviteToInterview' ? 'interview' : 'deadline',
                label: updateTypeToStepTypeUtil(update.type as InterviewUpdateType),
                datetime: update.stepDatetime, description: update.description
            })
        }
    }

    return timeline.toSorted((a, b) => a.datetime.localeCompare(b.datetime))
}

function VacancyTimeline({vacancy, company}: Props) {
    const dispatch = useAppDispatch()
    const updates = useAppSelector(updatesSelector).filter(update => update.vacancyId === vacancy.id)
    const timeline = createTimelineFromUpdates(vacancy, company, updates)

    function handleRemoveUpdate(id: number | undefined) {
        if (id) dispatch(removeUpdate(id))
    }

    return (
        <section className='timeline-panel'>
            <h3>Timeline of {vacancy.name} @ {company?.name ?? 'Unknown Company'}</h3>
            <dl className='timeline-list'>
                {timeline.map((step, idx) => (
                    <div key={`${vacancy.id}-step-${idx}`}>
                        <dt>{step.datetime} - {step.label}</dt>
                        <dd>{step.description}</dd>
                        {step.baseId && <dd>
                            <button className='button--danger' type='button' onClick={() => handleRemoveUpdate(step.baseId)}>Delete Update</button>
                        </dd>}
                    </div>
                ))}
            </dl>
        </section>
    )
}
export default VacancyTimeline
