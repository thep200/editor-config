var menuExist = false;
var quickInputListNode = null;
var factor = 1;
var refresh = false;
var cachedHeight = -1;
var cachedPreOneTop = 0;
const padding = 10; // up + bottom

// Animation state
var lastSearchValue = "";
var animationTimeout = null;
var isAnimating = false;

// Init static styleprofile
var styleElement = document.createElement("style");
var styles = `
  .quick-input-widget {
    top: 20% !important;
    box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.2) !important;
    width: 700px !important;
    transform: translateX(-40%) !important;
    left: calc(50% - 50px) !important;
    border-radius: 10px !important;
    border: 1.25px solid #4e4e4e !important;
    animation: widgetFadeIn 0.08s ease-out forwards;
  }

  @keyframes widgetFadeIn {
    from {
      opacity: 0.5;
      transform: translateX(-40%) translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateX(-40%) translateY(0);
    }
  }

  @keyframes rowSlideIn {
    from {
      opacity: 0.3;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes rowFadeIn {
    from {
      opacity: 0.4;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes highlightPulse {
    0% {
      background-color: transparent;
    }
    50% {
      background-color: rgba(100, 150, 255, 0.1);
    }
    100% {
      background-color: transparent;
    }
  }

  @keyframes textGlow {
    0%, 100% {
      text-shadow: 0 0 4px rgba(255, 255, 255, 0.5), 0 0 4px rgba(255, 255, 255, 0.3);
    }
    50% {
      text-shadow: 0 0 6px rgba(255, 255, 255, 0.7), 0 0 6px rgba(255, 255, 255, 0.4);
    }
  }

  .quick-input-widget .monaco-inputbox {
    padding: 10px 10px 10px 10px !important;
    border-radius: 5px!important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    box-shadow:
      0 0 6px 1px rgba(255, 255, 255, 0.06),
      0 0 15px 2px rgba(255, 255, 255, 0.03),
      inset 0 0 8px rgba(255, 255, 255, 0.02);
    transition: box-shadow 0.15s ease, border-color 0.15s ease;
  }

  .quick-input-widget .monaco-inputbox:focus-within {
    border-color: rgba(255, 255, 255, 0.2) !important;
    box-shadow:
      0 0 8px 2px rgba(255, 255, 255, 0.1),
      0 0 20px 4px rgba(255, 255, 255, 0.05),
      inset 0 0 10px rgba(255, 255, 255, 0.03);
  }

  .quick-input-widget .quick-input-action {
    padding-top: 10px !important;
    font-size: 14px !important;
  }

  .quick-input-widget .quick-input-list {
    background: transparent !important;
  }

  .quick-input-widget .quick-input-list .monaco-list {
    background: transparent !important;
  }

  .quick-input-widget .monaco-list-rows {
    font-size: 13px !important;
    background: transparent !important;
  }

  .quick-input-widget .monaco-list-row {
    padding: 10px !important;
    height: auto !important;
    background: transparent !important;
    transition: background-color 0.08s ease, transform 0.08s ease;
  }

  .quick-input-widget .monaco-list-row .label-name,
  .quick-input-widget .monaco-list-row .monaco-highlighted-label {
    color: rgba(200, 200, 200, 0.7) !important;
    transition: color 0.15s ease, text-shadow 0.15s ease;
  }

  .quick-input-widget .monaco-list-row.animate-in {
    animation: rowSlideIn 0.1s ease-out forwards;
  }

  .quick-input-widget .monaco-list-row.animate-filter {
    animation: rowFadeIn 0.08s ease-out forwards;
  }

  .quick-input-widget .monaco-list-row.highlight-pulse {
    animation: highlightPulse 0.2s ease-out forwards;
  }

  .quick-input-widget .monaco-list-row:hover,
  .quick-input-widget .monaco-list-row.focused {
    transform: translateX(3px);
  }

  .quick-input-widget .monaco-list-row:hover .label-name,
  .quick-input-widget .monaco-list-row:hover .monaco-highlighted-label,
  .quick-input-widget .monaco-list-row.focused .label-name,
  .quick-input-widget .monaco-list-row.focused .monaco-highlighted-label {
    color: #fff !important;
    animation: textGlow 1.5s ease-in-out infinite !important;
  }

  .quick-input-widget .quick-input-list-entry {
    position: relative;
    padding: 0px 0px 0px 0px;
  }
  .quick-input-widget .quick-input-list-entry .codicon[class*=codicon-] {
    font-size: 16px;
    transition: transform 0.1s ease;
  }
  .quick-input-widget .quick-input-list-entry:hover .codicon[class*=codicon-],
  .quick-input-widget .focused .quick-input-list-entry .codicon[class*=codicon-] {
    transform: scale(1.1);
  }
  .quick-input-widget .quick-input-list .quick-input-list-entry.quick-input-list-separator-border {
    border-top-width: 0px !important;
  }
  .quick-input-widget .quick-input-list .quick-input-list-label-meta .monaco-highlighted-label:before {
    content: ' 🧚🏻 ';
  }
  .quick-input-widget .quick-input-list .quick-input-list-entry .monaco-action-bar.animated.quick-input-list-entry-action-bar {
    height: unset;
  }
  .editor-group-watermark {
    max-width: 500px !important;
    padding-left: 1em;
    padding-right: 1em;
  }
`;
styleElement.textContent = styles;
document.head.appendChild(styleElement);

