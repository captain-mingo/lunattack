window.AFRAME.registerPrimitive("a-laser", {
  defaultComponents: {
    laser: {},
  },
  mappings: {}
});

window.AFRAME.registerComponent("laser", {
  schema: {
    length: { type: "number", default: 10 },
    thickness: { type: "number", default: 5 }
  },
  init: function() {
    const camera = document.getElementById("camera");

    this.rig = document.createElement("a-entity");
    this.rig.setAttribute("position", camera.getAttribute("position"));
    this.rig.setAttribute("rotation", camera.getAttribute("rotation"));

    this.laser = document.createElement("a-cylinder");
    this.laser.setAttribute("rotation", "-90 0 0");
    this.laser.setAttribute(
      "material",
      "shader: standard; color: red; opacity: 1.0"
    );
    this.laser.setAttribute("height", this.data.length);
    this.laser.setAttribute("radius", this.data.thickness * 0.5);
    this.laser.setAttribute("projectile", "");

    this.glow = document.createElement("a-cylinder");
    this.glow.setAttribute(
      "material",
      "shader: standard; color: red; opacity: 0.25"
    );
    this.glow.setAttribute("height", this.data.length);
    this.glow.setAttribute("radius", this.data.thickness * 0.7);

    this.tip = document.createElement("a-sphere");
    this.tip.setAttribute("position", "y", this.data.length * 0.5);
    this.tip.setAttribute("radius", this.data.thickness * 0.7);
    this.tip.setAttribute(
      "material",
      "shader: standard; color: red; opacity: 0.25"
    );
    this.tip.setAttribute("collider", "targets:[laser-target];");

    this.el.appendChild(this.rig);
    this.rig.appendChild(this.laser);
    this.laser.appendChild(this.tip);
    this.laser.appendChild(this.glow);
  }
});

window.AFRAME.registerComponent("projectile", {
  schema: {
    speedMetersPerSecond: { type: "number", default: 200 },
    maxDistanceMeters: { type: "number", default: 5000 },
    targets: { type: "selectorAll" }
  },
  init: function() {
    this.speedMetersPerMillisecond = this.data.speedMetersPerSecond / 1000;
    console.log("init");
  },
  update: function() {
    console.log("update");
  },
  tick: function(t, deltaSeconds) {
    if (!deltaSeconds) return;

    const position = this.el.getAttribute("position");
    position.z -= deltaSeconds * this.speedMetersPerMillisecond;
    const distance = Math.abs(position.z);
    if (distance > this.data.maxDistanceMeters) {
      this.el.remove();
    }
    this.el.setAttribute("position", position);
  }
});

window.AFRAME.registerComponent("collider", {
  schema: {
    targets: { type: "selectorAll" }
  },
  update: function() {
    for (const target of this.data.targets) {
      target.boundingBox = new THREE.Box3().setFromObject(target.object3D);
    }
  },
  tick: function(t, deltaSeconds) {
    if (!deltaSeconds) return;

    const colliderPosition = new THREE.Vector3();
    this.el.object3D.getWorldPosition(colliderPosition);
    for (const targetEl of this.data.targets) {
      if (targetEl.boundingBox.containsPoint(colliderPosition)) {
        targetEl.emit("hit");
      }
    }
  }
});
