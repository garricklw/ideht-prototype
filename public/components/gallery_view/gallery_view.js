import {DataFetchUtils} from "../../common/utils/DataFetchUtils.js";
import {WordCloud} from "../../common/widgets/word_cloud/WordCloud.js";

export function GalleryView(parentNode, htmlDepends) {

    const imagesPerPage = 20;

    let that = this;

    that.shadow = htmlDepends.attachShadow("GalleryView", parentNode);

    let wordCloud = that.shadow.getElementById("word-cloud");
    let imageGallery = that.shadow.getElementById("image-gallery");
    let prevPage = that.shadow.getElementById("prev-page");
    let nextPage = that.shadow.getElementById("next-page");

    let hasPrev = false;
    let hasNext = false;
    let allImages = [];
    let pageNum = 0;

    prevPage.addEventListener("mouseup", () => {
        if (!hasPrev) {
            return;
        }
        showImagePage(allImages, --pageNum);
    });

    nextPage.addEventListener("mouseup", () => {
        if (!hasNext) {
            return;
        }
        showImagePage(allImages, ++pageNum);
    });

    that.displayImageGallery = function (images, resetPages) {
        if (resetPages) {
            allImages = images;
            pageNum = 0;
        }

        showImagePage(images, pageNum)
    };

    function showImagePage(images, pageNum) {
        imageGallery.innerHTML = "";
        let fullWidth = imageGallery.offsetWidth;
        let columns = [];

        for (let i = 0; i < 3; i++) {
            let column = document.createElement("div");
            column.style.width = "32%";
            column.style.marginLeft = "1%";
            columns.push(column);
            imageGallery.appendChild(column);
        }

        let colCount = 0;
        let firstImg = imagesPerPage * pageNum;
        for (let imageUrl of images.slice(firstImg, firstImg + imagesPerPage)) {
            let img = document.createElement("img");
            img.src = imageUrl;
            img.style.marginTop = "7px";
            img.onload = () => {
                img.style.width = "100%";
                columns[colCount++ % 3].appendChild(img);
            }
        }

        hasPrev = pageNum !== 0;
        hasNext = images.length > firstImg + imagesPerPage;
        updateButtonFont(prevPage, hasPrev);
        updateButtonFont(nextPage, hasNext);
    }

    function updateButtonFont(button, enabled) {
        if (enabled) {
            button.style.color = "black"
        } else {
            button.style.color = "lightgrey"
        }
    }

    return ({
        displayWordCloud: (wordFreqs) => {
            wordCloud.innerHTML = "";
            new WordCloud(wordCloud, wordFreqs)
        },
        displayImageGallery: that.displayImageGallery
    })
}