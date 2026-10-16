import {NavLink, Outlet} from "react-router-dom"

function AppLayout() {
    return (
        <div>
            <header>
                <nav>
                    <NavLink to='/'>Dashboard</NavLink>
                    <NavLink to='/create'>Add Vacancy</NavLink>
                    <NavLink to='/companies'>Companies</NavLink>
                    <NavLink to='/stats'>Statistics</NavLink>
                </nav>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default AppLayout