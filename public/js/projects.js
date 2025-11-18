const p = document.querySelector('#p-projects');
const pProjects = p.querySelectorAll('li');

const u = document.querySelector('#u-projects');
const uProjects = u.querySelectorAll('li');

const defaultHeight = pProjects[0].getBoundingClientRect().height;

for (let i = 0; i < pProjects.length; i++) {
    pProjects[i].classList.add('project');
    pProjects[i].addEventListener('click', () => {click(pProjects[i], i, pProjects)});
}

for (let i = 0; i < uProjects.length; i++) {
    uProjects[i].classList.add('project');
    uProjects[i].addEventListener('click', () => {click(uProjects[i], i, uProjects)});
}

// Function for deciding clicks
function click(project, i, projects) {
    // If the clicked project is already selected, don't do anything
    if (project.classList.contains("project-selected")) return;

    // Remove the selected class from all other projects of the same type and adjust the height of the panels
    for (let j = 0; j < projects.length; j++) {         
        projects[j].classList.remove('project-selected');
        projects[j].classList.add('project');
    }

    for (let j = 0; j < projects.length; j++) {
        let height;
        if (j < i) {
            height = defaultHeight - ((i - j + 1)*20);
            projects[j].style.height = `${height}px`;
        } else if (i < j) {
            height = defaultHeight + ((i - j)*20);
            projects[j].style.height = `${height}px`;
        }
    }

    // Add the selected class to the selected project
    project.classList.add('project-selected');
    project.classList.remove('project');
}

// Function for handling navbar categories
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

// Dynamically adjust how the viewport is rendered
function resize() {
    const divs = document.querySelectorAll('ul');
    if (window.innerWidth <= 800) {
        divs.forEach((div) => div.classList.add('project-grid'));
        divs.forEach((div) => div.classList.remove('pProjects'));
    } else {
        divs.forEach((div) => div.classList.add('pProjects'));
        divs.forEach((div) => div.classList.remove('project-grid'));

        // Select the middle project
        let middle = Math.floor((pProjects.length - 1) / 2);
        pProjects[middle].click();

        middle = Math.floor((uProjects.length - 1) / 2);
        uProjects[middle].click();
    }
}

window.addEventListener('resize', resize);
resize();