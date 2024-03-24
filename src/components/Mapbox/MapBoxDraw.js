import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";

const YOUR_MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAP_TOKEN;

const MapBoxDraw = () => {
  useEffect(() => {
    mapboxgl.accessToken = YOUR_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/satellite-v9", // style URL
      center: [-91.874, 42.76], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    map.addControl(draw);

    map.on("draw.create", updateArea);
    map.on("draw.delete", updateArea);
    map.on("draw.update", updateArea);

    function updateArea(e) {
      const data = draw.getAll();
      const answer = document.getElementById("calculated-area");

      if (!data || data.features.length === 0) {
        answer.innerHTML = "";
        if (e.type !== "draw.delete") {
          alert("Click the map to draw a polygon.");
        }
        return;
      }

      const polygon = turf.polygon(data.features[0].geometry.coordinates);
      const area = turf.area(polygon);
      const rounded_area = Math.round(area * 100) / 100;
      answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
    }

    // Clean up function
    return () => map.remove();
  }, []); // Run only once on component mount

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "800px" }}></div>
      <div id="calculated-area"></div>;
    </div>
  );
};

export default MapBoxDraw;
