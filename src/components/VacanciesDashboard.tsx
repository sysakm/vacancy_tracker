import {useAppSelector} from "@/app/hooks.ts"
import {
    companiesSelector,
    contactsSelector,
    notesSelector,
    updatesSelector,
    vacanciesSelector
} from "@/app/selectors.ts"
import {Link} from "react-router-dom"
import {aggregateVacancyDataUtil, statusToNumberValue, type VacancyDashboardEntry, type VacancyStatus} from "@/utils/vacancyUtils.ts"
import {useMemo, useState} from "react"

const filterTypes = ['all', 'not applied', 'ongoing process', 'next steps', 'offer', 'unresolved'] as const
type FilterType = (typeof filterTypes)[number]

const filterTypeToLabel: Record<FilterType, string> = {
    'all': 'All',
    'not applied': 'Not Applied',
    'ongoing process': 'Ongoing Process',
    'next steps': 'Has Next Step',
    'offer': 'Offer',
    'unresolved': 'Unresolved'
}
const filterTypeToFilter: Record<FilterType, (entry: VacancyDashboardEntry) => boolean> = {
    'all': () => true,
    'not applied': (entry) => entry.status === 'Not Applied',
    'ongoing process': (entry) => statusToNumberValue(entry.status) >= 0 && statusToNumberValue(entry.status) < 500,
    'next steps': (entry) => entry.nextStep !== '-',
    'offer': (entry) => entry.status === 'Offer',
    'unresolved': (entry) => statusToNumberValue(entry.status) < 500
}

const sortingTypes = ['none', 'position', 'date posted', 'salary', 'company', 'next step', 'last update', 'status'] as const
const sortingDirections = ['asc', 'desc'] as const
type SortingType = (typeof sortingTypes)[number]
type SortingDirection = (typeof sortingDirections)[number]

const sortingTypeToLabel: Record<SortingType, string> = {
    'none': 'Default',
    'position': 'Position Name',
    'date posted': 'Posting Date',
    'salary': 'Salary',
    'company': 'Company',
    'next step': 'Next Step Date',
    'last update': 'Last Update Date',
    'status': 'Status'
}
const sortingDirectionToLabel: Record<SortingDirection, string> = {
    'asc': 'Ascending', 'desc': 'Descending'
}

const sortingTypeToComparator: Record<SortingType, (a: VacancyDashboardEntry, b: VacancyDashboardEntry) => number> = {
    'none': (_a, _b) => 0,
    'position': (a, b) => a.vacancy.name.localeCompare(b.vacancy.name),
    'date posted': (a, b) => a.vacancy.datePosted.localeCompare(b.vacancy.datePosted),
    'salary': (a, b) => {
        const valueA = a.vacancy.salary.type === 'fixed' ?
            a.vacancy.salary.value : (a.vacancy.salary.type === 'fork' ?
                Math.trunc((a.vacancy.salary.start + a.vacancy.salary.end) / 2) : 0)
        const valueB = b.vacancy.salary.type === 'fixed' ?
            b.vacancy.salary.value : (b.vacancy.salary.type === 'fork' ?
                Math.trunc((b.vacancy.salary.start + b.vacancy.salary.end) / 2) : 0)
        return valueA - valueB
    },
    'company': (a, b) => a.companyName.localeCompare(b.companyName),
    'next step': (a, b) => a.nextStep.localeCompare(b.nextStep),
    'last update': (a, b) => a.lastUpdate.localeCompare(b.lastUpdate),
    'status': (a, b) => statusToNumberValue(a.status) - statusToNumberValue(b.status)
}
const sortingDirectionToComparator: Record<SortingDirection, number> = {
    'asc': 1,
    'desc': -1
}
const statusToColorClass: Record<VacancyStatus, string> = {
    'Not Applied': 'status-pill--idle',
    Applied: 'status-pill--applied',
    Interviewing: 'status-pill--interview',
    'Take Home Task': 'status-pill--interview',
    'Trial Period': 'status-pill--interview',
    Checking: 'status-pill--checks',
    Offer: 'status-pill--offer',
    Reject: 'status-pill--rejected',
    'Drop Out': 'status-pill--withdrawn'
}
const sortingTypeToBottomPredicate = new Map<SortingType, (entry: VacancyDashboardEntry) => boolean>()
sortingTypeToBottomPredicate.set('salary', // unknown salary at the bottom
    (entry) => entry.vacancy.salary.type === 'unknown'
)
sortingTypeToBottomPredicate.set('next step', // no next step at the bottom
    (entry) => entry.nextStep === '-'
)
sortingTypeToBottomPredicate.set('last update', // no updates at the bottom
    (entry) => entry.lastUpdate === '-'
)
sortingTypeToBottomPredicate.set('status', // rejects/dropouts at the bottom
    (entry) => entry.status === 'Reject' || entry.status === 'Drop Out'
)

