export class ConfigSingleton {
    static #instance = null;
    static #dataLoaded = false;
    static #loadingPromise = null;

    constructor() {
        if (ConfigSingleton.#instance) {
            throw new Error("Use ConfigSingleton.getInstance()");
        }
    }

    static async getInstance() {
        if (!this.#instance) {
            this.#instance = new ConfigSingleton();
            ConfigSingleton.#loadingPromise = this.#instance.loadConfig();
            await ConfigSingleton.#loadingPromise;
        }
        return this.#instance;
    }

    async loadConfig() {
        try {
            const response = await fetch('./Content/profile.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch the configuration file: ${response.status} ${response.statusText}`);
            }
            this.config = await response.json();
            ConfigSingleton.#dataLoaded = true;
        } catch (error) {
            console.error('Error loading configuration:', error);
            ConfigSingleton.#instance = null;
            throw error;
        }
    }

    getConfig() {
        if (!ConfigSingleton.#dataLoaded) {
            throw new Error("Configuration is not loaded yet.");
        }
        return this.config;
    }

    static isConfigLoaded() {
        return ConfigSingleton.#loadingPromise;
    }
}