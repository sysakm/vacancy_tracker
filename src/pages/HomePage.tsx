import {vacanciesSelector} from "@/app/selectors.ts"
import {useAppSelector} from "@/app/hooks.ts"
import {Link} from "react-router-dom"

function HomePage() {
    const vacancies = useAppSelector(vacanciesSelector)
    return (
        <section>
            <h1>Home Page</h1>
            <div>
                {vacancies.map(vacancy => <div>
                    <Link to={`/vacancy/${vacancy.id}`}>{vacancy.name}</Link>
                </div>)}
            </div>
        </section>
    )
}

export default HomePage
