import dynamic from "next/dynamic";

const HomeComponent = dynamic(() => import("../components/Home/Home"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <HomeComponent />
    </main>
  );
}