function VacanciesDashboard() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<FilterType>('all')
    const [sortingType, setSortingType] = useState<SortingType>('none')
    const [sortingDirection, setSortingDirection] = useState<SortingDirection>('asc')

    const vacancies = useAppSelector(vacanciesSelector)
    const companies = useAppSelector(companiesSelector)
    const updates = useAppSelector(updatesSelector)
    const contacts = useAppSelector(contactsSelector)
    const notes = useAppSelector(notesSelector)

    const query = searchQuery.trim().toLowerCase()
    const vacancyEntries = useMemo(
        () => aggregateVacancyDataUtil(vacancies, companies, updates),
        [vacancies, companies, updates]
    )
    const vacancyEntriesFiltered = useMemo(() => {
        return vacancyEntries.filter(entry => {
            if (!query) return true

            if (entry.vacancy.name.toLowerCase().includes(query) ||
                entry.vacancy.description.toLowerCase().includes(query) ||
                entry.companyName.toLowerCase().includes(query)) return true

            const vacId = entry.vacancy.id
            if (updates.some(update =>
                update.vacancyId === vacId && update.description.toLowerCase().includes(query))) return true
            if (contacts.some(contact =>
                contact.vacancyId === vacId &&
                (contact.name.toLowerCase().includes(query) || contact.description.toLowerCase().includes(query)))) return true
            if (notes.some(note =>
                note.vacancyId === vacId && note.note.toLowerCase().includes(query))) return true

            return false
        }).filter(entry =>
            filterTypeToFilter[filterType](entry)
        ).toSorted((a, b) => {
            const aBottom = sortingTypeToBottomPredicate.get(sortingType)?.(a) ?? false
            const bBottom = sortingTypeToBottomPredicate.get(sortingType)?.(b) ?? false
            if (aBottom && !bBottom) return 1
            if (!aBottom && bBottom) return -1

            return sortingTypeToComparator[sortingType](a, b) * sortingDirectionToComparator[sortingDirection]
        })
    }, [vacancyEntries, query, filterType, sortingType, sortingDirection, updates, contacts, notes])

    return (
        <>
            <div className='dashboard-controls'>
                <label htmlFor='vacancy-search'>
                    <span>Search vacancies</span>
                    <input
                        id='vacancy-search'
                        type='search'
                        placeholder='Vacancy, company, description, note...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </label>
                <label htmlFor='vacancy-filter'>
                    <span>Filter vacancies</span>
                    <select id='vacancy-filter'
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as FilterType)}>
                        {filterTypes.map(filter => (
                            <option key={`filter-type-${filter}`} value={filter}>
                                {filterTypeToLabel[filter]}
                            </option>
                        ))}
                    </select>
                </label>
                <label htmlFor='vacancy-sort'>
                    <span>Sort by</span>
                    <select id='vacancy-sort'
                            value={sortingType}
                            onChange={(e) => setSortingType(e.target.value as SortingType)}>
                        {sortingTypes.map(sorting => (
                            <option key={`sorting-type-${sorting}`} value={sorting}>
                                {sortingTypeToLabel[sorting]}
                            </option>
                        ))}
                    </select>
                </label>
                {sortingType !== 'none' && (<label htmlFor='vacancy-sort-direction'>
                    <span>Sort direction</span>
                    <select id='vacancy-sort-direction'
                            value={sortingDirection}
                            onChange={(e) => setSortingDirection(e.target.value as SortingDirection)}>
                        {sortingDirections.map(direction => (
                            <option key={`sorting-direction-${direction}`} value={direction}>
                                {sortingDirectionToLabel[direction]}
                            </option>
                        ))}
                    </select>
                </label>)}
            </div>
            <div className='dashboard-table-wrap'>
                <table className='dashboard-table'>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Vacancy</th>
                            <th>Salary</th>
                            <th>Next Step</th>
                            <th>Last Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vacancyEntriesFiltered.map(entry => <tr key={`vacancy-dashboard-row-${entry.vacancy.id}`}>
                            <td><span className={`status-pill ${statusToColorClass[entry.status]}`}>{entry.status}</span></td>
                            <td><Link to={`/vacancy/${entry.vacancy.id}`}>{entry.vacancy.name} @ {entry.companyName}</Link></td>
                            <td>{entry.salary}</td>
                            <td>{entry.nextStep}</td>
                            <td>{entry.lastUpdate}</td>
                        </tr>)}
                        {vacancyEntriesFiltered.length === 0 && <tr><td colSpan={5}>No vacancies match the filters</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default VacanciesDashboard
