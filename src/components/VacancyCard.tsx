import type {Company, Vacancy} from "@/types/types.ts"

type Props = {
    vacancy: Vacancy,
    company?: Company
}

function VacancyCard({vacancy, company}: Props) {
    return (
        <article>
            <aside>Vacancy {vacancy.id}</aside>
            <h3 className='trip-card__title'>{vacancy.name} in {company?.name ?? 'Unknown Company'}</h3>
            <p>
                {vacancy.salary.type === 'unknown' && <span>Salary unknown</span>}
                {vacancy.salary.type === 'fixed' && <span>${vacancy.salary.value}</span>}
                {vacancy.salary.type === 'fork' && <span>${vacancy.salary.start}-{vacancy.salary.end}</span>}
            </p>
            <aside>Originally posted on {vacancy.datePosted}</aside>
            <h5>Job Description</h5>
            <p>{vacancy.description}</p>
        </article>
    )
}

export default VacancyCard