import {type SubmitEvent, useState} from "react"
import type {Vacancy} from "@/types/vacancyTypes.ts"
import {useAppDispatch, useAppSelector} from "@/app/hooks.ts"
import {nextUpdateIdSelector} from "@/app/selectors.ts"
import {
    allUpdateTypes,
    checkUpdateTypes, endUpdateTypes,
    type InterviewUpdateType,
    interviewUpdateTypes,
    startUpdateTypes,
    type UpdateType
} from "@/types/processUpdateTypes.ts"
import {addUpdate} from "@/features/updates/updatesSlice.ts"

type Props = {
    vacancy: Vacancy
}

function validateForm(
    postingDate: string,
    updateType: UpdateType | '', updateDate: string, updateTime: string,
    stepDate: string, stepTime: string, description: string): string | null {
    if (!updateType || !allUpdateTypes.includes(updateType as UpdateType)) return 'Please choose a valid update type'
    if (!updateDate || !updateTime) return 'Please choose a valid update date and time'
    if (interviewUpdateTypes.includes(updateType as InterviewUpdateType)) {
        if (!stepDate || !stepTime)
            return 'Please choose a valid step date and time or set a different update type'
        if (updateDate.localeCompare(stepDate) > 0 || updateDate.localeCompare(stepDate) === 0 && updateTime.localeCompare(stepTime) > 0)
            return 'Next step time can not be earlier than the update time'
        if (stepDate.localeCompare(postingDate) < 0)
            return 'Step date can not be earlier than the date of vacancy posting'
    }
    if (updateDate.localeCompare(postingDate) < 0) return 'Update date can not be earlier than the date of vacancy posting'
    if (!description.trim()) return 'Update description can not be empty'
    return null
}

function UpdateAdditionForm({vacancy}: Props) {
    const [updateType, setUpdateType] = useState<UpdateType | ''>('')
    const [updateDate, setUpdateDate] = useState('')
    const [updateTime, setUpdateTime] = useState('')
    const [stepDate, setStepDate] = useState('')
    const [stepTime, setStepTime] = useState('')
    const [description, setDescription] = useState('')

    const [error, setError] = useState('')

    const dispatch = useAppDispatch()
    const newId = useAppSelector(nextUpdateIdSelector)

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const newError = validateForm(vacancy.datePosted, updateType, updateDate, updateTime, stepDate, stepTime, description)
        if (newError) {
            setError(newError)
        } else {
            if (interviewUpdateTypes.includes(updateType as InterviewUpdateType)) {
                dispatch(addUpdate({
                    id: newId, vacancyId: vacancy.id, type: updateType as InterviewUpdateType,
                    datetime: `${updateDate}T${updateTime}`, description: description.trim(),
                    stepDatetime: `${stepDate}T${stepTime}`
                }))
            } else if (updateType !== '') {
                dispatch(addUpdate({
                    id: newId, vacancyId: vacancy.id, type: updateType as UpdateType,
                    datetime: `${updateDate}T${updateTime}`, description: description.trim()
                }))
            }
            setUpdateType('')
            setUpdateDate('')
            setUpdateTime('')
            setStepDate('')
            setStepTime('')
            setDescription('')
            setError('')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h5>Add An Update</h5>
            <label htmlFor='updateType'>
                <select id='updateType'
                        value={updateType}
                        onChange={(e) => setUpdateType(e.target.value as (UpdateType | '')) }>
                    <option value={''} disabled={true}>
                        Choose the type
                    </option>
                    {startUpdateTypes.map(type => (
                        <option key={`update-type-${type}`} value={type}>
                            Process start: {type}
                        </option>
                    ))}
                    {interviewUpdateTypes.map(type => (
                        <option key={`update-type-${type}`} value={type}>
                            Testing process: {type}
                        </option>
                    ))}
                    {checkUpdateTypes.map(type => (
                        <option key={`update-type-${type}`} value={type}>
                            Checking process: {type}
                        </option>
                    ))}
                    {endUpdateTypes.map(type => (
                        <option key={`update-type-${type}`} value={type}>
                            Process end: {type}
                        </option>
                    ))}
                </select>
            </label>
            <div>
                <label htmlFor='updateDate'>
                    <span>Update Date</span>
                    <input
                        id='updateDate' type='date' value={updateDate}
                        onChange={(e) => setUpdateDate(e.target.value)}
                    />
                </label>
                <label htmlFor='updateTime'>
                    <span>Time</span>
                    <input
                        id='updateTime' type='time' value={updateTime}
                        onChange={(e) => setUpdateTime(e.target.value)}
                    />
                </label>
            </div>
            <label htmlFor='updateDescription'>
                <span>Description</span>
                <textarea
                    id='updateDescription' value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            {interviewUpdateTypes.includes(updateType as InterviewUpdateType) && <div>
                <label htmlFor='stepDate'>
                    <span>Interview/Deadline Date</span>
                    <input
                        id='stepDate' type='date' value={stepDate}
                        onChange={(e) => setStepDate(e.target.value)}
                    />
                </label>
                <label htmlFor='stepTime'>
                    <span>Time</span>
                    <input
                        id='stepTime' type='time' value={stepTime}
                        onChange={(e) => setStepTime(e.target.value)}
                    />
                </label>
            </div>}
            <button type='submit'>Add Update</button>
            {error && (<p className='form__error' role='alert'>{error}</p>)}
        </form>
    )
}

export default UpdateAdditionForm