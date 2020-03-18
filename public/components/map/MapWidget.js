/**
 *  Must import:
 *  <script src="https://cesium.com/downloads/cesiumjs/releases/1.66/Build/Cesium/Cesium.js"></script>
 <link href="https://cesium.com/downloads/cesiumjs/releases/1.66/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
 *  wherever this is used. There's some way to do this dynamically, but why bother?
 *
 * @param parentNodeId
 * @param focusBB [west, south, east, north]
 * @param locationObjs
 * @constructor
 */
export function MapWidget(parentNodeId, focusBB, locationObjs, facilityObjs) {

    let that = this;
    let nameOverlayElem = nameOverlay();

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
        selectionIndicator: false,
        navigationHelpButton: false,
        timeline: false
    });

    that.widget.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(focusBB[0], focusBB[1], focusBB[2], focusBB[3])
    });

    that.widget.container.appendChild(nameOverlayElem);
    registerHoverEvent(that.widget, nameOverlayElem);

    render2dLocations(locationObjs, facilityObjs);

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

    function registerHoverEvent(widget, nameOverlay) {
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
                return;
            }

            let clicked_object = pickedFeature.id;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    function render2dLocations(locations, facilities) {
        let pinBuilder = new Cesium.PinBuilder();
        for (let location of locations) {
            that.widget.entities.add({
                name: location["search_str"],
                position: Cesium.Cartesian3.fromDegrees(location["lon"], location["lat"]),
                billboard: {
                    image: pinBuilder.fromColor(Cesium.Color.GREY, 48).toDataURL()
                }
            });
        }
        for (let facility of facilities) {
            that.widget.entities.add({
                name: facility["search_str"],
                position: Cesium.Cartesian3.fromDegrees(facility["lon"], facility["lat"]),
                billboard: {
                    image: "images/icons8-organization-24.png"
                }
            });
        }
    }
}