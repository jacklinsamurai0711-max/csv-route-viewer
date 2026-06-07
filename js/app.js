const map = L.map('map').setView(
    [23.6978, 120.9605],
    7
);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution:'© OpenStreetMap'
    }
).addTo(map);

const colors = [
    "#e63946",
    "#457b9d",
    "#2a9d8f",
    "#f4a261",
    "#8338ec",
    "#ff006e",
    "#3a86ff",
    "#06d6a0"
];

document
.getElementById("csvFiles")
.addEventListener("change", loadCSVFiles);

function loadCSVFiles(event){

    const files = event.target.files;

    Array.from(files).forEach((file,index)=>{

        Papa.parse(file,{
            header:true,
            dynamicTyping:true,

            complete:function(result){

                drawRoute(
                    result.data,
                    file.name,
                    colors[index % colors.length]
                );

            }
        });

    });

}

function drawRoute(data, routeName, color){

    const points = [];

    data.forEach(row=>{

        const lat =
            row.latitude ??
            row.lat;

        const lon =
            row.longitude ??
            row.lon ??
            row.lng;

        if(lat && lon){

            points.push([
                Number(lat),
                Number(lon)
            ]);

        }

    });

    if(points.length < 2){
        return;
    }

    const route = L.polyline(
        points,
        {
            color:color,
            weight:5
        }
    ).addTo(map);

    route.on("click",function(e){

        L.popup()
            .setLatLng(e.latlng)
            .setContent(routeName)
            .openOn(map);

    });

    route.bindTooltip(routeName);

    const startPoint = points[0];

    const endPoint =
        points[points.length-1];

    L.circleMarker(
        startPoint,
        {
            radius:8,
            color:"green",
            fillColor:"green",
            fillOpacity:1
        }
    )
    .bindPopup(
        `${routeName}<br><b>Start</b>`
    )
    .addTo(map);

    L.circleMarker(
        endPoint,
        {
            radius:8,
            color:"red",
            fillColor:"red",
            fillOpacity:1
        }
    )
    .bindPopup(
        `${routeName}<br><b>End</b>`
    )
    .addTo(map);

    map.fitBounds(route.getBounds());

}