import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const YOUR_MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAP_TOKEN;

const MapBoxDraw = ({ area, setArea }) => {
  const [theme, setTheme] = useState("satellite");

  function themeHandler(e) {
    if (e.target.nodeName === "INPUT") {
      setTheme(e.target.value);
    }
  }

  function calculateLengthAndMidPoints(c1, c2) {
    let point1 = turf.point(c1);
    let point2 = turf.point(c2);

    let line = turf.lineString([c1, c2]);
    let length = turf.length(line, { units: "meters" });

    return {
      length,
      midpoint: turf.midpoint(point1, point2).geometry.coordinates,
    };
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

      let coordArr = data.features[0].geometry.coordinates[0];

      for (let i = 1; i < coordArr.length; i++) {
        let { length, midpoint } = calculateLengthAndMidPoints(
          coordArr[i - 1],
          coordArr[i]
        );

        const el = document.createElement("p");
        el.className = "text-white text-base font-bold";
        el.innerText = length.toFixed(2) + "m";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat(midpoint).addTo(map);
      }

      const polygon = turf.polygon(data.features[0].geometry.coordinates);
      const area = turf.area(polygon);
      const rounded_area = Math.round(area * 100) / 100;
      setArea(rounded_area);
    }

    //Adding Geocoder

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    // Check if the geocoder control is not already added to the UI
    if (!document.getElementById("geocoder").querySelector(".mapboxgl-ctrl")) {
      document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
    }

    // Clean up function
    return () => map.remove();
  }, [theme]); // Run only once on component mount

  return (
    <div className="w-9/12">
      <div id="map" style={{ width: "100%", height: "800px" }}>
        <div id="geocoder" className="geocoder"></div>
      </div>

      <div
        id="menu"
        onChange={(e) => themeHandler(e)}
        className="flex gap-4 m-4 items-center justify-start "
      >
        {["satellite", "light", "dark", "streets", "outdoors"]?.map(
          (themeOption, index) => (
            <div className="flex gap-2" key={index}>
              <input
                className="cursor-pointer"
                id="satellite-streets-v12"
                type="radio"
                name="rtoggle"
                value={themeOption}
                checked={theme === themeOption}
              />

              <label htmlFor="satellite-streets-v12">{themeOption}</label>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MapBoxDraw;
