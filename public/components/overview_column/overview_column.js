import {ThreatBar} from "../threat_bar/ThreatBar.js";
import {IdehtServiceCalls} from "../../javascripts/IdehtServiceCalls.js";
import {ThreatBarGraph} from "../threat_bar_graph/threat_bar_graph.js";

export function OverviewColumn(parentNode, htmlDepends, alert_info) {

    let that = this;
    const baseService = "http://localhost:5000/";

    let user_info = alert_info["user_infos"]["GAB"][0];

    function fetchThreatOverviewCounts(onData) {
        let indivThreatCountUrl = baseService + "overview?alert_id=" + alert_info["alert_id"]
            + "&user_ids=" + user_info["id"] + "&is_indiv=true";
        let networkThreatCountUrl = baseService + "overview?alert_id=" + alert_info["alert_id"]
            + "&user_ids=" + user_info["id"] + "&is_indiv=false";

        IdehtServiceCalls.fetchAndParseMulti([indivThreatCountUrl, networkThreatCountUrl], onData)
    }

    htmlDepends.loadDepends({
        "components/threat_bar_graph/threat_bar_graph.html": "ThreatBarGraph",
    }, () => {
        let widget = htmlDepends.dependencies["OverviewColumn"];
        that.shadow = parentNode.attachShadow({mode: 'open'});
        that.shadow.append(widget.documentElement.cloneNode(true));

        // let imageUrl = user_info["image_url"];
        // if (imageUrl != null && imageUrl !== "") {
        //     that.shadow.getElementById("account-image-icon").remove();
        //     that.shadow.getElementById("account-image").src = imageUrl;
        // }
        that.shadow.getElementById("user-name").textContent = "@" + user_info["name"];

        let alarmDate = new Date(Date.parse(alert_info["creation_date"]));
        alarmDate = alarmDate.toLocaleString('en', {timeZone: 'UTC'});

        that.shadow.getElementById("alert-date").textContent = alarmDate;

        refreshThreatBars(true);
        let countSource = that.shadow.getElementById("count-source");
        countSource.addEventListener("change", () => {
            let isIndiv = countSource.value === "individual";
            refreshThreatBars(isIndiv);
        });
    });

    function refreshThreatBars() {
        fetchThreatOverviewCounts(([indiv_counts, network_counts]) => {
            new ThreatBarGraph(that.shadow.getElementById("bar-graph-div"), htmlDepends, indiv_counts, network_counts)
        });
    }
}