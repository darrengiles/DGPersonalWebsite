import "../styles/styles.css";
import "../styles/playground.css";
import Map from "../components/Map";

function Playground() {
  return (
    <>
    <header className="hero"></header>
      <main className="page-container">
        <h2 id="playground">Playground</h2>
        {/* page content */}
        <p>Welcome to the playground :)</p>
        <p>Right now I'm exploring APIs and starting off with Google Maps.</p>
        <Map />

        
      </main>
    </>
  );
}

export default Playground;