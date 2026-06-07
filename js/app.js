console.log("APP LOADED");
alert("APP LOADED");
function dmsToDecimal(dmsString){

    const parts = dmsString
        .trim()
        .split(":");

    const deg = Number(parts[0]);
    const min = Number(parts[1]);
    const sec = Number(parts[2]);

    return deg + min / 60 + sec / 3600;
}
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
            header:false,
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

    data.forEach(row => {

        if(row.length < 3){
            return;
        }

        const latDMS = row[1];
        const lonDMS = row[2];

        if(!latDMS || !lonDMS){
            return;
        }

        const lat = dmsToDecimal(latDMS);
        const lon = dmsToDecimal(lonDMS);

        points.push([lat, lon]);

    });

    if(points.length < 2){
        return;
    }

    const route = L.polyline(
        points,
        {
            color: color,
            weight: 5
        }
    ).addTo(map);

points.forEach((point,index)=>{

    L.circleMarker(
        point,
        {
            radius:3,
            color:color,
            fillColor:color,
            fillOpacity:1
        }
    )
    .bindTooltip(
        `${index+1}`
    )
    .addTo(map);

});
    
    route.bindTooltip(routeName);

    route.on("click", function(e){

        L.popup()
            .setLatLng(e.latlng)
            .setContent(routeName)
            .openOn(map);

    });

    const startPoint = points[0];
    const endPoint = points[points.length - 1];

    L.circleMarker(
        startPoint,
        {
            radius:8,
            color:"green",
            fillColor:"green",
            fillOpacity:1
        }
    )
    .bindPopup(routeName + "<br>Start")
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
    .bindPopup(routeName + "<br>End")
    .addTo(map);

    map.fitBounds(route.getBounds());

}
