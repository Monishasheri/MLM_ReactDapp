import { useState, useCallback } from "react";
import { ethers, BrowserProvider } from "ethers";
import "../Styles/MLM.css";

import TreeComponent from "./TreeNode";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const CONTRACT_TOKEN = "0x31eDA9109510e740DeD8C7fc48EC32e38ac2FD84";
const CONTRACT_ADDRESS = "0x6AB8526bA06D5bb9AeD6B30e6bc08614C08DA835";
const MLM_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "_id",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "address",
        name: "_refAccount",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "addUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isUserExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "userAccount",
        type: "address",
      },
      {
        internalType: "address",
        name: "refAccount",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "refAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const token_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const MLM = () => {
  const [form, setForm] = useState({
    account: "",
    refAccount: "",
    amount: "",
  });
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [referralTree, setReferralTree] = useState([]);
  const [showTree, setShowTree] = useState(false);

  const connectWallet = async () => {
    setError(null);

    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        return;
      }

      // Ask user to connect wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        setError("No accounts found.");
        return;
      }

      const selectedAccount = accounts[0];
      setAccount(selectedAccount);

      const ethProvider = new BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      const ethSigner = await ethProvider.getSigner();
      setSigner(ethSigner);

      const net = await ethProvider.getNetwork();
      setNetwork(net);
      setIsConnected(true);

      console.log(
        `✅ Connected to ${net.name} (Chain ID: ${Number(net.chainId)})`
      );
      console.log(`✅ Account: ${selectedAccount}`);
    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
      setError(`Connection failed: ${err.message}`);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function transferToken(account, amountBN) {
    const adminprovider = new ethers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/d1711e1923534fc6812c0b303a519d1d"
    );
    const adminPrivateKey =
      "86d10f6ecc55ad9fc90dab29be3a79d8d6d06eb93a118ad604474e8948a03751";
    const adminWallet = new ethers.Wallet(adminPrivateKey, adminprovider);
    const tokenContract = new ethers.Contract(
      CONTRACT_TOKEN,
      token_ABI,
      adminWallet
    );

    try {
      const adminAddress = await adminWallet.getAddress();
      const adminBalance = await tokenContract.balanceOf(adminAddress);

      if (adminBalance < amountBN) {
        console.log("Admin has insufficient tokens.");
        return false;
      }

      const tx = await tokenContract.transfer(account, amountBN);
      await tx.wait();
      console.log("Token transferred to user:", account);
      return true;
    } catch (err) {
      console.error("Token Transfer Error:", err);
      return false;
    }
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      console.log("Submitted:", form);

      if (!form.account || !form.refAccount || !form.amount) {
        setError("All fields are required!");
        return;
      }

      if (
        !ethers.isAddress(form.account) ||
        !ethers.isAddress(form.refAccount)
      ) {
        setError("Please enter valid Ethereum addresses.");
        return;
      }

      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, MLM_ABI, signer);
        const tokenContract = new ethers.Contract(
          CONTRACT_TOKEN,
          token_ABI,
          signer
        );

        // ✅ Check if referral exists
        const isRefExists = await contract.isUserExists(form.refAccount);
        if (!isRefExists) {
          alert("Referral not found!");
          return;
        }

        // ✅ Check if account is already registered
        const isAlreadyUser = await contract.isUserExists(account);
        if (isAlreadyUser) {
          alert("User already registered!");
          return;
        }

        const userBalance = await tokenContract.balanceOf(account);
        const amountBN = ethers.parseUnits(form.amount, 18);
        if (userBalance < amountBN) {
          const autoTransfer = await transferToken(account, amountBN);
          if (!autoTransfer) {
            return;
          }
        }
        // ✅ Approve token
        const approveUser = await tokenContract.approve(
          CONTRACT_ADDRESS,
          form.amount
        );
        await approveUser.wait();
        console.log("Approve Successful", approveUser);
        const allowance = await tokenContract.allowance(
          account,
          CONTRACT_ADDRESS
        );
        console.log("User have Allowance", allowance);
        // ✅ Add User
        const tx = await contract.addUser(
          form.account,
          form.refAccount,
          form.amount
        );
        await tx.wait();
        console.log("User Submitted Successfully", tx);
        alert("Registered Successfully!");

        setForm({ account: "", refAccount: "", amount: "" });
      } catch (err) {
        setError(err);
        console.error("Registration Error:", err);
        alert("An error occurred during registration.");
      }
    },
    [form, signer]
  );

  const getUserDetails = useCallback(async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MLM_ABI, signer);
      let currentAccount = account;
      const referralChain = [];

      while (currentAccount) {
        const userData = await contract.users(currentAccount);

        referralChain.push({
          Id: userData.id.toString(),
          account: currentAccount,
          refAccount: userData.refAccount,
          amount: userData.amount.toString(),
          refAmount: userData.refAmount.toString(),
        });
        if (
          userData.refAccount === ZERO_ADDRESS ||
          userData.refAccount === currentAccount
        ) {
          break;
        }
        currentAccount = userData.refAccount;
      }
      console.log("Referral Chain", referralChain);
      setUserDetails(referralChain);
    } catch (err) {
      console.error("Error fetching referral chain:", err);
      setError([]);
    }
  }, [signer]);

  return (
    <div className="mlm-container">
      <h2 className="mlm-heading">Multi Level Marketing</h2>

      <button onClick={connectWallet} className="mlm-connect-btn">
        {account
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>

      {network && <p className="network-label">Network: {network.name}</p>}
      {error && (
        <p style={{ color: "red" }}>{error.message || String(error)}</p>
      )}

      {isConnected && (
        <div className="card-wrapper">
          {/* Add User Card */}
          <div
            className="mlm-card"
            onClick={() => {
              setShowAddForm(true);
              setShowUserDetails(false);
              setShowTree(false); // <--- ADD THIS
            }}
          >
            <h3>Add User</h3>
          </div>

          {/* Fetch User Card */}
          <div
            className="mlm-card"
            onClick={async () => {
              setShowUserDetails(true);
              setShowAddForm(false);
              setShowTree(false); // <--- ADD THIS
              await getUserDetails(); // This sets userDetails
            }}
          >
            <h3>Fetch User</h3>
          </div>

          {/* Show Referral Tree Card */}
          <div
            className="mlm-card"
            onClick={async () => {
              setShowTree(true);
              setShowUserDetails(false);
              setShowAddForm(false);
            }}
          >
            <h3>Show Tree</h3>
          </div>
        </div>
      )}

      {showAddForm && (
        <form className="mlm-form">
          <label>Your Address</label>
          <input
            type="text"
            name="account"
            placeholder="Enter your Account address"
            value={form.account}
            onChange={handleChange}
            required
          />

          <label>Referral Address</label>
          <input
            type="text"
            name="refAccount"
            placeholder="Enter referral Account"
            value={form.refAccount}
            onChange={handleChange}
            required
          />

          <label>Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <button onClick={handleSubmit} type="submit">
            Submit
          </button>
        </form>
      )}

      {showUserDetails && userDetails && (
        <div className="mlm-card user-details-card">
          <h3
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#2c3e50",
            }}
          >
            👥 Referral Chain Information
          </h3>

          <table className="user-details-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Address</th>
                <th>Referral Address</th>
                <th>Amount</th>
                <th>Referral Amount</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.map((user, index) => (
                <tr key={index}>
                  <td>{user.Id}</td>
                  <td>{user.account}</td>
                  <td>{user.refAccount}</td>
                  <td>{user.amount}</td>
                  <td>{user.refAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showTree && userDetails.length > 0 && (
        <TreeComponent userDetails={userDetails} />
      )}
    </div>
  );
};

export default MLM;
