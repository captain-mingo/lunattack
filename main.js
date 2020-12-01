window.onload = () => {
  setTimeoutAndSetSkyRadius();
};

function setTimeoutAndSetSkyRadius() {
  setTimeout(() => {
    const skyElements = document.getElementsByTagName("a-sky");
    if (!skyElements[0]) {
      setTimeoutAndSetSkyRadius();
    } else {
      skyElements[0].setAttribute("radius", "400000000");
    }
  }, 1000);
}

window.AFRAME.registerComponent("cursor-listener", {
  init: function() {
    this.el.addEventListener("mouseenter", function(evt) {
      document.getElementById("cursor").setAttribute("color", "red");
      document.getElementById("cursor").setAttribute("scale", "3 3 3");
    });
    this.el.addEventListener("mouseleave", function(evt) {
      document.getElementById("cursor").removeAttribute("color");
      document.getElementById("cursor").removeAttribute("scale");
    });
    this.el.addEventListener("click", function(evt) {
      const laser = document.createElement("a-laser");
      const scene = document.querySelector("a-scene");
      scene.appendChild(laser);
    });
  }
});

window.AFRAME.registerComponent("random-rockets", {
  schema: {
    radius: { type: "int", default: 400 }
  },
  init: function() {
    const getAvailableRocketFromPool = () => {
      const rockets = document.querySelectorAll("a-rocket");
      for (const rocket of rockets) {
        if (!rocket.is("active")) {
          return rocket;
        }
      }
      return null;
    };

    const launchRocket = (pointOnCircumference) => {
      const rocket = getAvailableRocketFromPool();
      if (!rocket) {
        console.log("could not add new rocket...");
        return;
      }
      rocket.setAttribute("position", {
        x: Math.cos(pointOnCircumference) * this.data.radius,
        y: 0,
        z: Math.sin(pointOnCircumference) * this.data.radius
      });
      rocket.setAttribute("visible", true);
      rocket.setAttribute("launch", '');
      rocket.addState('active')
    }

    const generateRandomRocket = () => {
      console.log("generating new rocket!");
      const randomCircumferenceRange = Math.random() * 2 * Math.PI;

      launchRocket(randomCircumferenceRange)
    };

    const doNextRocketLaunch = () => {
      const randomInt = Math.floor(Math.random() * 5);
      setTimeout(() => {
        generateRandomRocket()
        doNextRocketLaunch()
      }, (randomInt + 5) * 1000);
    };

    launchRocket(-Math.PI * 0.5)
    doNextRocketLaunch()
  }
});

