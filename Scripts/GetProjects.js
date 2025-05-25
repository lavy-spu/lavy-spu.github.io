import { ConfigSingleton } from "./GetProfile.js";

(async () => {
    try {
        const configInstance = await ConfigSingleton.getInstance();
        await ConfigSingleton.isConfigLoaded(); // Ensure the config is loaded
        const configData = configInstance.getConfig();

        // Populate Project Details
        updateHTML(configData);
    } catch (error) {
        console.error("Error:", error);
    }
})();

function updateHTML(configData) {
    const projectsContainer = document.querySelector("#projectsContainer");

    if (!projectsContainer) {
        console.error("Projects container element is missing in the DOM");
        return;
    }

    Object.keys(configData.Projects).forEach((projectKey, index) => {
        const project = configData.Projects[projectKey];
        const projectTitle = project.Title;

        if (projectTitle) {
            const projectDiv = document.createElement("div");
            projectDiv.className = "project";
            projectDiv.id = `project${index + 1}`;

            const projectImg = document.createElement("img");
            projectImg.id = `pfProject${index + 1}Img`;
            projectImg.src = `Content/${project.MainImage}`;
            projectDiv.appendChild(projectImg);

            const projectTitleElem = document.createElement("h3");
            projectTitleElem.id = `pfProject${index + 1}Title`;
            projectTitleElem.innerHTML = projectTitle;
            projectDiv.appendChild(projectTitleElem);

            const projectDesc = document.createElement("p");
            projectDesc.id = `pfProject${index + 1}Desc`;
            projectDesc.innerHTML = project.Desc;
            projectDiv.appendChild(projectDesc);

            const projectRepo = document.createElement("a");
            projectRepo.id = `pfProject${index + 1}Repo`;
            if (project.Webpage) {
                projectRepo.href = project.Webpage;
                projectRepo.innerHTML = "Visit Website";
            } else if (project.GitHubRepo) {
                projectRepo.href = project.GitHubRepo;
                projectRepo.innerHTML = "GitHub Repo";
            } else {
                projectRepo.style.display = "none"; // Hide if neither key exists
            }
            projectDiv.appendChild(projectRepo);

            const openProject = document.createElement("button");
            openProject.id = `openProject${index + 1}`;
            openProject.innerHTML = "View Details";
            projectDiv.appendChild(openProject);

            if (!project.DetailImages || project.DetailImages.length < 1) {
                openProject.style.display = "none";
            } else {
                openProject.onclick = () => {
                    addImages(project.DetailImages);
                    document.querySelector("#modalPage").style.display = "block";
                    showImages(slideIdx);
                };
            }

            projectsContainer.appendChild(projectDiv);
        } else {
            console.error(`Project ${index + 1} title is missing in the JSON data`);
        }
    });
}

function addImages(imgs) {
    // First remove any existing images
    let il = document.querySelector("#imgList");
    while (il.firstChild) il.removeChild(il.firstChild);

    // Then add them in from the profile
    for (let i = 0; i < imgs.length; i++) {
        addListItem(imgs[i]);
    }
}

function addListItem(newImg) {
    const newElem = document.createElement("img");
    newElem.setAttribute("src", "Content/".concat(newImg));
    const il = document.querySelector("#imgList");
    il.appendChild(newElem);
}

/* Handle the Carousel */
let slideIdx = 1;

document.querySelector("#next").onclick = () => {
    showImages(++slideIdx);
};

document.querySelector("#prev").onclick = () => {
    showImages(--slideIdx);
};

function showImages(n) {
    const slides = document.querySelectorAll("#imgList>img");
    if (n > slides.length) { slideIdx = 1; }
    if (n < 1) { slideIdx = slides.length; }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIdx - 1].style.display = "block";
}

document.querySelector("#XOut").onclick = () => {
    document.querySelector("#modalPage").style.display = "none";
};

window.onclick = (event) => {
    if (event.target == document.querySelector("#modalPage")) {
        document.querySelector("#modalPage").style.display = "none";
    }
};