import heroLogoImgUrl from '../../assets/hero-logo.png'
import campoBGImgUrl from '../../assets/campo-bg.jpg'

import './styles.scss'

export const Intro = () => {
  return (
    <div className="intro" style={{backgroundImage : campoBGImgUrl}}>
        <img src={heroLogoImgUrl} alt='Campo Eventos' />
    </div>
  )
}