const positiveMessages = [
    "Boom! You just leveled up by *+{X}cm*. Welcome to the *{CupSize} cup* club, queen.",
    "Titty fairy just paid you a visit — *+{X}cm* and you're now rocking a fierce *{CupSize} cup*!",
    "Tits upgraded: *+{X}cm* added. You're now dangerously close to causing whiplash with that *{CupSize} cup* energy.",
    "*+{X}cm* added to your glorious chest. You're now a proud *{CupSize} cup* — handle with care!",
    "Alert: *+{X}cm* tit expansion detected. You've ascended to the divine *{CupSize} cup* tier.",
    "*+{X}cm*? Girl, your cup runneth over — welcome to the *{CupSize} cup* elite.",
    "Your girls just got a promotion: *+{X}cm*. Now serving *{CupSize} cup* realness.",
    "You've been blessed with *+{X}cm* of juicy growth. Say hello to your new *{CupSize} cup* personality.",
    "The universe heard your wish — *+{X}cm* and a stunning *{CupSize} cup* just for you.",
    "Tit growth update: *+{X}cm*. Status: dangerously stacked at *{CupSize} cup*.",
    "*+{X}cm*? Girl, you're climbing the alphabet. Welcome to *{CupSize} cup*, where bras fear you.",
    "Tiddy inflation alert: *+{X}cm* added. You're now broadcasting in full *{CupSize} cup* HD.",
    "Congratulations! *+{X}cm* has been successfully deposited into your boob bank. New balance: *{CupSize} cup*.",
    "Babe, you've unlocked a new breast tier: *+{X}cm*. That's pure *{CupSize} cup* excellence.",
    "Growth detected: *+{X}cm*. That's enough to knock over small children. Enjoy your *{CupSize} cup* upgrade.",
    "*+{X}cm* installed. Your boobs are now legally classified as weapons. *{CupSize} cup* and proud.",
    "Ding! Tit growth: *+{X}cm*. The *{CupSize} cup* gods are smiling upon you.",
    "Tits buffed: *+{X}cm*. You're radiating unstoppable *{CupSize} cup* power."
];

const cooldownMessages = [
    "Whoa there, tit-hungry! Cool your jets — the boob gods are on a coffee break.",
    "Patience, darling. Great tits aren't built in a second. Come back later.",
    "You just grew! Let those digital mammaries breathe before you ask for more.",
    "You already got your tit boost, you greedy little goblin. Try again later."
];

const zeroMessages = [
    "Absolutely nothing. The boob gods looked at you and said 'Nah.'",
    "*0cm*? Tragic. Not even a sympathy swell.",
    "The titty fairy ghosted you today. Better luck next time.",
    "Zero growth detected. Your chest said, 'We're good, thanks.'",
    "Nothing grew. Not even a jiggle. The disrespect.",
    "The universe said flat is justice today. *0cm*, baby.",
    "Nada. Zilch. Your boob dreams have been postponed.",
    "Not even a whisper of cleavage. You remain at your current tit level.",
    "*0cm* added. Maybe try manifesting harder next time, queen.",
    "Titty status: unchanged. Maybe they're just shy today.",
    "No growth, no glory. The boob buffet is closed for you, sis.",
    "Denied by the mammary gods. *0cm*. Cry about it.",
    "Your chest took a vote… and unanimously decided to stay the same.",
    "Zero. You really rolled the flattest tit fate possible.",
    "Today, your cup remains empty — literally."
];

const negativeMessages = [
    "Oop—someone angered the boob gods. *-{X}cm*. You've been demoted to *{CupSize} cup*.",
    "Shrinkage incoming: *-{X}cm*. Your titties are retreating. Current cup: *{CupSize} cup*.",
    "Yikes! *-{X}cm*. Your cup size has been nerfed to *{CupSize} cup*. Try again later.",
    "Tragic titty news: *-{X}cm*. The girls are downsizing to *{CupSize} cup*.",
    "Oops, a tit recession hit. *-{X}cm*. Welcome to the humble life of a *{CupSize} cup*.",
    "Boob shrink detected: *-{X}cm*. You're now sporting a sleek *{CupSize} cup* vibe.",
    "The boob gods giveth, and they taketh away. *-{X}cm*. You've descended to *{CupSize} cup*.",
    "Tits deflated by *-{X}cm*. Welcome to the *{CupSize} cup* minimalist era.",
    "Emergency alert: *-{X}cm* boob loss. Holding on tight to your new *{CupSize} cup* identity.",
    "Boob downgrade in progress… *-{X}cm* lost. Current cup: *{CupSize} cup*. Please remain calm."
];

// GIF URLs for different scenarios
const GIFS = {
    LARGE_GROWTH_1: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHBmYXlqMTh3NHl1bjZkNmtmcmMyYXBvNzRueDZqYjY5cHMwYWF2aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Tu91opMJvzTPi/giphy.gif',
    LARGE_GROWTH_2: 'https://img.xbooru.com//images/623/9ef17a29e070ff7bc3990cb2685cc9cc.gif?683807',
    SMALL_GROWTH: 'https://i.redd.it/0komagl3i4kd1.gif',
    NEGATIVE_GROWTH: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHR3Y3E2a284enAxNzFlMnZ6OXV5eXZlM2tpbTcxamRzMzFmZTAwbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XFzKkgkK0ZJfKr7bNp/giphy.gif'
};

// Cup sizes based on total size
function getCupSize(totalSize) {
    if (totalSize < 0) return 'AA';
    const cupSizes = ['A', 'B', 'C', 'D', 'DD', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    const index = Math.min(Math.floor(totalSize / 5), cupSizes.length - 1);
    return cupSizes[index];
}

// Check if cup size is considered large
function isLargeCupSize(cupSize) {
    const largeCups = ['E', 'F', 'G', 'H', 'I', 'J', 'K'];
    return largeCups.includes(cupSize);
}

function getRandomMessage(growth, cupSize) {
    let message;
    let gif;

    // Choose message based on growth value
    const randomIndex = Math.floor(Math.random() * (
        growth > 0 ? positiveMessages.length :
        growth < 0 ? negativeMessages.length :
        zeroMessages.length
    ));
    
    if (growth > 0) {
        message = positiveMessages[randomIndex]
            .replace('{X}', growth)
            .replace('{CupSize}', cupSize);

        // For positive growth, check if it's large enough for special GIFs
        if (isLargeCupSize(cupSize)) {
            // Randomly choose between the two large growth GIFs
            gif = Math.random() < 0.5 ? GIFS.LARGE_GROWTH_1 : GIFS.LARGE_GROWTH_2;
        } else {
            gif = GIFS.SMALL_GROWTH;
        }
    } else if (growth < 0) {
        message = negativeMessages[randomIndex]
            .replace('{X}', Math.abs(growth))
            .replace('{CupSize}', cupSize);
        gif = GIFS.NEGATIVE_GROWTH;
    } else {
        message = zeroMessages[randomIndex];
    }
    
    return { message, gif };
}

function getRandomCooldownMessage(remainingTime) {
    const randomIndex = Math.floor(Math.random() * cooldownMessages.length);
    const message = cooldownMessages[randomIndex] + 
        `\n\n⏰ ${remainingTime} seconds remaining.`;
    return message;
}

module.exports = {
    getRandomMessage,
    getRandomCooldownMessage,
    isLargeCupSize,
    getCupSize
};
