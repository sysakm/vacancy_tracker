import {NavLink, Outlet} from "react-router-dom"

function AppLayout() {
    return (
        <div className='app-shell'>
            <header className='app-header'>
                <nav className='app-header__nav' aria-label='Main navigation'>
                    <NavLink className={({isActive}) => `app-header__link${isActive ? ' app-header__link--active' : ''}`} to='/'>Dashboard</NavLink>
                    <NavLink className={({isActive}) => `app-header__link${isActive ? ' app-header__link--active' : ''}`} to='/create'>Add Vacancy</NavLink>
                    <NavLink className={({isActive}) => `app-header__link${isActive ? ' app-header__link--active' : ''}`} to='/companies'>Companies</NavLink>
                    <NavLink className={({isActive}) => `app-header__link${isActive ? ' app-header__link--active' : ''}`} to='/stats'>Statistics</NavLink>
                </nav>
            </header>
            <main className='app-main'>
                <Outlet/>
            </main>
        </div>
    )
}

export default AppLayout
