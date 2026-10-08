import '@/pages/RouterLoader.css'

function RouterLoader() {
    return (
        <section className='page router-loader' role='status' aria-live='polite'>
            <h1>Loading...</h1>
            <div className='router-loader__box'>
                <span className='router-loader__spinner' aria-hidden='true'></span>
            </div>
        </section>
    )
}

export default RouterLoader
