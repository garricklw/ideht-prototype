import {ThreatBar} from "../threat_bar/ThreatBar.js";

export function AlertCard(parentNode, htmlDepends, alarmValues, name, imageUrl, summaryText) {

    let that = this;

    const barColors = ["#e1524d", "#e1c14d", "#e19c4d", "#9289e0", "#88ffff"];
    let threatBars = {};

    let widget = htmlDepends.dependencies["AlertCard"];
    that.shadow = parentNode.attachShadow({mode: 'open'});
    that.shadow.append(widget.documentElement.cloneNode(true));

    if (imageUrl != null && imageUrl !== "") {
        that.shadow.getElementById("account-image-icon").remove();
        that.shadow.getElementById("account-image").src = imageUrl;
    }

    this.updateAlarmValues = function(alarmValues) {
        let threatBarList = that.shadow.getElementById("threat-factors-col");
        let i=0;
        for (let alarmName of Object.keys(alarmValues)) {
            let spaceDiv = document.createElement("div");
            spaceDiv.classList.add("threatBar", "centerAlign");
            threatBarList.appendChild(spaceDiv);

            new ThreatBar(spaceDiv, htmlDepends, barColors[i++], alarmName, alarmValues[alarmName]);
        }
    };

    this.updateAlarmValues(alarmValues);
    this.shadow.getElementById("user-name").textContent = name;
    this.shadow.getElementById("alert-summary").textContent = summaryText;
}