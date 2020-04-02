for (let alert of alertList) {
    let alert_user = alert["user_infos"]["GAB"][0];

    let spaceDiv = document.createElement("div");
    spaceDiv.style.height = "16%";
    spaceDiv.style.width = "100%";
    overviewDiv.appendChild(spaceDiv);

    let alertValues = {
        "Proximity": Math.random(), "Violence": Math.random(),
        "Radical": Math.random(), "Installation": Math.random()
    };
    new AlertCard(spaceDiv, htmlLoader, alertValues, alert_user["name"],
        alert_user["image_url"], "No Summary Yet");

    divider(overviewDiv);
}