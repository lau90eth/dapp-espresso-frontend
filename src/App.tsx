import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CounterABI from "./Counter.json";
import InteractorABI from "./ftUSDInteractor.json";

const COUNTER_ADDRESS = "0x978132bFb9ee8F897c53d6919454e459E4aeF9a9";
const INTERACTOR_ADDRESS = "0xb193Ee9e56842dD0e892170c31d27412AfADe8F8";

function App() {
  const [count, setCount] = useState<number | null>(null);
  const [ftusdBalance, setFtusdBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  const getProvider = () => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    return new ethers.BrowserProvider(window.ethereum as any, {
      chainId: 11155420,
      name: "optimism-sepolia",
    });
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        try {
          const provider = getProvider();
          const signer = await provider.getSigner();
          console.log("Signer:", await signer.getAddress());

          const counter = new ethers.Contract(COUNTER_ADDRESS, CounterABI.abi, signer);
          const interactor = new ethers.Contract(INTERACTOR_ADDRESS, InteractorABI.abi, signer);

          const c = await counter.getCount();
          console.log("getCount():", c.toString());
          setCount(Number(c));

          const bal = await interactor.getBalance(signer.address);
          console.log("getBalance():", bal.toString());
          setFtusdBalance(ethers.formatEther(bal));
        } catch (e) {
          console.error("Init failed:", e);
        }
      }
    };
    init();
  }, []);

  const increment = async () => {
    if (!window.ethereum) return;
    setLoading(true);
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const counter = new ethers.Contract(COUNTER_ADDRESS, CounterABI.abi, signer);
      const tx = await counter.increment();
      await tx.wait();
      const c = await counter.getCount();
      setCount(Number(c));
    } catch (e) {
      console.error("increment failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const mintFtUSD = async () => {
    if (!window.ethereum) return;
    setLoading(true);
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const interactor = new ethers.Contract(INTERACTOR_ADDRESS, InteractorABI.abi, signer);
      const tx = await interactor.mint(ethers.parseEther("100"));
      console.log("Mint tx:", tx.hash);
      await tx.wait();
      const bal = await interactor.getBalance(signer.address);
      setFtusdBalance(ethers.formatEther(bal));
    } catch (e) {
      console.error("mintFtUSD failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h1>Flying Tulip + Counter DApp</h1>
      
      <h2>Counter</h2>
      <p>Count: <strong>{count !== null ? count : "Loading..."}</strong></p>
      <button onClick={increment} disabled={loading}>
        {loading ? "Transazione..." : "Incrementa"}
      </button>

      <h2>ftUSD</h2>
      <p>Balance: <strong>{ftusdBalance} ftUSD</strong></p>
      <button onClick={mintFtUSD} disabled={loading}>
        {loading ? "Minting..." : "Mint 100 ftUSD"}
      </button>
    </div>
  );
}

export default App;
