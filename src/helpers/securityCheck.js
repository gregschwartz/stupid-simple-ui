import {useEffect, useState} from 'react';

//had to remove because I couldn't figure out how to share the lookup array between the two functions
// export function chainCanBeSecurityChecked(chainName) {
//   const good = (chainIds[chainName.toLowerCase()] !== undefined);
//   console.log("chainCanBeSecurityChecked, chain", chainName, "Id:", chainIds[chainName], "is undefined", (chainIds[chainName]==undefined));
//   return (good);
// }


export function parseResponseSecurityCheckApproval(data) {
  if(!data || !data.result) { return []; }
  
  let results = [];
  if(data.result.doubt_list === 1) {
    results.push("Contract is a suspected malicious contract");
  }
  
  const maliciousBehaviorMessages = {
    "honeypot_related_address": "Contract is related to honeypot tokens or has created scam tokens",
    "phishing_activities": "Contract has implemented phishing activities",
    "blackmail_activities": "Contract has implemented blackmail activities",
    "stealing_attack": "Contract has implemented stealing attacks",
    "fake_kyc": "Contract is involved in fake KYC",
    "malicious_mining_activities": "Contract is involved in malicious mining activities",
    "darkweb_transactions": "Contract is involved in darkweb transactions",
    "cybercrime": "Contract is involved in cybercrime",
    "money_laundering": "Contract is involved in money laundering",
    "financial_crime": "Contract is involved in financial crime",
    "blacklist_doubt": "Contract is suspected of malicious behavior and is therefore blacklisted",
  };

  if(data.result.malicious_behavior.length > 0) {
    for(var i=0; i<data.result.malicious_behavior.length; i++) {
      results.push(maliciousBehaviorMessages[ data.result.malicious_behavior[i] ]);
    }
  }

  // console.log("results", results);
  return results;
}

export function SecurityCheck({chainName, contractAddress}) {
  //config
  const chainIds = {"ethereum": 1, "bsc": 56, "okc": 66, "heco": 128, "polygon": 137, "fantom":250, "arbitrum": 42161, "avalanche": 43114};

  const [issues, setIssues] = useState([]);

  useEffect(()=>{
    // console.log("start", chainName, contractAddress);
    const thisChainId = chainIds[chainName.toString().toLowerCase()];
    if(thisChainId === undefined) { setIssues([]); return; }
    // console.log("thisChainId", thisChainId);

    // console.log("fetch url ", `https://api.gopluslabs.io/api/v1/approval_security/${thisChainId}?contract_addresses=${contractAddress}`);
    fetch(`https://api.gopluslabs.io/api/v1/approval_security/${thisChainId}?contract_addresses=${contractAddress}`)
      .then(response => response.json())
      .then((data) => {
        // console.log("data", data);
        const parsed = parseResponseSecurityCheckApproval(data);
        // console.log("setIssues", parsed);
        setIssues(parsed); 
      });
   }, [chainName, contractAddress]);
  
  if(issues.length === 0) {
    return (<div />);
  }

  return (
   <div className="securityIssues">
      <h1>Warning: security issues!</h1>
      <ul>
        {issues.map((message) => {
          return (
            <li key={message}>
                {message}
            </li>
          );
        })}
      </ul>
      <h4>We <em>strongly</em> recommend against using this contract.</h4>
    </div>
   );
}

