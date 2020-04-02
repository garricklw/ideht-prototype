export class IdehtServiceCalls {
    static fetchAndParse(url, onData) {
        IdehtServiceCalls.fetchAndParseMulti([url], listData => listData.length > 0 ? onData(listData[0]) : onData());
    }

    static fetchAndParseMulti(urls, onData) {
        let promises = urls.map((url, index) => {
            return fetch(url)
                .then(resp => resp.text())
                .then((jsonstr) => {
                    if (jsonstr.length === 0) {
                        return;
                    }
                    return JSON.parse(jsonstr);
                })
        });
        Promise.all(promises).then(results => onData(results))
    }
}