const BACKROUND_LAYER = new ol.layer.Tile({
    source: new ol.source.OSM()
});

const VIEW = new ol.View({
    center: ol.proj.fromLonLat([7.4474, 46.9480]),
    zoom: 12
})

const STYLE = function(feature) {
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ 
                color: 'white' 
            }),
            stroke: new ol.style.Stroke({
                color: [0, 0, 0],
                width: 2
            })
        }),
        text: new ol.style.Text({
            text: feature.get('name'),
            font: '12px Calibri,sans-serif',
            fill: new ol.style.Fill({
                color: 'black'
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 2
            }),
            offsetX: 0,
            offsetY: -15,
            textAlign: 'center',
            textBaseline: 'middle'
        })
    });
};

const SELECTED_STYLE = function(feature) {
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 9,
            fill: new ol.style.Fill({ 
                color: 'red' 
            }),
            stroke: new ol.style.Stroke({
                color: [255, 0, 0],
                width: 2
            })
        }),
        text: new ol.style.Text({
            text: feature.get('name'),
            font: 'bold 14px Calibri,sans-serif',
            fill: new ol.style.Fill({
                color: 'red'
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 2
            }),
            offsetX: 0,
            offsetY: -15,
            textAlign: 'center',
            textBaseline: 'middle'
        })
    });
}

const KML_FORMAT = new ol.format.KML({
    defaultDataProjection: 'EPSG:4326',
    extractStyles: false,
});

const KML_URL = 'https://www.google.com/maps/d/kml?forcekml=1&mid=1REnaBNvSwvU5zCNDEfFJT7n1qDuL3CM'

const VECTOR_SOURCE = new ol.source.Vector({
    url: KML_URL,
    format: KML_FORMAT,
});

const VECTOR_LAYER = new ol.layer.Vector({
    source: VECTOR_SOURCE,
    style : STYLE
});


const MAP = new ol.Map({
    target: 'map',
    layers: [BACKROUND_LAYER, VECTOR_LAYER],
    view: VIEW
});

let selectedFeature = null;

const SELECT_INTERACTION = new ol.interaction.Select({
    style: SELECTED_STYLE,
    layers: [VECTOR_LAYER] // Add your vector layer here
});

MAP.addInteraction(SELECT_INTERACTION);

const switchHoverAndSelect = function(shoePart) {
    document.querySelectorAll('.shoe_part').forEach(part => {
        part.classList.remove('hovered');
        part.classList.remove('colored');
    });

    switch (shoePart) {
        case 'chewing_gum':
            document.getElementById('chewing_gum').classList.add('hovered');
            break;
        case 'converse':
            document.getElementById('converse').classList.add('hovered');
            document.getElementById('star').classList.add('hovered');
            document.getElementById('lacet').classList.add('colored');
            document.getElementById('trou_lacet').classList.add('colored');
            break;
        case 'lacet':
            document.getElementById('lacet').classList.add('hovered');
            document.getElementById('trou_lacet').classList.add('hovered');
            break;
        case 'trou_lacet':
            document.getElementById('trou_lacet').classList.add('hovered');
            break;
        case 'sole':
            document.getElementById('sole').classList.add('hovered');
            break;
        default:
            break;
    }
};

MAP.on('pointermove', function (event) {
    if (selectedFeature) {
        return;
    }

    const features = MAP.getFeaturesAtPixel(event.pixel);
    
    if (features && features.length > 0) {
        const feature = features[0];
        const shoePart = feature.get("description");
        switchHoverAndSelect(shoePart);
    } else {
        switchHoverAndSelect(null);
    }
});

MAP.on('click', function (event) {
    const features = MAP.getFeaturesAtPixel(event.pixel);
    if (features && features.length > 0) {
        selectedFeature = features[0];
        const shoePart = selectedFeature.get("description");
        switchHoverAndSelect(shoePart);
    } else {
        selectedFeature = null;
        switchHoverAndSelect(null);
    }
});


document.getElementById('open-map').addEventListener('click', function() {
    window.open('https://www.google.com/maps/d/edit?mid=1REnaBNvSwvU5zCNDEfFJT7n1qDuL3CM&usp=sharing', '_blank');
});

