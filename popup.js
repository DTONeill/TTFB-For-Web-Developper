class Popup {
    constructor() {
        var that = this;
        this.entryHtml =
            '<div data-entry class="row">' +
                '<input type="text" class="col-7" id="hostInput" placeholder="Url ex: https:www.google.com">' +
                '<input type="number" class="col-3" id="ttfbInput" placeholder="ttfb (ms)">' +
                '<input data-remove type="button" class="col-2 btn btn-warning" value="' + chrome.i18n.getMessage("remove") +'"></input>' +
            '</div>';

        this.$entriesContainer = $(".entries_container");
        this.$howTo = $("[data-how-to]");
        this.$howToPart1 = this.$howTo.find("[data-how-to-part1]");
        this.$howToPart2 = this.$howTo.find("[data-how-to-part2]");
        this.$addButton = $('[data-add-button]');
        this.$saveButton = $('[data-save-button]');

        this.$addButton.click(function () { that.addLine(); });
        this.$saveButton.click(function (event) {
            event.preventDefault();
            that.saveAndClose();
        });

        this.putLocalizedTexts();
        this.loadSavedData();
    }

    saveAndClose() {
        this.saveAll();
        $("[data-content]").fadeOut("fast", function () {
            window.close();
        });
    }

    putLocalizedTexts() {
        this.$addButton.text(chrome.i18n.getMessage("add"));
        this.$saveButton.text(chrome.i18n.getMessage("save"));
        this.$howToPart1.text(chrome.i18n.getMessage("how_to_part1"));
        this.$howToPart2.text(chrome.i18n.getMessage("how_to_part2"));
    }

    addLine() {
        var that = this;
        this.hideHowTo();
        var newElement = $(this.entryHtml);
        newElement.hide();
        newElement.find("[data-remove]").click(function () {
            newElement.hide("fast", function () {
                newElement.remove();
                if (that.getEntriesDisplayed().toArray().length == 0) {
                    that.displayHowTo();
                }
            });
        });
        this.$entriesContainer.append(newElement);
        newElement.show("fast");

        return newElement;
    }

    loadSavedData() {
        this.$entriesContainer.empty();
        var hosts = localStorage["hosts"];
        console.log("loadSavedData", hosts);
        if (hosts && hosts != "[]") {
            this.hideHowTo();
            var entries = JSON.parse(hosts);
            for (var i in entries) {
                var entryElement = entries[i];
                var $line = this.addLine();
                $line.find("#hostInput").val(entryElement.host);
                $line.find("#ttfbInput").val(entryElement.ttfb);
            }
        } else {
            this.displayHowTo();
        }
    }

    displayHowTo() {
        this.$howTo.show();
    }

    hideHowTo() {
        this.$howTo.hide();
    }

    saveAll() {
        var stored = [];

        var entries = this.$entriesContainer.find("[data-entry]");
        entries.each(function () {
            var $elem = $(this);
            var host = $elem.find("#hostInput").val();
            var ttfb = $elem.find("#ttfbInput").val();

            if (host && ttfb) {
                stored.push({
                    host: host,
                    ttfb: ttfb
                });
            }
        });
        localStorage["hosts"] = JSON.stringify(stored);
    }

    getEntriesDisplayed() {
        return this.$entriesContainer.find("[data-entry]");
    }
}

window.addEventListener("load", function () { var popup = new Popup(); });

