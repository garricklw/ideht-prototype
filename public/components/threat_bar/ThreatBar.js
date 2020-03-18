import {SizingUtils} from "../../javascripts/SizingUtils.js";

export function ThreatBar(parentNode, htmlDepends, color, bgText, percentage = 0.5) {

    let that = this;

    let widget = htmlDepends.dependencies["ThreatBar"];
    that.shadow = parentNode.attachShadow({mode: 'open'});
    that.shadow.append(widget.documentElement.cloneNode(true));

    this.setColor = function (color) {
        that.shadow.getElementById("bar-bg").style.backgroundColor = color + "dd";
    };
    this.setPct = function (percentage) {
        that.shadow.getElementById("bar-bg").style.width = parentNode.offsetWidth * percentage + "";
    };

    SizingUtils.runOnInit(parentNode, () => {
        let label = that.shadow.getElementById("bar-label");
        label.style.fontSize = (parentNode.offsetHeight * 0.75).toString();
        label.textContent = bgText;

        that.setColor(color);
        that.setPct(percentage);
    });

    return {
        setColor: that.setColor
    }
}

export function addBarsToDiv(htmlDepends, threatBarList, alarmValues, barColors, barClass = "threatBar") {
    let i = 0;
    for (let alarmName of Object.keys(alarmValues)) {
        let spaceDiv = document.createElement("div");
        spaceDiv.classList.add(barClass, "centerAlign");
        threatBarList.appendChild(spaceDiv);

        new ThreatBar(spaceDiv, htmlDepends, barColors[i++], alarmName, alarmValues[alarmName]);
    }
}