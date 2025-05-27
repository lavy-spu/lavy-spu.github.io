import { ConfigSingleton } from "./GetProfile.js";

(async () => {
    try {
        const configInstance = await ConfigSingleton.getInstance();
        await ConfigSingleton.isConfigLoaded(); // Ensure the config is loaded
        const experienceData = configInstance.getConfig().Experience.Companies;
        
        // Populate Sidebar and Default Details
        populateSidebar(experienceData);
        updateExperienceDetails(experienceData[0]); // Load the first company by default

        // Update the "Open Resume" button to open the modal
        const resumeButton = document.getElementById("pfResume");
        resumeButton.onclick = () => {
            const resumeUrl = `./Content/${experienceData[0].Resume}`;
            const modal = document.getElementById("resumeModal");
            const resumeFrame = document.getElementById("resumeFrame");
            resumeFrame.src = resumeUrl; // Set the source of the iframe
            modal.style.display = "block";
        };
    } catch (error) {
        console.error("Error:", error);
    }
})();

function populateSidebar(companies) {
    const sidebar = document.getElementById("company-list");
    sidebar.innerHTML = ""; // Clear existing content

    companies.forEach((company, index) => {
        const companyItem = document.createElement("li");
        companyItem.textContent = company.Name;
        companyItem.classList.add("sidebar-item");
        companyItem.dataset.index = index; // Attach the index for reference

        // Add click listener to load company details
        companyItem.addEventListener("click", () => {
            // Remove the 'active' class from all sidebar items
            const allItems = document.querySelectorAll(".sidebar-item");
            allItems.forEach((item) => item.classList.remove("active"));

            // Add the 'active' class to the clicked item
            companyItem.classList.add("active");

            // Update the experience details
            updateExperienceDetails(companies[index]);
        });

        sidebar.appendChild(companyItem);
    });

    // Set the first item as active by default
    const firstItem = sidebar.querySelector(".sidebar-item");
    if (firstItem) {
        firstItem.classList.add("active");
    }
}

function updateExperienceDetails(company) {
    document.getElementById("exp-title").textContent = `${company.Title}`;
    document.getElementById("exp-date").textContent = company.Date;

    // Populate the list of details
    const detailList = document.getElementById("exp-detail-list");
    detailList.innerHTML = ""; // Clear existing content

    company.Details.forEach((detail) => {
        const listItem = document.createElement("li");
        listItem.textContent = detail;
        detailList.appendChild(listItem);
    });

    // Update the "Open Resume" button to open the modal
    const resumeButton = document.getElementById("pfResume");
    resumeButton.onclick = () => {
        const resumeUrl = `./Content/${company.Resume}`;
        const modal = document.getElementById("resumeModal");
        const resumeFrame = document.getElementById("resumeFrame");
        resumeFrame.src = resumeUrl; // Set the source of the iframe
        modal.style.display = "block";
    };
}

// Close the modal when the close button is clicked
const closeModalButton = document.getElementById("closeModal");
const modal = document.getElementById("resumeModal");

closeModalButton.onclick = () => {
    modal.style.display = "none";
};

// Close the modal when clicking outside the modal content
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};