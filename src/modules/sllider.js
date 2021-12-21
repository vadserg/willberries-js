// подключаем модуль Swiper
import Swiper, { Navigation, Autoplay, EffectFade } from 'swiper'

const slider = () => {

  const swiper = new Swiper('.swiper-container', {
    modules: [Navigation, Autoplay, EffectFade],
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    navigation: {
      nextEl: '.slider-button-next',
      prevEl: '.slider-button-prev',
    },
  })

}

export default slider