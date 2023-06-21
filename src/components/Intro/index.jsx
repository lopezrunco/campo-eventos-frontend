import heroLogoImgUrl from '../../assets/hero-logo.png'

import './styles.scss'

export const Intro = () => {
  return (
    <div className="intro">
        <img src={heroLogoImgUrl} alt='Campo Eventos' />
    </div>
  )
}