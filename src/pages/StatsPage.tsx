import {companiesSelector, updatesSelector, vacanciesSelector} from "@/app/selectors.ts"
import {useAppSelector} from "@/app/hooks.ts"
import StatisticsCounts from "@/components/StatisticsCounts.tsx"
import StatisticsFunnel from "@/components/StatisticsFunnel.tsx";

function StatsPage() {
    const companies = useAppSelector(companiesSelector)
    const vacancies = useAppSelector(vacanciesSelector)
    const updates = useAppSelector(updatesSelector)
    return (
        <section className='page page--stats'>
            <h1>Statistics</h1>
            <StatisticsCounts vacancies={vacancies} companies={companies} updates={updates}/>
            <StatisticsFunnel vacancies={vacancies} updates={updates}/>
        </section>
    )
}

export default StatsPage
