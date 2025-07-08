import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";

// Convert flat list into tree structure
const buildTreeData = (referralList) => {
  if (!Array.isArray(referralList) || referralList.length === 0) return [];

  const addressToNode = {};
  let root = null;

  referralList.forEach((user) => {
    const node = {
      name: `${user.account.slice(0, 6)}...${user.account.slice(-4)}`,
      attributes: {
        referral: `${user.refAccount.slice(0, 6)}...${user.refAccount.slice(
          -4
        )}`,
        amount: user.amount,
        refAmount: user.refAmount,
      },
      children: [],
    };
    addressToNode[user.account] = node;
  });

  referralList.forEach((user) => {
    if (user.refAccount in addressToNode && user.refAccount !== user.account) {
      addressToNode[user.refAccount].children.push(addressToNode[user.account]);
    } else {
      root = addressToNode[user.account];
    }
  });

  return root ? [root] : [];
};

const TreeComponent = ({ userDetails }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    if (userDetails && userDetails.length > 0) {
      const structured = buildTreeData(userDetails);
      setTreeData(structured);
    }
  }, [userDetails]);

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        background: "linear-gradient(to bottom right, #e6f2ff, #ffffff)",
        border: "1px solid #b3d1ff",
        borderRadius: "12px",
        padding: "10px",
        boxShadow: "0 10px 25px rgba(0, 0, 255, 0.05)",
        overflow: "auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#1a4d80",
          fontSize: "26px",
          fontWeight: "600",
        }}
      >
        🌐 Referral Tree View
      </h2>

      {treeData.length > 0 ? (
        <div style={{ width: "100%", height: "500px" }}>
          <Tree
            data={treeData}
            orientation="vertical"
            nodeSize={{ x: 180, y: 120 }}
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            translate={{ x: 500, y: 50 }}
            renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
              <g onClick={toggleNode}>
                <defs>
                  <filter id="blueShadow" height="130%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <feOffset dx="2" dy="2" result="offsetblur" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <linearGradient
                    id="skyBlueGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#a3d5ff", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#3399ff", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>

                {/* Node Box */}
                <rect
                  x="-70"
                  y="-30"
                  width="140"
                  height="60"
                  rx="12"
                  ry="12"
                  fill="url(#skyBlueGradient)"
                  stroke="#005c99"
                  strokeWidth="2"
                  filter="url(#blueShadow)"
                />

                {/* User Address */}
                <text
                  x="0"
                  y="-5"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="Segoe UI"
                >
                  {nodeDatum.name}
                </text>

                {/* Referral Amount */}
                {nodeDatum.attributes && (
                  <text
                    x="0"
                    y="15"
                    textAnchor="middle"
                    fill="#e0f7ff"
                    fontSize="11"
                    fontWeight="500"
                    fontFamily="Segoe UI"
                  >
                    💰 {nodeDatum.attributes.refAmount}
                  </text>
                )}
              </g>
            )}
            linkProps={{
              stroke: "#3399ff", // sky blue links
              strokeWidth: 2.5,
              strokeLinecap: "round",
            }}
          />
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#555", marginTop: "40px" }}>
          No referral data found.
        </p>
      )}
    </div>
  );
};

export default TreeComponent;
