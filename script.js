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


const VECTOR_SOURCE = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
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

const selectInteraction = new ol.interaction.Select({
    style: SELECTED_STYLE,
    layers: [VECTOR_LAYER] // Add your vector layer here
});

MAP.addInteraction(selectInteraction);

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
            document.getElementById('circle').classList.add('hovered');
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
        const shoePart = feature.get("shoe_part");
        switchHoverAndSelect(shoePart);
    } else {
        switchHoverAndSelect(null);
    }
});

MAP.on('click', function (event) {
    const features = MAP.getFeaturesAtPixel(event.pixel);
    if (features && features.length > 0) {
        selectedFeature = features[0];
        const shoePart = selectedFeature.get("shoe_part");
        switchHoverAndSelect(shoePart);
    } else {
        selectedFeature = null;
        switchHoverAndSelect(null);
    }
});


fetch('data.geojson')
    .then(response => response.json())
    .then(data => {
        const features = new ol.format.GeoJSON().readFeatures(data, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        VECTOR_SOURCE.addFeatures(features);
    })
    .catch(error => console.error('Error loading GeoJSON file:', error));


