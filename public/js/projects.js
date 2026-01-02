document.addEventListener('DOMContentLoaded', () => {
    // Handle navbar categories
    const navbar = document.querySelectorAll('nav a');
    const categories = document.querySelectorAll('div.container');
    navbar.forEach((nav, i) => {
        // Highlight the category on hover
        nav.addEventListener('mouseover', () => nav.classList.add('navbar-selected'));

        // Unhighlight the category on mouse exit
        nav.addEventListener('mouseout', () => {if (!categories[i].checkVisibility()) nav.classList.remove('navbar-selected')});

        // Show the category elements on click
        nav.addEventListener('click', () => {
            // Unselect and hide all categories
            navbar.forEach((n) => n.classList.remove('navbar-selected'));
            categories.forEach((category) => category.style.display = 'none');

            // Select the clicked category
            nav.classList.add('navbar-selected');

            // Make the corresponding category visible
            categories[i].style.display = 'block';
        })
    });

    navbar[0].click();
});