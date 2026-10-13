import {NavLink, Outlet} from "react-router-dom"

function AppLayout() {
    return (
        <div>
            <header>
                <nav>
                    <NavLink to='/'>Home</NavLink>
                    <NavLink to='/create'>Add Vacancy</NavLink>
                    <NavLink to='/companies'>Companies</NavLink>
                </nav>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default AppLayout