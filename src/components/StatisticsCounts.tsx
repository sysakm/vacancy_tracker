import type {Company, Vacancy} from "@/types/vacancyTypes.ts"
import type {VacancyUpdate} from "@/types/processUpdateTypes.ts"
import {calculateStatuses} from "@/utils/vacancyUtils.ts";

type Props = {
    vacancies: Array<Vacancy>;
    companies: Array<Company>;
    updates: Array<VacancyUpdate>;
}

function StatisticsCounts({vacancies, companies, updates}: Props) {
    const statuses = calculateStatuses(vacancies, updates)

    return (
        <>
            <div>
                <dl>
                    <h5>Stored data:</h5>
                    <div>
                        <dt>Companies</dt>
                        <dd>{companies.length}</dd>
                    </div>
                    <div>
                        <dt>Vacancies</dt>
                        <dd>{vacancies.length}</dd>
                    </div>
                    <div>
                        <dt>Total Updates</dt>
                        <dd>{updates.length}</dd>
                    </div>
                </dl>
            </div>
            <div>
                <dl>
                    <h5>Vacancies:</h5>
                    <div>
                        <dt>Idle (Not Applied)</dt>
                        <dd>
                            {statuses.filter(s => s === 'Not Applied').length}
                        </dd>
                    </div>
                    <div>
                        <dt>In Progress</dt>
                        <dd>
                            {statuses.filter(s => (
                                s !== 'Not Applied' && s !== 'Offer' && s !== 'Reject' && s !== 'Drop Out')).length}
                        </dd>
                    </div>
                    <div>
                        <dt>Offers</dt>
                        <dd>
                            {statuses.filter(s => s === 'Offer').length}
                        </dd>
                    </div>
                    <div>
                        <dt>Rejects</dt>
                        <dd>
                            {statuses.filter(s => s === 'Reject').length}
                        </dd>
                    </div>
                    <div>
                        <dt>Drop Outs</dt>
                        <dd>
                            {statuses.filter(s => s === 'Drop Out').length}
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    )
}

export default StatisticsCounts