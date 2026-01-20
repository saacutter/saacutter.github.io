document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');

    // Add button implementation
    colourMode = document.querySelector('#colour-mode');
    colourText = document.querySelector('#colour-text');
    colourMode.addEventListener('click', () => setTheme(curTheme));

    // Set default preference
    let curTheme;
    let preference = localStorage.getItem('theme-preference');
    if (preference != null) curTheme = preference;
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) curTheme = "dark";
    else curTheme = "light";

    // Set the theme
    setTheme(curTheme);

    function setTheme(theme) {
        // Change the source to match the theme
        colourMode.src = `/img/${theme}_mode.svg`;
        if (colourText) colourText.innerHTML = `${theme.charAt(0).toUpperCase() + theme.substring(1)} Mode`;

        // Set the data theme attribute
        body.setAttribute("data-theme", theme);

        // Save the theme preference in local storage
        localStorage.setItem('theme-preference', theme);

        // Identify the next theme
        curTheme = theme == "light" ? "dark" : "light";
    }
});