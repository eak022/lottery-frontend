import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { getWeb3, getContract } from "./LotteryContract";

function App() {
  const [ticketNumber, setTicketNumber] = useState(0);
  const [randomNumber, setRandomNumber] = useState(null);
  const [account, setAccount] = useState(null);
  const [prizeAmount, setPrizeAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const web3 = getWeb3();
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          alert("Please connect your wallet");
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkConnection();
  }, []);

  const handleBuyTicket = async () => {
    if (ticketNumber < 0 || ticketNumber > 99) {
      alert("Please choose a number between 00 and 99");
      return;
    }

    setLoading(true);
    try {
      const web3 = getWeb3();
      const contract = getContract(web3);
      const tx = await contract.methods.buyTicket(ticketNumber).send({
        from: account,
        value: web3.utils.toWei("0.001", "ether"), // ราคา 0.001 ETH
      });
      await tx;
      alert("Ticket purchased successfully!");
    } catch (err) {
      console.error(err);
      alert("Error purchasing ticket");
    }
    setLoading(false);
  };

  const handleDrawLottery = async () => {
    setLoading(true);
    try {
      const web3 = getWeb3();
      const contract = getContract(web3);
      const tx = await contract.methods.drawLottery().send({ from: account });
      await tx;
      alert("Lottery drawn!");
    } catch (err) {
      console.error(err);
      alert("Error drawing lottery");
    }
    setLoading(false);
  };

  const handleGetRandomNumber = async () => {
    try {
      const web3 = getWeb3();
      const contract = getContract(web3);
      const number = await contract.methods.getRandomNumber().call();
      setRandomNumber(number);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <h1 className="text-4xl text-white font-bold mb-4">Lottery Game</h1>
      {account ? (
        <>
          <p className="text-white mb-4">Account: {account}</p>
          <div className="mb-4">
            <label className="text-white">Choose a number (00-99):</label>
            <input
              type="number"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(Number(e.target.value))}
              className="input input-bordered input-info w-full max-w-xs"
            />
          </div>
          <button
            onClick={handleBuyTicket}
            disabled={loading}
            className="btn btn-primary mb-4"
          >
            {loading ? "Buying..." : "Buy Ticket (0.001 ETH)"}
          </button>
          <button
            onClick={handleDrawLottery}
            disabled={loading}
            className="btn btn-success mb-4"
          >
            {loading ? "Drawing..." : "Draw Lottery"}
          </button>
          <button
            onClick={handleGetRandomNumber}
            className="btn btn-info mb-4"
          >
            {randomNumber !== null ? `Random Number: ${randomNumber}` : "Get Random Number"}
          </button>
        </>
      ) : (
        <p className="text-white">Please connect your wallet</p>
      )}
    </div>
  );
}

export default App;
