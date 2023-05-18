
export const Forbidden = () => {
    return (
        <article className='container'>
            <div className='row not-found'>
                <div className='col-xl-5'>
                    <h1>403!</h1>
                </div>
                <div className='col-xl-7'>
                    <h2>Acceso no permitido</h2>
                    <p>Usted no tiene permiso para acceder a esta página. <br />Por favor, regrese a la página principal e intente de nuevo.</p>
                    <a className='button button-dark' href='/'>Inicio</a>
                </div>
            </div>
        </article>
    )
}