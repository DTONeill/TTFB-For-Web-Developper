class LabelUpdater {
    constructor() {
        var that = this;
        this.thresholdAchievedColor = "#FF0000";
        this.thresholdNotAchievedColor = "#228B22";
        this.noThresholdColor = "#1E90FF";
        
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                that.displayTime(sender.tab, request.timeFormatted, request.time);
            }
        );
    }

    displayTime(tab, timeFormatted, time) {
        var currentHostConfig = this.getHostConfigurationsForTab(tab);

        var badgeColor = this.getBadgeDisplayColor(currentHostConfig, time);
        if (badgeColor == this.thresholdAchievedColor) {
            this.displayThresholdAlert(time, currentHostConfig.ttfb);
        }

        chrome.browserAction.setBadgeText({ text: timeFormatted, tabId: tab.id });
        chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor, tabId: tab.id });
    }

    getHostConfigurationsForTab(tab) {
        var savedHosts = localStorage["hosts"];
        if (savedHosts) {
            var hosts = JSON.parse(savedHosts);

            var tabUrl = tab.url;
            for (var i in hosts) {
                var hostConfig = hosts[i];
                if (tabUrl.startsWith(hostConfig.host)) {
                    return hostConfig;
                }
            }
        }

        return null;
    }

    displayThresholdAlert(time, threshold) {
        var difference = ((threshold - time) + "").replace("-", "");
        
        chrome.notifications.create("threshold-reached", {
            title: chrome.i18n.getMessage("threshold_reached") + " (" + threshold +"ms)",
            message: time + "ms (" + difference + "ms " + chrome.i18n.getMessage("slower") + ")",
            type: "basic",
            iconUrl: "/images/icon_128.png"
        });
    }

    getBadgeDisplayColor(currentHostConfig, time) {
        var color;
        if (!currentHostConfig) {
            color = this.noThresholdColor;
        } else if (time < currentHostConfig.ttfb) {
            color = this.thresholdNotAchievedColor;
        } else {
            color = this.thresholdAchievedColor;
        }

        return color;
    }
}

new LabelUpdater();