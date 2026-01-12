document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelectorAll('nav a');

    if (window.location.pathname == "/") {
        const url = new URL(window.location.href);

        // Handle navbar categories
        const categories = document.querySelectorAll('div.container');
        navbar.forEach((nav, i) => {
            // Handle the games anchor separately
            if (nav.id == "games") {
                // Highlight the category on hover
                nav.addEventListener('mouseover', () => nav.classList.add('navbar-selected'));

                // Unhighlight the category on mouse exit
                nav.addEventListener('mouseout', () => nav.classList.remove('navbar-selected'));
            } else {
                // Highlight the category on hover
                nav.addEventListener('mouseover', () => nav.classList.add('navbar-selected'));

                // Unhighlight the category on mouse exit
                nav.addEventListener('mouseout', () => {if (!categories[i].checkVisibility()) nav.classList.remove('navbar-selected')});

                // Show the category elements on click
                nav.addEventListener('click', (e) => {
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

                    // Push the new URL to history
                    window.history.pushState({}, '', `?view=${nav.id}`)
                });
            }
        });

        // Set the search parameters
        const params = url.searchParams;
        let view = params.get('view') || 'home';
        if (document.querySelector(`#${view}`) == null) view = 'home';
        document.querySelector(`#${view}`).click();
    } else {
        navbar.forEach((nav) => {
            // Highlight the category on hover
            nav.addEventListener('mouseover', () => nav.classList.add('navbar-selected'));

            // Unhighlight the category on mouse exit
            nav.addEventListener('mouseout', () => nav.classList.remove('navbar-selected'));
        });
    }
});