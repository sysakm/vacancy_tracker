import {useAppSelector} from "@/app/hooks.ts"
import {companiesSelector, updatesSelector, vacanciesSelector} from "@/app/selectors.ts"
import {Link} from "react-router-dom"
import {aggregateVacancyDateUtil} from "@/utils/vacancyUtils.ts"

function VacanciesDashboard() {
    const vacancies = useAppSelector(vacanciesSelector)
    const companies = useAppSelector(companiesSelector)
    const updates = useAppSelector(updatesSelector)
    const vacancyEntries = aggregateVacancyDateUtil(vacancies, companies, updates)
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Vacancy</th>
                        <th>Next Step</th>
                        <th>Last Update</th>
                    </tr>
                </thead>
                <tbody>
                    {vacancyEntries.map(entry => <tr key={`vacancy-dashboard-row-${entry.vacancy.id}`}>
                        <td>{entry.status}</td>
                        <td><Link to={`/vacancy/${entry.vacancy.id}`}>{entry.vacancy.name} @ {entry.companyName}</Link></td>
                        <td>{entry.nextStep}</td>
                        <td>{entry.lastUpdate}</td>
                    </tr>)}
                    {vacancyEntries.length === 0 && <tr><td colSpan={4}>No vacancies</td></tr>}
                </tbody>
            </table>
        </div>
    )
}

export default VacanciesDashboard