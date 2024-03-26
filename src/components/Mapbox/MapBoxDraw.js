import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";

const YOUR_MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAP_TOKEN;

const MapBoxDraw = ({ area, setArea }) => {
  const [theme, setTheme] = useState("satellite");

  function themeHandler(e) {
    if (e.target.nodeName === "INPUT") {
      setTheme(e.target.value);
    }
  }

  useEffect(() => {
    mapboxgl.accessToken = YOUR_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: `mapbox://styles/mapbox/${theme}-v9`, // style URL
      center: [-91.874, 42.76], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });
    map.addControl(new mapboxgl.NavigationControl());

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

      if (!data || data.features.length === 0) {
        if (e.type !== "draw.delete") {
          alert("Click the map to draw a polygon.");
        }
        return;
      }

      const polygon = turf.polygon(data.features[0].geometry.coordinates);
      const area = turf.area(polygon);
      const rounded_area = Math.round(area * 100) / 100;
      setArea(rounded_area);
    }

    // Clean up function
    return () => map.remove();
  }, [theme]); // Run only once on component mount

  return (
    <div class="w-9/12">
      <div id="map" style={{ width: "100%", height: "800px" }}></div>

      <div
        id="menu"
        onChange={(e) => themeHandler(e)}
        class="flex gap-4 m-4 items-center justify-start "
      >
        <div class="flex gap-2">
          <input
            class="cursor-pointer"
            id="satellite-streets-v12"
            type="radio"
            name="rtoggle"
            value="satellite"
            checked={theme === "satellite"}
          />

          <label htmlFor="satellite-streets-v12">Satellite Streets</label>
        </div>

        <div class="flex gap-2">
          <input
            class="cursor-pointer"
            id="light-v11"
            type="radio"
            name="rtoggle"
            value="light"
            checked={theme === "light"}
          />
          <label htmlFor="light-v11">Light</label>
        </div>

        <div class="flex gap-2">
          <input
            class="cursor-pointer"
            id="dark-v11"
            type="radio"
            name="rtoggle"
            value="dark"
            checked={theme === "dark"}
          />
          <label htmlFor="dark-v11">Dark</label>
        </div>

        <div class="flex gap-2">
          <input
            class="cursor-pointer"
            id="streets-v12"
            type="radio"
            name="rtoggle"
            value="streets"
            checked={theme === "streets"}
          />
          <label htmlFor="streets-v12">Streets</label>
        </div>

        <div class="flex gap-2">
          <input
            class="cursor-pointer"
            id="outdoors-v12"
            type="radio"
            name="rtoggle"
            value="outdoors"
            checked={theme === "outdoors"}
          />
          <label htmlFor="outdoors-v12">Outdoors</label>
        </div>
      </div>
    </div>
  );
};

export default MapBoxDraw;
