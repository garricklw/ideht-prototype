import {ThreatBar} from "../threat_bar/ThreatBar.js";
import {IdehtServiceCalls} from "../../javascripts/IdehtServiceCalls.js";
import {ThreatBarGraph} from "../threat_bar_graph/threat_bar_graph.js";
import {DataFetchUtils} from "../../common/utils/DataFetchUtils.mjs";
import {SizingUtils} from "../../common/utils/SizingUtils.js";

export function OverviewColumn(parentNode, htmlDepends, dataSourceToUsers, created_date, indiv_counts, network_counts) {

    let that = this;

    htmlDepends.loadDepends({
        "components/threat_bar_graph/threat_bar_graph.html": "ThreatBarGraph",
    }, () => {
        let [data_source, user_infos] = Object.entries(dataSourceToUsers)[0];
        let user_info = user_infos[0];

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

        that.shadow.getElementById("user-identifier").textContent = user_info["hidden_name"];
        that.shadow.getElementById("platforms-list").textContent = data_source.toLowerCase();
        that.shadow.getElementById("handles-list").textContent = "@" + user_info["name"];

        that.shadow.getElementById("account-list-platform").textContent = data_source.toLowerCase();
        that.shadow.getElementById("account-list-handle").textContent = "@" + user_info["name"];
        that.shadow.getElementById("account-list-icon").src = user_info["image_url"];

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