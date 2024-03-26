import React, { useState } from "react";
import dynamic from "next/dynamic";
const MapBox = dynamic(() => import("../Mapbox/MapBoxDraw"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
import SidePane from "../SidePane/SidePane";

function Home() {
  const [area, setArea] = useState(0);

  return (
    <div class="flex w-full">
      <MapBox area={area} setArea={setArea} />
      <SidePane area={area} setArea={setArea} />
    </div>
  );
}

export default Home;
