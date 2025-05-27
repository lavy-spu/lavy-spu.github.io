import { ConfigSingleton } from "./GetProfile.js";

(async () => {
    try {
        const configInstance = await ConfigSingleton.getInstance();
        await ConfigSingleton.isConfigLoaded(); // Ensure the config is loaded
        const configData = configInstance.getConfig();

        // Populate About Section
        updateAboutSection(configData.About);
    } catch (error) {
        console.error("Error:", error);
    }
})();

function updateAboutSection(aboutData) {
    // Ensure the elements exist before setting their properties
    const thumbnailElement = document.querySelector("#pfThumbnail");
    const aboutTextElement = document.querySelector("#pfAboutText");
    const locationElement = document.querySelector("#pfLocation");

    if (thumbnailElement && aboutTextElement && locationElement) {
        thumbnailElement.src = "Content/".concat(aboutData.Thumbnail);
        aboutTextElement.innerHTML = aboutData.AboutText; // Use innerHTML to insert HTML content
        locationElement.innerText = aboutData.Location;
    } else {
        console.error("One or more about section elements are missing in the DOM");
    }
}