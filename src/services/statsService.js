const STORAGE_KEY = 'sevenWondersStats';

class MemoryStorage {
    constructor() {
        this.store = new Map();
    }

    getItem(key) {
        return this.store.has(key) ? this.store.get(key) : null;
    }

    setItem(key, value) {
        this.store.set(key, value);
    }

    removeItem(key) {
        this.store.delete(key);
    }
}

function getDefaultStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
    }
    return null;
}

function safeParse(json) {
    if (!json) return null;
    try {
        return JSON.parse(json);
    } catch (error) {
        console.warn('Failed to parse stored statistics; starting fresh.', error);
        return null;
    }
}

class StatsService {
    constructor(storage = getDefaultStorage()) {
        this.storage = storage || new MemoryStorage();
    }

    load() {
        const stored = this.storage ? this.storage.getItem(STORAGE_KEY) : null;
        const parsed = safeParse(stored);
        if (parsed && parsed.games && Array.isArray(parsed.games)) {
            return parsed;
        }
        return { games: [] };
    }

    save(stats) {
        if (!this.storage) return;
        this.storage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }

    clear() {
        if (!this.storage) return;
        this.storage.removeItem(STORAGE_KEY);
    }
}

function createStatsService(storage) {
    return new StatsService(storage || getDefaultStorage());
}

const exported = {
    StatsService,
    createStatsService,
    STORAGE_KEY
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
} else if (typeof window !== 'undefined') {
    window.StatsService = exported;
}

