import Dexie from "dexie";  

type AppStateItem = {
    key: string;
    value: string; 
};

const db = new Dexie("SmartSpendAI_DB");

db.version(1).stores({
    appState: "&key",
});

const appStateTable = db.table<AppStateItem>("appState");

export const indexedDbStorage = {
    getItem: async (key: string): Promise<string | null> => {
        try {
            const item = await appStateTable.get(key);
            return item ? item.value : null;
        } catch (error) {
            console.error("Error getting item from IndexedDB:", error);
            return null;
        }
    },
    setItem: async (key: string, value: string): Promise<void> => {
        try {
            await appStateTable.put({ key, value });
        }   catch (error) {
            console.error("Error setting item in IndexedDB:", error);
            throw error;
        }
    },
    removeItem: async (key: string): Promise<void> => {
        try {
            await appStateTable.delete(key);
        } catch (error) {
            console.error("Error removing item from IndexedDB:", error);
            throw error;
        }
    },
};