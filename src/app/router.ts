import {createBrowserRouter} from "react-router-dom"
import AppLayout from "@/AppLayout.tsx"
import HomePage from "@/pages/HomePage.tsx"
import RouterError from "@/pages/RouterError.tsx"
import RouterLoader from "@/pages/RouterLoader.tsx"
import VacancyCreationPage from "@/pages/VacancyCreationPage.tsx"
import VacancyPage from "@/pages/VacancyPage.tsx"
import CompaniesPage from "@/pages/CompaniesPage.tsx"
import StatsPage from "@/pages/StatsPage.tsx"

export const router = createBrowserRouter([
    {
        Component: AppLayout,
        ErrorBoundary: RouterError,
        children: [
            {
                index: true,
                Component: HomePage,
                HydrateFallback: RouterLoader
            },
            {
                path: 'create',
                Component: VacancyCreationPage,
                HydrateFallback: RouterLoader
            },
            {
                path: 'vacancy/:id',
                Component: VacancyPage,
                HydrateFallback: RouterLoader
            },
            {
                path: 'companies',
                Component: CompaniesPage,
                HydrateFallback: RouterLoader
            },
            {
                path: 'stats',
                Component: StatsPage,
                HydrateFallback: RouterLoader
            }
        ]
    }
])