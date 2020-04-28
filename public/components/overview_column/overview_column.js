import {ThreatBar} from "../threat_bar/ThreatBar.js";
import {IdehtServiceCalls} from "../../javascripts/IdehtServiceCalls.js";
import {ThreatBarGraph} from "../threat_bar_graph/threat_bar_graph.js";
import {DataFetchUtils} from "../../common/utils/DataFetchUtils.js";
import {SizingUtils} from "../../common/utils/SizingUtils.js";

export function OverviewColumn(parentNode, htmlDepends, user_info, created_date, indiv_counts, network_counts) {

    let that = this;

    htmlDepends.loadDepends({
        "components/threat_bar_graph/threat_bar_graph.html": "ThreatBarGraph",
    }, () => {
        that.shadow = htmlDepends.attachShadow("OverviewColumn", parentNode);

        that.shadow.getElementById("user-name").textContent = "@" + user_info["name"];

        let alarmDate = new Date(Date.parse(created_date));
        alarmDate = alarmDate.toLocaleString('en', {timeZone: 'UTC'});

        for (let alertDate of that.shadow.querySelectorAll(".alert-date")) {
            alertDate.textContent = alarmDate;
        }
        let barGraphDiv = that.shadow.getElementById("bar-graph-div");

        SizingUtils.runOnInit(barGraphDiv, () => {
            new ThreatBarGraph(barGraphDiv, htmlDepends, indiv_counts, network_counts);
        });

        let overlapPane = that.shadow.getElementById("overlap-content");

        let seeDetails = that.shadow.getElementById("see-profile-details");
        let profileOverview = that.shadow.getElementById("profile-overview");
        let accountsList = that.shadow.getElementById("accounts-list");
        seeDetails.addEventListener("mouseup", () => {
            let profileOverlap = document.createElement("div");
            profileOverlap.appendChild(profileOverview.cloneNode(true));
            let accountsListClone = accountsList.cloneNode(true);
            accountsListClone.style.display = "block";
            profileOverlap.appendChild(accountsListClone);
            showOverlapPane(profileOverlap, "#return-from-profiles");
        });

        let seeRelated = that.shadow.getElementById("see-related-alerts");
        let alertsOverview = that.shadow.getElementById("alerts-overview");
        seeRelated.addEventListener("mouseup", () => {
            showOverlapPane(alertsOverview.cloneNode(true), "#return-from-alerts");
        });


        function showOverlapPane(overlapWith, returnButtonId) {
            overlapPane.innerHTML = '';
            overlapPane.style.display = "block";

            overlapWith.style.display = "block";
            overlapPane.appendChild(overlapWith);

            overlapWith.querySelector(returnButtonId).addEventListener("mouseup", () => {
                overlapPane.style.display = "none"
            })
        }
    });
}