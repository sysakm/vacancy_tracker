import type {Vacancy} from "@/types/vacancyTypes.ts"
import type {VacancyUpdate} from "@/types/processUpdateTypes.ts"
import {calculateVacancyFunnel} from "@/utils/vacancyUtils.ts"
import '@/components/StatisticsFunnel.css'
import type {CSSProperties} from "react";

type Props = {
    vacancies: Array<Vacancy>;
    updates: Array<VacancyUpdate>;
}

function StatisticsFunnel({vacancies, updates}: Props) {
    const funnel = calculateVacancyFunnel(vacancies, updates)
    if (funnel['Total'] === 0) {
        return <p>No vacancies tracked yet. Add vacancies to see the funnel.</p>
    }

    const appliedPct = funnel['Applied'] / funnel['Total']
    const interviewPct = funnel['Interview'] / funnel['Total']
    const checkPct = funnel['Checks'] / funnel['Total']
    const offerPct = funnel['Offer'] / funnel['Total']

    return (
        <div className="funnel-container">
            <div className="funnel-stage" style={{'--t-width': 1.0, '--b-width': appliedPct, '--color': '#4f46e5'} as CSSProperties}>
                <span className="stage-label">Total: {funnel['Total']} (100%)</span>
            </div>
            <div className="funnel-stage" style={{'--t-width': appliedPct, '--b-width': interviewPct, '--color': '#6366f1'} as CSSProperties}>
                <span className="stage-label">Application: {funnel['Applied']} ({(100 * appliedPct).toFixed(0)}%)</span>
            </div>
            <div className="funnel-stage" style={{'--t-width': interviewPct, '--b-width': checkPct, '--color': '#818cf8'} as CSSProperties}>
                <span className="stage-label">Interview: {funnel['Interview']} ({(100 * interviewPct).toFixed(0)}%)</span>
            </div>
            <div className="funnel-stage" style={{'--t-width': checkPct, '--b-width': offerPct, '--color': '#a5b4fc'} as CSSProperties}>
                <span className="stage-label">Checks: {funnel['Checks']} ({(100 * checkPct).toFixed(0)}%)</span>
            </div>
            <div className="funnel-stage" style={{'--t-width': offerPct, '--b-width': offerPct, '--color': '#10b981'} as CSSProperties}>
                <span className="stage-label">Offer: {funnel['Offer']} ({(100 * offerPct).toFixed(0)}%)</span>
            </div>
        </div>
    )
}

export default StatisticsFunnel