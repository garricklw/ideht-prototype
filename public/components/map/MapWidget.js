export let mapInteractionCallback = {
    onLocationSelected: function (locationId) {
    }
};

/**
 *  Must import:
 *  <script src="https://cesium.com/downloads/cesiumjs/releases/1.66/Build/Cesium/Cesium.js"></script>
 <link href="https://cesium.com/downloads/cesiumjs/releases/1.66/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
 *  wherever this is used. There's some way to do this dynamically, but why bother?
 *
 * @param parentNodeId
 * @param focusBB [west, south, east, north]
 * @param locationObjs location -> alert_post_id
 * @param facilityObjs list[location]
 * @param userInteractionCallback
 * @constructor
 */
export function MapWidget(parentNodeId, focusBB, locationObjs, facilityObjs, userInteractionCallback = mapInteractionCallback) {

    let that = this;
    let nameOverlayElem = nameOverlay();
    let highlightBillboard;

    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZGM5YTk4MC04NDA5LTQ5ZDctOTU0NC04NzE0YTIzMjdhMTciLCJpZCI6MjI4MjgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODIxNDYxNzh9.7gErHeK84h8ZKvBsIOvZIXX2_vx4dbNO74gTGDTB6tE';
    let osm = new Cesium.OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/',
        // maximumLevel: 6,
        credit: 'MapQuest, Open Street Map and contributors, CC-BY-SA'
    });

    that.widget = new Cesium.Viewer(parentNodeId, {
        sceneMode: Cesium.SceneMode.SCENE2D,
        imageryProvider: osm,
        // imageryProvider: new Cesium.IonImageryProvider({assetId: 4}),
        animation: false,
        baseLayerPicker: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        timeline: false
    });

    that.widget.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(focusBB[0], focusBB[1], focusBB[2], focusBB[3])
    });

    function nameOverlay() {
        // HTML overlay for showing feature name on mouseover
        let nameOverlay = document.createElement('div');
        nameOverlay.style.color = 'white';
        nameOverlay.style.display = 'none';
        nameOverlay.style.position = 'relative';
        nameOverlay.style['pointer-events'] = 'none';
        nameOverlay.style.padding = '4px';
        nameOverlay.style.backgroundColor = 'black';
        return nameOverlay;
    }

    function registerMouseEvents(widget, nameOverlay) {
        widget.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
            // Pick a new feature
            let pickedFeature = widget.scene.pick(movement.endPosition);
            if (!pickedFeature) {
                nameOverlay.style.display = 'none';
                return;
            }

            // A feature was picked, so show it's overlay content
            nameOverlay.style.display = 'inline';
            nameOverlay.style.bottom = widget.canvas.clientHeight - movement.endPosition.y + 'px';
            nameOverlay.style.left = movement.endPosition.x + 15 + 'px';

            let hovered_object = pickedFeature.id;
            nameOverlay.textContent = hovered_object.name;

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        widget.screenSpaceEventHandler.setInputAction(function onMouseClick(click) {
            // Pick a new feature
            let pickedFeature = widget.scene.pick(click.position);
            if (!pickedFeature) {
                highlightBillboard.billboard.show = false;
                userInteractionCallback.onLocationSelected(null);
                return;
            }

            let clicked_object = pickedFeature.id;
            // highlightBillboard["position"] = Cesium.Cartesian3.fromDegrees(clicked_object["lon"], clicked_object["lat"]);
            highlightBillboard["position"] = clicked_object["position"];
            highlightBillboard.billboard.show = true;
            userInteractionCallback.onLocationSelected(clicked_object.locId);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    that.render2dLocations = function (locations, facilities) {
        that.widget.entities.removeAll();

        highlightBillboard = that.widget.entities.add({
            name: "highlight_widget",
            position: Cesium.Cartesian3.fromDegrees(-118.4, 34.1),
            billboard: {
                show: false,
                image: "images/icons8-filled-circle-96.png",
                scale: 0.5
            }
        });
        let pinBuilder = new Cesium.PinBuilder();
        for (let location of locations) {
            console.log("lon: " + location["lon"]);
            console.log("lat: " + location["lat"]);
            that.widget.entities.add({
                name: location["common_names"][0],
                locId: location["id"],
                lat: location["lat"],
                lon: location["lon"],
                position: Cesium.Cartesian3.fromDegrees(location["lon"], location["lat"]),
                billboard: {
                    image: "images/icons8-marker-96.png",
                    scale: 0.4,
                    color: Cesium.Color.fromBytes(0, 128, 0)
                    // image: pinBuilder.fromColor(Cesium.Color.fromBytes(0, 128, 0), 48).toDataURL()
                }
            });
        }
        for (let facility of facilities) {
            that.widget.entities.add({
                name: facility["common_names"][0],
                locId: facility["id"],
                position: Cesium.Cartesian3.fromDegrees(facility["lon"], facility["lat"]),
                billboard: {
                    image: "images/icons8-organization-24.png"
                }
            });
        }
    };

    that.widget.container.appendChild(nameOverlayElem);
    registerMouseEvents(that.widget, nameOverlayElem);
    that.render2dLocations(locationObjs, facilityObjs);

    return ({
        render2dLocations: that.render2dLocations,
        clearHighlight: () => highlightBillboard.billboard.show = false
    });
}