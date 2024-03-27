import React from "react";
import * as turf from "@turf/turf";

function SidePane({ area, setArea }) {
  const areaKilometers = turf
    .convertArea(area, "meters", "kilometers")
    .toFixed(4);
  const areaFeet = turf.convertArea(area, "meters", "feet").toFixed(4);
  const areaAcres = turf.convertArea(area, "meters", "acres").toFixed(4);
  const areaMiles = turf.convertArea(area, "meters", "miles").toFixed(4);

  return (
    <div className="w-3/12 p-8 ">
      <h2 className="text-2xl font-semibold mb-10 pb-5 border-b-2">
        Selected Area Specifications
      </h2>
      {area ? (
        <div className="flex flex-col gap-8">
          <div>
            <h1>Area in square meters:</h1>
            <p>
              <strong>{area}</strong>
            </p>
          </div>
          <div>
            <h1>Area in square kilometers:</h1>

            <p>
              <strong>{areaKilometers}</strong>
            </p>
          </div>
          <div>
            <h1>Area in square miles:</h1>
            <p>
              <strong>{areaMiles}</strong>
            </p>
          </div>
          <div>
            <h1>Area in square feet: </h1>
            <p>
              <strong>{areaFeet}</strong>
            </p>
          </div>
          <div>
            <h1>Area in acres:</h1>
            <p>
              <strong>{areaAcres}</strong>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xl text-center">
            Select area in graph to calculate area
          </p>
        </div>
      )}
    </div>
  );
}

export default SidePane;
