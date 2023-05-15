import { aboutData } from "../../data/about.js"
import './styles.scss'

export const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 mb-3 mb-lg-0">
                        <small>Copyright {year} Campo Eventos. Todos los derechos reservados</small>
                    </div>
                    <div className="col-lg-2">
                        <div className="social">
                            {aboutData.social.map((el, i) =>
                                <a
                                    key={i}
                                    href={el.link}
                                    title={el.info}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="item"
                                >
                                    <i className={el.iconClassname}></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}