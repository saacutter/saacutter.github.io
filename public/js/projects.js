document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelectorAll('nav a');

    // Handle navbar categories
    const categories = document.querySelectorAll('div.container');
    navbar.forEach((nav, i) => {
        // Highlight the category on hover
        nav.addEventListener('mouseover', () => nav.classList.add('navbar-selected'));

        // Unhighlight the category on mouse exit
        if (window.location.pathname == "/" && nav.id != "games") nav.addEventListener('mouseout', () => {if (!categories[i].checkVisibility()) nav.classList.remove('navbar-selected')});
        else nav.addEventListener('mouseout', () => nav.classList.remove('navbar-selected'));

        // Show the category elements on click
        nav.addEventListener('click', (e) => {
            if (window.location.pathname != "/" || nav.id == "games") return;

            // Prevent default behaviour of anchor tags
            e.preventDefault();

            // Unselect and hide all categories
            navbar.forEach((n) => n.classList.remove('navbar-selected'));
            categories.forEach((category) => category.style.display = 'none');

            // Select the clicked category
            nav.classList.add('navbar-selected');

            // Make the corresponding category visible
            categories[i].style.display = 'block';

            // Change the page title to reflect the current view (adapted from https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript)
            document.title = `saacutter.github.io - ${nav.id.charAt(0).toUpperCase() + nav.id.substring(1)}`;

            // Push the new URL to history (adapted from https://stackoverflow.com/questions/3528324/how-to-get-the-previous-url-in-javascript)
            if (window.history.state == null || window.history.state.prevView != nav.id) window.history.pushState({prevView: nav.id}, '', `?view=${nav.id}`);
        });
    });

    // Set the view to the previous page if the back buttons are used
    window.addEventListener('popstate', (e) => {
        if (e.state) setView(e.state.prevView);
        else setView(null);
    });

    // Set the search parameters
    if (window.location.pathname == "/") {
        setView(null);
    }
});

function setView(view) {
    if (view == null) {
        let url = new URL(window.location.href);
        let params = url.searchParams;
        view = params.get('view');
        if (document.querySelector(`#${view}`) == null) view = 'home';
    }
    document.querySelector(`#${view}`).click();
}