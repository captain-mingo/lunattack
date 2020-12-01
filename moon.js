const SLOWBURN_LENGTH = 1350

window.AFRAME.registerPrimitive("a-moon", {
  defaultComponents: {
    moon: {}
  },
  mappings: {}
});

window.AFRAME.registerComponent("moon", {
  schema: {},
  init: function() {
    this.moon = document.createElement("a-entity")
    this.moon.setAttribute(
      "gltf-model",
      "#moon-glb"
    );
    this.moon.setAttribute("id", "moon-mesh")
    this.moon.setAttribute("rocket-target", "")
    this.moon.setAttribute("decimation", "")

    const onHit = e => {
      if (this.el.is("hit")) {
        return;
      }
      this.el.addState("hit");
      this.moon.addState("start-exploding");
    };
    this.moon.addEventListener("hit", onHit);

    this.el.appendChild(this.moon);
  },
});

window.AFRAME.registerComponent("decimation", {
  schema: {
    camera: { type: "selector", default: "a-camera" }
  },
  init: function() {},
  tick: function(t, dt) {
    if(this.el.is('start-exploding')) {
      this.explosionStart = t
      this.el.removeState('start-exploding')
      this.el.addState('exploding-1')
      return
    }
    const runningTime = t - this.explosionStart
    const lastIteration = 9
    const rotationSlice = 360/lastIteration
    for(let i = 1;i <= lastIteration;i++) {
      if(this.el.is(`exploding-${lastIteration}`)) {
        deactivateSlowBurn(document.getElementById("slowburn"))
        activateDecimation(document.getElementById("decimation"))
        this.el.removeState(`exploding-${lastIteration}`)
      }
      if(this.el.is(`exploding-${i}`)) {
        if(runningTime > SLOWBURN_LENGTH*i) {
          activateSlowBurn(document.getElementById("slowburn"), rotationSlice * -i)
          this.el.removeState(`exploding-${i}`)
          this.el.addState(`exploding-${i+1}`)
        }
      }
    }
  },
});

function activateSlowBurn(el, radialPosition) {
  el.setAttribute("position", "y", "-600");
  el.setAttribute("rotation", `0 ${radialPosition} 0`);
}

function deactivateSlowBurn(el) {
  el.setAttribute("position", "y", "-10000");
}

function activateDecimation(el) {
  el.setAttribute("position", "0 -600 0");
}
