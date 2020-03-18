import {addBarsToDiv} from "../threat_bar/ThreatBar.js";
import {SizingUtils} from "../../javascripts/SizingUtils.js";

export function PostCard(parentNode, htmlDepends, alarmValues, socialPost) {

    let that = this;

    const barColors = ["#6f97e1", "#e18548", "#e156a3", "#81b5e0", "#88ffff"];
    const visibleRows = 4;
    const dsToIcon = {
        "GAB": "images/gab_icon.png",
        "REDDIT": "images/reddit_icon.png"
    };

    let threatBars = {};

    let widget = htmlDepends.dependencies["PostCard"];
    that.shadow = parentNode.attachShadow({mode: 'open'});
    that.shadow.append(widget.documentElement.cloneNode(true));

    let threatBarList = that.shadow.getElementById("threat-factors-col");
    addBarsToDiv(htmlDepends, threatBarList, alarmValues, barColors);

    let userName = that.shadow.getElementById("user-name");
    userName.textContent = "@" + socialPost["author"]["name"];

    that.shadow.getElementById("data-source").src = dsToIcon[socialPost["data_source"]];

    let postText = socialPost["text"];
    let textSegment = that.shadow.getElementById("text-segment");
    let textDiv = that.shadow.getElementById("post-text");
    SizingUtils.runOnInit(textSegment, () => {
        let textRowWidth = textSegment.offsetWidth;
        let desiredWidth = visibleRows * textRowWidth;
        let truncated = SizingUtils.truncateTextToFit(postText, textDiv, desiredWidth);
        if (truncated !== postText) {
            truncated += "... ";
        }
        textDiv.textContent = truncated;
    });

    let imageUrl = socialPost["author"]["image_url"];
    if (imageUrl != null && imageUrl !== "") {
        let accountImage = that.shadow.getElementById("account-image");

        that.shadow.getElementById("account-image-icon").remove();
        accountImage.onerror = () => {
            accountImage.src = 'images/gab_icon.png';
        };
        accountImage.src = imageUrl;
    }

    let createdOn = socialPost["created_on"];

    let createdOnDate = new Date(0);
    createdOnDate.setTime(createdOn * 1000);

    that.shadow.getElementById("created-on").textContent = dateFormat(createdOnDate);

    function dateFormat(datetime) {
        let now = new Date();
        let diff = now.getTime() - datetime.getTime();
        let dateString = createdOnDate.toDateString();

        let minutesSince = Math.floor(diff / 1000 / 60);
        if (minutesSince < 60) {
            return minutesSince + "m"
        }

        let hoursSince = Math.floor(minutesSince / 60);
        if (hoursSince < 24) {
            return hoursSince + "h"
        }

        let daysSince = Math.floor(hoursSince / 24);
        if (daysSince < 365) {
            return dateString.substring(4, dateString.length - 5);
        }

        return dateString.substring(4);
    }
}