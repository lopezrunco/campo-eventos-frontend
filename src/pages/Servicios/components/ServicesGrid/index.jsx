import { servicesData, videosData } from '../../../../data/services'
import './styles.scss'

export const ServicesGrid = () => {
  return (
    <>
      <section className='services-grid'>
        <article className='container'>
          <div className='row'>
            {servicesData.map(servicesEl =>
              <div className='col-md-4' key={servicesEl.id}>
                <div className='item'>
                  <img src={`../src/assets/${servicesEl.icon}`} alt={servicesEl.title} />
                  <h3>{servicesEl.title}</h3>
                </div>
              </div>
            )}
          </div>
        </article>
      </section>
      <section className='video-service'>
        <article className='container'>
          <div className='row'>
            <div className='col title'>
              <img src={`../src/assets/${videosData.icon}`} alt={videosData.title} />
              <h3>{videosData.title}</h3>
              <div className='separator'></div>
            </div>
          </div>
          <div className='row'>
            {videosData.videos.map((videoEl, videoIdx) =>
              <div className='col-sm-6 col-lg-4' key={videoIdx}>
                <div className='item'>
                  <h5>{videoEl.title}</h5>
                  <div className='iframe-wrapper'>
                    <small className='loading-msj'>Cargando...</small>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoEl.src}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen>
                    </iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  )
}