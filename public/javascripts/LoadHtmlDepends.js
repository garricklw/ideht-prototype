// Class for loading all of the html dependencies for a page at once, so we can synchronously
// instantiate the widgets without re-fetching the .html.
// I can't believe there isn't currently a way that I could find to synchronously load a .html file into a .js file

class LoadHtmlDepends {

    // Map of dependency name -> html code for dependency
    dependencies = {};

    // Map of local dependency URL -> dependency
    // don't re-use dependency names, duh.
    constructor(dependencies, onLoad) {
        let promises = Object.keys(dependencies).map(depUrl => fetch(depUrl)
            .then(resp => resp.text())
            .then((html) => {
                let cleanHtml = html.replace(/>\s+</g, "><");
                this.dependencies[dependencies[depUrl]] = new DOMParser().parseFromString(cleanHtml, "text/html")
            })
        );
        Promise.all(promises).then((_) => onLoad(this))
    }
}