import {Outlet} from "react-router-dom"

function AppLayout() {
    return (
        <div>
            <header>
                <nav>

                </nav>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default AppLayout