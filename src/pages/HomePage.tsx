import {companiesSelector, vacanciesSelector} from "@/app/selectors.ts"
import {useAppDispatch, useAppSelector} from "@/app/hooks.ts"
import {Link} from "react-router-dom"
import {removeCompanyCascade} from "@/features/companies/companiesThunk.ts"

function HomePage() {
    const dispatch = useAppDispatch()
    const vacancies = useAppSelector(vacanciesSelector)
    const companies = useAppSelector(companiesSelector)
    return (
        <section>
            <h1>Home Page</h1>
            <div>
                {companies.map(company => <div key={`company-${company.id}`}>
                    {company.name}
                    <button onClick={() => dispatch(removeCompanyCascade(company.id))}>
                        Delete
                    </button>
                </div>)}
            </div>
            <div>
                {vacancies.map(vacancy => <div key={`vacancy-link-${vacancy.id}`}>
                    <Link to={`/vacancy/${vacancy.id}`}>{vacancy.name}</Link>
                </div>)}
            </div>
        </section>
    )
}

export default HomePage
