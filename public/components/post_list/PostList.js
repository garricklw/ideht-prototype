// import * as d3 from "/public/javascripts/d3";


function PostList(parentNode, htmlDepends) {

    let that = this;

    let widget = htmlDepends.dependencies["PostList"];
    that.shadow = parentNode.attachShadow({mode: 'open'});
    that.shadow.append(widget.documentElement.cloneNode(true));

    this.displayPosts = function (postObjects) {

    };

    return {
        displayPosts: that.displayPosts
    }
}