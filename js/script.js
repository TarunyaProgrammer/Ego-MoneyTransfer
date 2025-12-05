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

// ^ SOCIAL SLIDER
(function () {
  const container = document.querySelector(".social-card-cont");
  const btns = document.querySelectorAll(".social-slider-btn");
  const [leftBtn, rightBtn] = btns;

  if (!container || !leftBtn || !rightBtn) return;

  // Scroll amount (approx width of a card + gap)
  const SCROLL_AMOUNT = 400;

  // Update button states
  const updateButtons = () => {
    // Left button
    if (container.scrollLeft <= 0) {
      leftBtn.classList.add("disable-btn");
    } else {
      leftBtn.classList.remove("disable-btn");
    }

    // Right button
    // Allow a small buffer (1px) for calculation errors
    if (
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 1
    ) {
      rightBtn.classList.add("disable-btn");
    } else {
      rightBtn.classList.remove("disable-btn");
    }
  };

  // Initial check
  updateButtons();

  // Scroll listeners
  leftBtn.addEventListener("click", () => {
    container.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    container.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  });

  // Update buttons on scroll end
  container.addEventListener("scroll", () => {
    updateButtons();
  });
})();

// ^ CURRENCY CONVERTER
(function () {
  const amountInput = document.getElementById("amount-input");
  const fromSelect = document.getElementById("from-currency");
  const toSelect = document.getElementById("to-currency");
  const resultInput = document.getElementById("result-input");
  const convertBtn = document.getElementById("convert-btn");
  const swapBtn = document.getElementById("swap-btn");
  const liveRateEl = document.getElementById("live-rate");
  const lastUpdatedEl = document.getElementById("last-updated");

  if (!amountInput || !fromSelect || !toSelect || !resultInput) return;

  let rates = {};

  // Fetch rates
  const fetchRates = async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      rates = data.rates;
      if (lastUpdatedEl) {
        lastUpdatedEl.textContent = new Date(
          data.time_last_update_utc
        ).toLocaleTimeString();
      }
      convert(); // Convert immediately after fetching
    } catch (err) {
      console.error("Failed to fetch rates:", err);
      if (liveRateEl) liveRateEl.textContent = "Error loading rates";
    }
  };

  // Conversion logic
  const convert = () => {
    if (!rates.USD) return; // Rates not loaded yet

    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount)) {
      resultInput.value = "";
      return;
    }

    // Base is USD
    // Formula: (Amount / RateFrom) * RateTo
    const rateFrom = rates[from];
    const rateTo = rates[to];

    if (!rateFrom || !rateTo) return;

    const converted = (amount / rateFrom) * rateTo;
    resultInput.value = converted.toFixed(2);

    // Update rate display
    const singleUnitRate = (1 / rateFrom) * rateTo;
    if (liveRateEl) {
      liveRateEl.textContent = `1 ${from} = ${singleUnitRate.toFixed(4)} ${to}`;
    }
  };

  // Event Listeners
  if (convertBtn) convertBtn.addEventListener("click", convert);
  
  // Real-time updates
  amountInput.addEventListener("input", convert);
  fromSelect.addEventListener("change", convert);
  toSelect.addEventListener("change", convert);

  // Swap
  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      const temp = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = temp;
      convert();
    });
  }

  // Init
  fetchRates();
})();
