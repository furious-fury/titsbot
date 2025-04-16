const fs = require('fs');
const path = require('path');

// File paths for persistent storage
const DATA_DIR = path.join(__dirname, 'data');
const SCORES_FILE = path.join(DATA_DIR, 'scores.json');
const COOLDOWNS_FILE = path.join(DATA_DIR, 'cooldowns.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// In-memory storage with group-specific data
let groupScores = new Map(); // Map<groupId, Map<userId, score>>
let cooldowns = new Map(); // Map<groupId_userId, timestamp>

const COOLDOWN_DURATION = 60 * 1000; // 1 minute in milliseconds

// Load data from files
function loadData() {
    try {
        if (fs.existsSync(SCORES_FILE)) {
            const scoresData = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
            // Convert the nested object structure to nested Maps with numeric keys
            groupScores = new Map(
                Object.entries(scoresData).map(([groupId, users]) => [
                    Number(groupId), // Convert group ID to number
                    new Map(
                        Object.entries(users).map(([userId, score]) => [
                            Number(userId), // Convert user ID to number
                            Number(score)  // Convert score to number
                        ])
                    )
                ])
            );
        }

        if (fs.existsSync(COOLDOWNS_FILE)) {
            const cooldownsData = JSON.parse(fs.readFileSync(COOLDOWNS_FILE, 'utf8'));
            cooldowns = new Map(Object.entries(cooldownsData));
        }
        console.log('Data loaded successfully!');
    } catch (error) {
        console.error('Error loading data:', error);
        // Initialize empty maps if loading fails
        groupScores = new Map();
        cooldowns = new Map();
    }
}

// Save data to files
function saveData() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        // Convert nested Maps to nested objects for JSON storage
        const scoresData = Object.fromEntries(
            Array.from(groupScores.entries()).map(([groupId, users]) => [
                String(groupId), // Convert group ID to string for JSON
                Object.fromEntries(
                    Array.from(users.entries()).map(([userId, score]) => [
                        String(userId), // Convert user ID to string for JSON
                        score
                    ])
                )
            ])
        );
        const cooldownsData = Object.fromEntries(cooldowns);

        fs.writeFileSync(SCORES_FILE, JSON.stringify(scoresData, null, 2));
        fs.writeFileSync(COOLDOWNS_FILE, JSON.stringify(cooldownsData, null, 2));
        console.log('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Load data on startup
loadData();

function getUserScore(groupId, userId) {
    const groupData = groupScores.get(groupId);
    if (!groupData) return 0;
    return Number(groupData.get(userId)) || 0;
}

function updateUserScore(groupId, userId, username, growth) {
    if (!groupScores.has(groupId)) {
        groupScores.set(groupId, new Map());
    }
    const groupData = groupScores.get(groupId);
    const currentScore = getUserScore(groupId, userId);
    const newScore = currentScore + growth;
    groupData.set(userId, newScore);
    saveData(); // Save after updating
    return newScore;
}

function getLeaderboard(groupId) {
    const groupData = groupScores.get(groupId);
    if (!groupData) return [];
    
    // Convert Map to array and sort by score
    return Array.from(groupData.entries())
        .map(([userId, score]) => [userId, Number(score)])
        .sort((a, b) => b[1] - a[1]);
}

function checkCooldown(groupId, userId) {
    const key = `${groupId}_${userId}`;
    const lastUsed = cooldowns.get(key);
    const now = Date.now();
    
    if (lastUsed && (now - lastUsed) < COOLDOWN_DURATION) {
        const remainingTime = Math.ceil((COOLDOWN_DURATION - (now - lastUsed)) / 1000);
        return remainingTime;
    }
    
    cooldowns.set(key, now);
    saveData(); // Save after updating
    return 0;
}

// Reset all scores
function resetAllScores() {
    groupScores = new Map();
    cooldowns = new Map();
    saveData();
    console.log('All scores and cooldowns have been reset!');
}

module.exports = {
    getUserScore,
    updateUserScore,
    getLeaderboard,
    checkCooldown,
    saveData,
    resetAllScores
};
