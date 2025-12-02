import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
//_______________________________
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Communities from "./pages/Communities";
import Volunteer from "./pages/Volunteer";
import AboutUs from "./pages/AboutUs";


export default function App() {
return (
<>
<nav style={{ padding: "20px", display: "flex", gap: "20px" }}>
<Link to="/">Home</Link>
<Link to="/services">Services</Link>
<Link to="/communities">Communities</Link>
<Link to="/volunteer">Volunteer</Link>
<Link to="/about-us">About Us</Link>
</nav>


<Routes>
<Route path="/" element={<Home />} />
<Route path="/services" element={<Services />} />
<Route path="/communities" element={<Communities />} />
<Route path="/volunteer" element={<Volunteer />} />
<Route path="/about-us" element={<AboutUs />} />
</Routes>
</>
);
}

export default function Home() {
return <h1>Welcome to Our Homepage</h1>;
}
*/


export default function Services() {
return <h1>Our Services</h1>;
}
*/


export default function Communities() {
return <h1>Community Programs</h1>;
}
*/


export default function Volunteer() {
return <h1>Volunteer Opportunities</h1>;
}
*/


export default function AboutUs() {
return <h1>About Us</h1>;
}
*/


body {
font-family: Arial, sans-serif;
margin: 0;
padding: 0;
}
nav a {
text-decoration: none;
color: black;
font-weight: 600;
}
nav a:hover {
text-decoration: underline;

*/
export default App
