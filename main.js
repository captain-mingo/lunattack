window.onload = () => {
  setTimeoutAndSetSkyRadius();
};

function setTimeoutAndSetSkyRadius() {
  setTimeout(() => {
    const skyElements = document.getElementsByTagName("a-sky")
    if(!skyElements[0]) {
      setTimeoutAndSetSkyRadius()
    } else {
      skyElements[0].setAttribute("radius", "50000")
    }
  }, 1000);
}

window.AFRAME.registerComponent('cursor-listener', {
    
  init: function () {

    this.el.addEventListener('mouseenter', function (evt) {
      document.getElementById('cursor').setAttribute('color', 'red')
      document.getElementById('cursor').setAttribute('scale', '3 3 3')
    });
    this.el.addEventListener('mouseleave', function (evt) {
      document.getElementById('cursor').removeAttribute('color')
      document.getElementById('cursor').removeAttribute('scale')
    });
    this.el.addEventListener('click', function (evt) {
      const laser = document.createElement('a-laser')
      const scene = document.querySelector('a-scene')
      scene.appendChild(laser)
    });
  }
});

window.AFRAME.registerComponent('random-rockets', {
  schema: {
    radius: {type: 'int', default: '400'},
  },
  init: function () {

    const generateRandomRocket = () => {
      console.log('generating new rocket!')
      randomCircumferenceRange = Math.random() * 2 * Math.PI

      const rocket = document.createElement('a-rocket')
      rocket.setAttribute('position',
        {
          x: Math.cos(randomCircumferenceRange) * this.data.radius,
          y: 0,
          z: Math.sin(randomCircumferenceRange) * this.data.radius,
        }
      )
      const scene = document.querySelector('a-scene')
      scene.appendChild(rocket)
    }

    const doNextRocketLaunch = () => {
      generateRandomRocket()

      const randomInt = Math.floor(Math.random() * 5)
      setTimeout(doNextRocketLaunch, (randomInt + 10) * 1000)
    }

    setTimeout(doNextRocketLaunch, 10000)
  }
});
