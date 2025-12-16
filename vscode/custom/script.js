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
