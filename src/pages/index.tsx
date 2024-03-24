import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Mapbox/MapBoxDraw"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <Map />
    </main>
  );
}
