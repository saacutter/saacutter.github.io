document.addEventListener('DOMContentLoaded', () => {
    // Add light/dark mode button implementation
    colourMode = document.querySelector('#colour-mode');
    colourText = document.querySelector('#colour-text');
    colourMode.addEventListener('click', () => {
        if (colourMode.getAttribute('src') == "/img/dark_mode.svg") {
            setDark();
            localStorage.setItem('colour-preference', 'dark');
        } else {
            setLight();
            localStorage.setItem('colour-preference', 'light');
        }
    });

    // Set default preference
    let preference = localStorage.getItem('colour-preference');
    if (preference == "dark") setDark();
    else if (preference == "light") setLight();
    else if (window.matchMedia('(prefers-color-scheme: dark)')) setDark();
    else setLight();

    // Set dark mode
    function setDark() {
        // Set the source to light mode
        colourMode.src = "/img/light_mode.svg";
        colourText.innerHTML = "Light Mode";

        // Get the colours for dark mode
        let root = document.documentElement;
        let bgColour = getComputedStyle(root).getPropertyValue('--dark-bg-colour');
        let textColour = getComputedStyle(root).getPropertyValue('--dark-text-colour');

        document.querySelector('body').style.backgroundColor = bgColour;
        CONTROLS.style.filter = "invert(100%)";
        document.querySelectorAll('.games-hotbar a').forEach((a) => a.style.filter = "invert(100%)");
    }

    // Set light mode
    function setLight() {
        // Set the source to dark mode
        colourMode.src = "/img/dark_mode.svg";
        colourText.innerHTML = "Dark Mode";

        // Get the colours for light mode
        let root = document.documentElement;
        let bgColour = getComputedStyle(root).getPropertyValue('--bg-colour');
        let textColour = getComputedStyle(root).getPropertyValue('--text-colour');

        document.querySelector('body').style.backgroundColor = bgColour;
        CONTROLS.style.filter = "invert(0%)";
        document.querySelectorAll('.games-hotbar a').forEach((a) => a.style.filter = "invert(0%)");
    }
});