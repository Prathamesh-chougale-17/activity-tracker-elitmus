// background.ts

let currentDomain: string | null = null;
let timeSpent: { [key: string]: number } = {};
let intervalId: ReturnType<typeof setInterval> | null = null;

// Function to get the domain of the current active tab
const getCurrentDomain = async (): Promise<string | null> => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    return new URL(tab.url).hostname;
  }
  return null;
};

// Function to handle domain change
const handleDomainChange = async () => {
  const newDomain = await getCurrentDomain();
  if (newDomain !== currentDomain) {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }

    currentDomain = newDomain;

    if (currentDomain) {
      if (!timeSpent[currentDomain]) {
        timeSpent[currentDomain] = 0;
      }

      intervalId = setInterval(() => {
        timeSpent[currentDomain] += 1;
        chrome.runtime.sendMessage({
          domain: currentDomain,
          timeSpent: timeSpent[currentDomain],
        });
      }, 1000);
    }
  }
};

// Listener for tab activation
chrome.tabs.onActivated.addListener(handleDomainChange);

// Listener for tab URL update
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    handleDomainChange();
  }
});

// Listener for window focus change
chrome.windows.onFocusChanged.addListener(handleDomainChange);

// Initialize the tracking
handleDomainChange();
