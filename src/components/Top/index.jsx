import { aboutData } from "../../data/about"
import './styles.scss'

export const Top = () => {
    return (
        <div className="top" id="top">
            <div className="container">
                <div className="row">
                    <div className="content-wrapper">
                        <div className="social">
                            {aboutData.social.map((socialEl, socialIdx) =>
                                <div className="item" key={socialIdx}>
                                    <a href={socialEl.link} title={socialEl.info} target="_blank" rel="noreferrer">
                                        <i className={socialEl.iconClassname}></i>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}