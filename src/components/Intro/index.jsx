import imgUrl from '../../assets/hero-logo.png'

import './styles.scss'

export const Intro = () => {
  return (
    <div className="intro">
        <img src={imgUrl} alt='Campo Eventos' />
    </div>
  )
}