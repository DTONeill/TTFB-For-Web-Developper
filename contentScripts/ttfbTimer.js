class TtfbTimer {
    constructor() {
        window.addEventListener("load", this.sendMeasure);
    }

    sendMeasure() {
        setTimeout(function () {
            var timing = performance.timing;
            var timeElapsed = timing.responseStart - timing.fetchStart;

            if (timing.loadEventEnd > 0 && timeElapsed >0) {
                var ttfbString = String((timeElapsed / 1000).toPrecision(3)).substring(0, 4);

                chrome.runtime.sendMessage({
                    timeFormatted: ttfbString,
                    time: timeElapsed
                });
            }
        }, 0);
    }
}

new TtfbTimer();