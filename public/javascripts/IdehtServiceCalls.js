import {DataFetchUtils} from "../common/utils/DataFetchUtils.mjs";

// let localUrl = "https://demos.percsolutions.com/ideht";

export class IdehtServiceCalls {

    static getLocalUrl() {
        return window.location.origin + window.location.pathname;
    }

    static fetchThreatOverviewCounts(alert_id, user_id, onData) {
        let indivThreatCountUrl = "overview?alert_id=" + alert_id
            + "&user_ids=" + user_id + "&is_indiv=true";
        let networkThreatCountUrl = "overview?alert_id=" + alert_id
            + "&user_ids=" + user_id + "&is_indiv=false";

        DataFetchUtils.fetchMultiJson([indivThreatCountUrl, networkThreatCountUrl], onData)
    }

    static fetchPostListData(alert_id, user_id, dataset, pageOffset,
                             sortBy, filterThreatFac, filterIndiv, filterLocation, filterPosts, filterUserId, onData) {
        let postUrl = "posts?alert_id=" + alert_id + "&dataset=" + dataset;
        postUrl += "&skip=" + (pageOffset * 20);
        if (user_id != null) {
            postUrl += "&user_ids=" + user_id;
        }
        if (sortBy != null) {
            postUrl += "&sort_by=" + sortBy;
        }
        if (filterThreatFac != null) {
            postUrl += "&filter_threat_fac=" + filterThreatFac;
        }
        if (filterIndiv != null) {
            postUrl += "&filter_is_indiv=" + filterIndiv;
        }
        if (filterLocation != null) {
            postUrl += "&filter_location=" + filterLocation;
        }
        if (filterPosts != null) {
            postUrl += "&filter_posts=" + filterPosts.join(",");
        }
        if (filterUserId != null) {
            postUrl += "&filter_user_id=" + filterUserId;
        }

        DataFetchUtils.fetchJson(postUrl, onData);
    }

    static fetchTimelineAndNetworkData(alert_id, user_ids, dataset, onData) {
        let timeline_url = "timeline_alerts?alert_id=" + alert_id
            + "&dataset=" + dataset + "&user_ids=";
        let networkUrl = "network?dataset=" + dataset + "&root_node=" + user_ids[0]
            + "&depth=3&breadth=10";
        for (let u_id of user_ids) {
            timeline_url += u_id;
        }
        DataFetchUtils.fetchMultiJson([timeline_url, networkUrl], onData)
    }

    static fetchLocationData(alert_info, filter_indiv, onData) {
        let location_url = "locations?alert_id=" + alert_info["alert_id"] + "&user_ids=";
        let facility_url = "location_hydrate?ids=";
        for (let [data_source, users] of Object.entries(alert_info["user_infos"])) {
            for (let user of users) {
                location_url += user["id"];
            }
        }
        if (filter_indiv !== null) {
            location_url += "&filter_indiv=" + filter_indiv
        }

        for (let loc_id of alert_info["facility_ids"]) {
            facility_url += loc_id;
        }
        DataFetchUtils.fetchMultiJson([location_url, facility_url], onData)
    }

    // static fetchGalleryData(alert_id, onData) {
    //     let wordFreqUrl = baseService + "/word_freqs?alert_id=" + alert_id;
    //     let imageUrl = "/galleryImages";
    //
    //     DataFetchUtils.fetchMultiJson([wordFreqUrl, imageUrl], onData);
    // }

    static fetchWordFreqData(alert_id, onData) {
        let wordFreqUrl = "word_freqs?alert_id=" + alert_id;
        DataFetchUtils.fetchJson(wordFreqUrl, onData);
    }

    static fetchImageUrls(alert_id, post_ids, onData) {
        let imageUrl = "image_links?alert_id=" + alert_id;
        if (post_ids != null) {
            imageUrl += "&post_ids=" + post_ids.join(",");
        }
        DataFetchUtils.fetchJson(imageUrl, onData);
    }
}