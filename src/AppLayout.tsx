import {NavLink, Outlet} from "react-router-dom"

function AppLayout() {
    return (
        <div>
            <header>
                <nav>
                    <NavLink to='/'>Home</NavLink>
                    <NavLink to='/create'>Add Vacancy</NavLink>
                </nav>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default AppLayout