window.AFRAME.registerPrimitive("a-rocket", {
  defaultComponents: {
    rocket: {
      scale: "2 2 2"
    }
  },
  mappings: {
    launch: "rocket.launch"
  }
});

window.AFRAME.registerComponent("rocket", {
  schema: {
    scale: { type: "vec3", default: "{x: 1, y: 1, z: 1}" }
  },
  init: function() {

  },
  update: function() {
    this.rocket = document.createElement("a-entity");
    this.rocket.setAttribute(
      "obj-model",
      "obj: #rocket-obj; mtl: #rocket-mtl;"
    );
    this.rocket.setAttribute("scale", this.data.scale);
    this.rocket.setAttribute("cursor-listener", "");
    this.rocket.setAttribute("laser-target", "");
    const onHit = e => {
      if (this.el.is("hit")) {
        return;
      }
      this.el.addState("hit");
      this.rocket.setAttribute("explosion", "");
      this.el.removeAttribute("launch");

      setTimeout(() => {
        this.el.removeState("hit");
        this.el.removeState("active");
        this.rocket.removeAttribute("explosion");
        this.el.setAttribute("position", "0 -500 0");
        this.el.setAttribute("visible", false);
      }, 1500);
    };
    this.rocket.addEventListener("hit", onHit);

    this.warhead = document.createElement("a-sphere");
    this.warhead.setAttribute("position", "y", 200);
    this.warhead.setAttribute("radius", 10);
    this.warhead.setAttribute("moon-collider", "targets:[rocket-target];");

    this.rocket.appendChild(this.warhead);
    this.el.appendChild(this.rocket);
  },
});

window.AFRAME.registerComponent("explosion", {
  schema: {
    camera: { type: "selector", default: "a-camera" }
  },
  init: function() {
    this.rig = document.createElement("a-entity");
    this.rig.setAttribute("position", "0 100 0");
    this.rig.setAttribute("look-at", this.data.camera);

    this.explosion = document.createElement("a-plane");
    this.explosion.setAttribute("position", "0 0 50");
    this.explosion.setAttribute("width", "200");
    this.explosion.setAttribute("height", "200");
    this.explosion.setAttribute(
      "material",
      "shader: gif; src: #explosion-gif; opacity: .9"
    );

    this.el.appendChild(this.rig);
    this.rig.appendChild(this.explosion);
  },
  destroy: function() {
    this.explosion.remove();
    this.rig.remove();
  }
});

window.AFRAME.registerComponent("launch", {
  schema: {
    speedMetersPerSecond: { type: "number", default: 100 }
  },
  init: function() {
    this.speedMetersPerMillisecond = this.data.speedMetersPerSecond / 1000;
  },
  update: function() {
    this.speedMetersPerMillisecond = this.data.speedMetersPerSecond / 1000;
  },
  tick: function(t, deltaSeconds) {
    if (!deltaSeconds) return;

    const position = this.el.getAttribute("position");
    position.y += deltaSeconds * this.speedMetersPerMillisecond;
    this.el.setAttribute("position", position);
  }
});

window.AFRAME.registerComponent("moon-collider", {
  schema: {
    targets: { type: "selectorAll" }
  },
  update: function() {},
  tick: function(t, deltaSeconds) {
    if (!deltaSeconds) return;
    if(this.data.targets.length === 0) {
      const moon = document.getElementById("moon")
      if(moon) {
        this.data.targets = [document.getElementById("moon-mesh")]
      }
    }

    const colliderPosition = new THREE.Vector3()
    this.el.object3D.getWorldPosition(colliderPosition)
    for (const targetEl of this.data.targets) {
      targetEl.targetPosition  = new THREE.Vector3()
      targetEl.object3D.getWorldPosition(targetEl.targetPosition )
      const { targetPosition } = targetEl
      const diffX = colliderPosition.x - targetPosition.x
      const diffY = colliderPosition.y - targetPosition.y
      const diffZ = colliderPosition.z - targetPosition.z
      const distanceSquared = diffX*diffX + diffY*diffY + diffZ*diffZ
      if (distanceSquared < 1500*1500) {
        targetEl.emit("hit")
      }
    }
  }
});