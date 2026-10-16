import type {Company, Vacancy} from "@/types/vacancyTypes.ts"

type Props = {
    vacancy: Vacancy,
    company?: Company
}

function VacancyCard({vacancy, company}: Props) {
    return (
        <article className='vacancy-card'>
            <aside className='vacancy-card__eyebrow'>Vacancy {vacancy.id}</aside>
            <h3 className='vacancy-card__title'>{vacancy.name} in {company?.name ?? 'Unknown Company'}</h3>
            <p className='vacancy-card__salary'>
                {vacancy.salary.type === 'unknown' && <span>Salary unknown</span>}
                {vacancy.salary.type === 'fixed' && <span>${vacancy.salary.value}</span>}
                {vacancy.salary.type === 'fork' && <span>${vacancy.salary.start}-{vacancy.salary.end}</span>}
            </p>
            <aside className='vacancy-card__date'>Originally posted on {vacancy.datePosted}</aside>
            <h5>Job Description</h5>
            <p className='vacancy-card__description'>{vacancy.description}</p>
        </article>
    )
}

export default VacancyCard
