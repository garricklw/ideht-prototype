import {addBarsToDiv} from "../threat_bar/ThreatBar.js";
import {SizingUtils} from "../../common/utils/SizingUtils.js";
import {installationColor, proximityColor, radicalColor, violenceColor} from "../../javascripts/ideht_colors.js";
import {DomUtils} from "../../common/utils/DomUtils.js";

export function PostCard(parentNode, htmlDepends, alertPost, socialPost) {

    let that = this;

    const visibleRows = 3;
    const dsToIcon = {
        "GAB": "images/gab_icon.png",
        "REDDIT": "images/reddit_icon.png"
    };

    let widget = htmlDepends.dependencies["PostCard"];
    that.shadow = parentNode.attachShadow({mode: 'open'});
    that.shadow.append(widget.documentElement.cloneNode(true));

    let userName = that.shadow.getElementById("user-name");
    userName.textContent = socialPost["author"]["hidden_name"];

    let displayName = that.shadow.getElementById("display-name");
    displayName.textContent = "@" + socialPost["author"]["name"];

    that.shadow.getElementById("data-source").src = dsToIcon[socialPost["data_source"]];

    let postText = socialPost["text"];
    let textSegment = that.shadow.getElementById("text-segment");
    let textDiv = that.shadow.getElementById("post-text");
    let tooltipSpan = that.shadow.getElementById("post-text-tooltip");
    tooltipSpan.textContent = postText;

    SizingUtils.runOnInit(textSegment, () => {
        let truncated = SizingUtils.truncateTextToRows(postText, textDiv, textSegment.offsetWidth, visibleRows);
        if (truncated.trim() !== postText) {
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

    that.shadow.getElementById("time-stamp").textContent = createdOnDate.toLocaleString('en', {timeZone: 'UTC'}) + " UTC";

    let threatFactorList = that.shadow.getElementById("threat-factor-list");
    if (alertPost["is_proximal"] === true) {
        threatFactorList.appendChild(threatCard("Proximity", proximityColor, "white"))
    }
    if (alertPost["is_installation_relevant"] === true) {
        threatFactorList.appendChild(threatCard("Installation", installationColor))
    }
    if (alertPost["is_radical"] === true) {
        threatFactorList.appendChild(threatCard("Radical", radicalColor))
    }
    if (alertPost["is_violent"] === true) {
        threatFactorList.appendChild(threatCard("Violence", violenceColor, "white"))
    }

    function threatCard(text, color = "lightgray", textColor = "black") {
        let threatCard = document.createElement("div");
        threatCard.style.backgroundColor = color;
        threatCard.style.border = "1px solid black";
        threatCard.style.marginRight = "4px";

        let threatText = document.createElement("div");
        threatText.style.padding = "4px";
        threatText.style.fontSize = "14px";
        threatText.style.color = textColor;
        threatText.textContent = text;

        threatCard.appendChild(threatText);
        return threatCard;
    }
}

PostCard.appendPosts = function(htmlLoader, hydrPosts, postDiv) {
    for (let [a_post, s_post] of hydrPosts) {
        let spaceDiv = document.createElement("div");
        spaceDiv.style.height = "147px";
        spaceDiv.style.width = "96%";
        spaceDiv.style.margin = "8px auto";
        spaceDiv.style.border = "1px solid lightgray";
        postDiv.appendChild(spaceDiv);

        new PostCard(spaceDiv, htmlLoader, a_post, s_post);
    }
};

PostCard.refreshPostList = function(htmlLoader, postListDiv, pageThroughPostsFunc) {
    postListDiv.innerHTML = "";
    postListDiv = DomUtils.refreshElement(postListDiv);

    let visiblePostPages = 0;
    pageThroughPostsFunc(0, (hydrPosts) => {
        PostCard.appendPosts(htmlLoader, hydrPosts, postListDiv);
        visiblePostPages += 1;
    });
    postListDiv.addEventListener("scroll", (_) => {
        if ((postListDiv.scrollTop + postListDiv.offsetHeight) >= postListDiv.scrollHeight) {
            pageThroughPostsFunc(visiblePostPages, (hydrPosts) => {
                PostCard.appendPosts(htmlLoader, hydrPosts, postListDiv);
                visiblePostPages += 1;
            });
        }
    });

    return postListDiv;
};

// export function appendPosts(htmlLoader, hydrPosts, postDiv) {
//     for (let [a_post, s_post] of hydrPosts) {
//         let spaceDiv = document.createElement("div");
//         spaceDiv.style.height = "147px";
//         spaceDiv.style.width = "96%";
//         spaceDiv.style.margin = "8px auto";
//         spaceDiv.style.border = "1px solid lightgray";
//         postDiv.appendChild(spaceDiv);
//
//         new PostCard(spaceDiv, htmlLoader, a_post, s_post);
//     }
// }