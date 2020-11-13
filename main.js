window.onload = () => {
  setTimeoutAndSetSkyRadius();
  setPosition();
  setTimeoutAndGetPosition();
};

function setTimeoutAndSetSkyRadius() {
  setTimeout(() => {
    const skyElements = document.getElementsByTagName("a-sky")
    if(!skyElements[0]) {
      setTimeoutAndSetSkyRadius()
    } else {
      skyElements[0].setAttribute("radius", "400000000")
    }
  }, 1000);
}

function setTimeoutAndGetPosition() {
  setTimeout(() => {
    getUserPosition();
    setTimeoutAndGetPosition();
  }, 3000);
}

function getUserPosition() {
  navigator.geolocation.getCurrentPosition(position => {
    const distanceMsg = 0;//document.getElementById("sphere").getAttribute("distanceMsg");
    const distanceText = document.getElementById("distance-text");
    distanceText.setAttribute("value",`distance: ${distanceMsg}`);
  });
}

function setPosition() {
  navigator.geolocation.getCurrentPosition(position => {
    document.getElementById("rocket").setAttribute("gps-entity-place", `latitude: ${position.coords.latitude+0.002}; longitude: ${position.coords.longitude};`);
    document.getElementById("center").setAttribute("gps-entity-place", `latitude: ${position.coords.latitude+0.000025}; longitude: ${position.coords.longitude};`);
  });
}

window.AFRAME.registerComponent('cursor-listener', {
    
  init: function () {

    this.el.addEventListener('mouseenter', function (evt) {
      this.setAttribute('scale', '1.25');
    });
    this.el.addEventListener('mouseleave', function (evt) {
      this.setAttribute('scale', '1.0');
    });
    this.el.addEventListener('click', function (evt) {
      console.log('I was clicked at: ', evt.detail.intersection.point);
      const rocketRig = document.getElementById("rocket-rig");
      rocketRig.setAttribute('visible', 'false')
      const explosionSprite = document.getElementById("explosion-sprite");
      explosionSprite.setAttribute('position', 'z', '-1')
      setTimeout(() => {
        explosionSprite.setAttribute('position', 'z', '1')
      }, 3000);
      setTimeout(() => {
      rocketRig.setAttribute('visible', 'true')
      }, 10000);
    });
  }
});

window.AFRAME.registerComponent('launch', {
  schema: {
    speedMetersPerSecond: {type: 'number', default: 1}
  },
  tick: function (t, deltaSeconds) {
    if (!deltaSeconds) return;

    const position = this.el.getAttribute('position');
    position.y += deltaSeconds * this.speedMetersPerMillisecond;
    this.el.setAttribute('position', 'y', this.data.position.y + deltaSeconds * this.data.speedMetersPerSecond)
  }
});