import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MLM from "./components/MLM";
import ReferralTree from "./components/TreeNode";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MLM />
    </>
  );
}

export default App;
