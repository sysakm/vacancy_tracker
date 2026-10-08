import {isRouteErrorResponse, Link, useRouteError} from "react-router-dom"

function RouterError() {
    const error: unknown = useRouteError()
    if (isRouteErrorResponse(error)) {
        return (
            <div className='page page--error'>
                <h1>
                    {error.status} - {error.statusText}
                </h1>
                <p>{error.data}</p>
                <Link to='/'>{'<- '} Go back home</Link>
            </div>
        )
    } else if (error instanceof Error) {
        return (
            <div className='page page--error'>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
                <Link to='/'>{'<- '} Go back home</Link>
            </div>
        )
    } else {
        return (
            <div className='page page--error'>
                <h1>Unknown Error</h1>
                <Link to='/'>{'<- '} Go back home</Link>
            </div>
        )
    }
}

export default RouterError
