// ^ NAVBAR

(function () {
  const navbar = document.getElementById("navbar");
  let lastY = window.scrollY;
  let ticking = false;
  const THRESHOLD = 8; // ignore micro-scrolls

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastY;

          if (Math.abs(delta) > THRESHOLD) {
            if (delta > 0 && currentY > 0) {
              // scrolling down
              navbar.classList.add("hide");
            } else {
              // scrolling up
              navbar.classList.remove("hide");
            }
            lastY = currentY;
          }

          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
})();
