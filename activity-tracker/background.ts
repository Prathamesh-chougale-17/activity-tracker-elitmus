let timeSpent = 0;
let domain: string;
let chartData: { labels: string[]; data: number[] } = { labels: [], data: [] };

const getCurrentTab: () => Promise<void> = async (): Promise<void> => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    domain = new URL(tab.url).hostname;
}

getCurrentTab().then(() => {
    console.log("Initial domain:", domain);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    if(domain){
        chartData.labels.push(domain);
        chartData.data.push(timeSpent);
    }
    timeSpent = 0;
    await getCurrentTab();
    console.log("Current domain:", domain);

    if (port && port.name === "popupPort" && port.sender) {
        port.postMessage({ timeSpent, domain });
    } else {
        console.error("Connection with popup is not established.");
    }
});

let port: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener((portFromPopup) => {
    if (portFromPopup.name === "popupPort") {
        port = portFromPopup;
        console.log("Connection with popup established.");

        port.onDisconnect.addListener(() => {
            port = null;
            console.log("Connection with popup disconnected.");
        });
    }
});

setInterval(async () => {
    if (domain) {
        timeSpent += 1;
        console.log("Time spent on current domain:", timeSpent, domain);

        if (port && port.name === "popupPort" && port.sender) {
            port.postMessage({ timeSpent, domain, chartData});
        } else {
            console.error("Connection with popup is not established.");
        }
    }
}, 1000);


