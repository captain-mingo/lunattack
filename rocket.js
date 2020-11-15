AFRAME.registerPrimitive('a-rocket', {
  defaultComponents: {
    rocket: {
      scale: '2 2 2',
    },
  },
  mappings: {
  },
})

window.AFRAME.registerComponent('rocket', {
  schema: {
    scale: {type: 'vec3', default: '1 1 1'},
  },
  init: function() {
    this.rocket = document.createElement('a-entity')
    this.rocket.setAttribute('obj-model', 'obj: #rocket-obj; mtl: #rocket-mtl;')
    this.rocket.setAttribute('scale', this.data.scale)
    this.rocket.setAttribute('cursor-listener', '')
    this.rocket.setAttribute('launch', '')
    this.rocket.setAttribute('laser-target', '')
    const onHit = (e) => {
      this.rocket.removeEventListener('hit', onHit)
      this.rocket.setAttribute('explosion', '')
      this.rocket.removeAttribute('launch')

      setTimeout(() => {
        this.el.remove()
        this.el.destroy()
      }, 5000)
    }
    this.rocket.addEventListener('hit', onHit)

    this.el.appendChild(this.rocket)
  },
  destroy: function() {
    this.rocket.remove()
    this.rocket.destroy()
  },
})

window.AFRAME.registerComponent('explosion', {
  schema: {
    camera: {type: 'selector', default: 'a-camera'},
  },
  init: function() {
    this.rig = document.createElement('a-entity')
    this.rig.setAttribute('position', '0 100 0')
    this.rig.setAttribute('look-at', this.data.camera)

    this.explosion = document.createElement('a-plane')
    this.explosion.setAttribute('position', '0 0 50')
    this.explosion.setAttribute('width', '200')
    this.explosion.setAttribute('height', '200')
    this.explosion.setAttribute('material', 'shader: gif; src: #explosion-gif; opacity: .9')

    this.el.appendChild(this.rig)
    this.rig.appendChild(this.explosion)
  },
  destroy: function() {
    this.explosion.remove()
    this.rig.remove()
  }
})

window.AFRAME.registerComponent('launch', {
  schema: {
    speedMetersPerSecond: {type: 'number', default: 10},
  },
  init: function() {
    this.speedMetersPerMillisecond = this.data.speedMetersPerSecond / 1000
  },
  update: function() {
    this.speedMetersPerMillisecond = this.data.speedMetersPerSecond / 1000
  },
  tick: function (t, deltaSeconds) {
    if (!deltaSeconds) return;

    const position = this.el.getAttribute('position');
    position.y += deltaSeconds * this.speedMetersPerMillisecond
    this.el.setAttribute('position', position)
  },
})