// Animation functions
function animateFilteredRows() {
    if (!quickInputListNode) return;

    const rows = quickInputListNode.querySelectorAll(".monaco-list-rows .monaco-list-row");

    rows.forEach((row, index) => {
        // Remove existing animation classes
        row.classList.remove("animate-in", "animate-filter", "highlight-pulse");

        // Force reflow to restart animation
        void row.offsetWidth;

        // Add animation class with staggered delay
        setTimeout(() => {
            row.classList.add("animate-filter");

            // Remove class after animation completes
            setTimeout(() => {
                row.classList.remove("animate-filter");
            }, 100);
        }, index * 10); // Stagger each row by 10ms
    });
}

function animateInitialRows() {
    if (!quickInputListNode) return;

    const rows = quickInputListNode.querySelectorAll(".monaco-list-rows .monaco-list-row");

    rows.forEach((row, index) => {
        row.style.opacity = "0";

        setTimeout(() => {
            row.style.opacity = "";
            row.classList.add("animate-in");

            setTimeout(() => {
                row.classList.remove("animate-in");
            }, 120);
        }, index * 15);
    });
}

function setupSearchInputListener() {
    const searchInput = document.querySelector(".quick-input-widget .monaco-inputbox input");

    if (searchInput && !searchInput.hasAttribute("data-animation-listener")) {
        searchInput.setAttribute("data-animation-listener", "true");
        lastSearchValue = searchInput.value;

        searchInput.addEventListener("input", (e) => {
            const newValue = e.target.value;

            // Only animate if search value actually changed
            if (newValue !== lastSearchValue) {
                lastSearchValue = newValue;

                // Debounce animation to avoid too many triggers
                if (animationTimeout) {
                    clearTimeout(animationTimeout);
                }

                animationTimeout = setTimeout(() => {
                    animateFilteredRows();
                }, 50);
            }
        });

        // Add typing indicator animation
        searchInput.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== "Escape" && !e.key.startsWith("Arrow")) {
                const inputBox = searchInput.closest(".monaco-inputbox");
                if (inputBox) {
                    inputBox.style.transform = "scale(1.005)";
                    setTimeout(() => {
                        inputBox.style.transform = "";
                    }, 100);
                }
            }
        });
    }
}

function zoom(obj, primaryKey, cacheKey) {
    const v = parseInt(obj.style[primaryKey], 10);
    if (refresh || !obj.hasOwnProperty(cacheKey) || obj[cacheKey] != v) {
        set(obj, Math.round(v * factor), primaryKey, cacheKey);
        return true;
    }
    return v === 0;
}

function set(obj, v, primaryKey, cacheKey) {
    obj[cacheKey] = v;
    obj.style[primaryKey] = obj[cacheKey] + "px";
}

function setPaddingBottom(obj, v) {
    if (parseInt(obj.style.paddingBottom, 10) != v) {
        obj.style["paddingBottom"] = v + "px";
    }
}

function resize() {
    const monacoListRows =
        quickInputListNode.querySelector(".monaco-list-rows");
    const rows = quickInputListNode.querySelectorAll(
        ".monaco-list-rows .monaco-list-row"
    );

    refresh = false;
    if (rows && rows.length > 0) {
        var defaultHeight = parseInt(rows[0].style.height, 10);
        if (defaultHeight != cachedHeight) {
            factor = (defaultHeight + 10) / defaultHeight;
            cachedHeight = defaultHeight;
            refresh = true;
        }
        cachedPreOneTop = parseInt(rows[0].style.top, 10);
        setPaddingBottom(quickInputListNode, 5);
    } else {
        setPaddingBottom(quickInputListNode, 0);
        return;
    }

    zoom(quickInputListNode, "maxHeight", "cachedMaxHeight");
    zoom(monacoListRows, "height", "cachedHeight");
    zoom(monacoListRows, "top", "cachedTop");
    moving = false;
    rows.forEach((row) => {
        moving = zoom(row, "top", "cachedTop") || moving;
        // [[Patch]]
        // Fix a bug that some rows are not moving, so
        // I force-set their top based on the previous one.
        if (moving && parseInt(row.style.top, 10) < cachedPreOneTop) {
            set(
                row,
                cachedPreOneTop +
                Math.floor(parseInt(row.style.height, 10) * factor),
                "top",
                "cachedTop"
            );
        }
        cachedPreOneTop = parseInt(row.style.top, 10);
    });

    const scrollbar = quickInputListNode.querySelector(".scrollbar.vertical");
    if (scrollbar) {
        zoom(scrollbar, "height", "cachedHeight");
        slider = scrollbar.querySelector(".slider");
        zoom(slider, "height", "cachedHeight");
        zoom(slider, "top", "cachedTop");
    }
}

const target = document.body;
const config = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (
            !menuExist &&
            mutation.type === "childList" &&
            mutation.addedNodes.length > 0
        ) {
            quickInputListNode = document.getElementById("quickInput_list");
            if (quickInputListNode) {
                menuExist = true;
                resize();

                // Setup search input listener for animations
                setTimeout(() => {
                    setupSearchInputListener();
                    animateInitialRows();
                }, 50);

                const maxHeightObserver = new MutationObserver((mutations) => {
                    resize();

                    // Re-setup listener if input changes
                    setupSearchInputListener();
                });
                maxHeightObserver.observe(quickInputListNode, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    attributeFilter: ["style"],
                });
            }
        }

        // Reset state when quick input is removed
        if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
            const quickInputWidget = document.querySelector(".quick-input-widget");
            if (!quickInputWidget) {
                menuExist = false;
                quickInputListNode = null;
                lastSearchValue = "";
                if (animationTimeout) {
                    clearTimeout(animationTimeout);
                    animationTimeout = null;
                }
            }
        }
    }
});

observer.observe(target, config);
