import {useAppSelector} from "@/app/hooks.ts"
import {companiesSelector, vacanciesSelector} from "@/app/selectors.ts"
import CompanyCard from "@/components/CompanyCard.tsx"

function CompaniesPage() {
    const vacancies = useAppSelector(vacanciesSelector)
    const companies = useAppSelector(companiesSelector)
    return (
        <section>
            <h1>Companies</h1>
            <div>
                {companies.map(company => <CompanyCard
                    key={`company-${company.id}`}
                    company={company}
                    vacancies={
                        vacancies
                            .filter(vacancy => vacancy.companyId === company.id)
                            .sort((a, b) => a.datePosted.localeCompare(b.datePosted))
                    }
                />)}
                {companies.length === 0 && <p>Companies you add will be displayed here.</p>}
            </div>
        </section>
    )
}

export default CompaniesPage