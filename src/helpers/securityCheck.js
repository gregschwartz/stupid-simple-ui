import {useEffect, useState} from 'react';

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

export function parseResponseSecurityCheckToken(data, address) {
  const MAX_ACCEPTABLE_TAX = 0.3;

  if(!data || !data.result) { return []; }
  
  let results = [];
  
  for(var key in data.result) {
    const response = data.result[key];
    // console.log("response", response);

    //high risk issues
    if(response.is_true_token==="0") { results.push("Contract has been marked as a fake token!"); }
    if(response.is_airdrop_scam==="1") { results.push("Contract has been marked as an airdrop scam!"); }
    if(response.is_honeypot==="1") { results.push("Tokens [probably] cannot be sold!"); }
    if(response.selfdestruct==="1") { results.push("Contract can self destruct, destroying all assets!"); }
    if(response.transfer_pausable==="1") { results.push("Owner can prevent you from transfering tokens!"); }
    if(response.owner_change_balance==="1") { results.push("Owner can alter any contract holders balance!"); }

    //if buy or sell taxes are too high, flag it
    if(response.buy_tax==="1") { results.push("Buy tax is 100%, therefore no tokens will actually be bought when putting Ether in"); }
    else if(response.buy_tax >= MAX_ACCEPTABLE_TAX) { results.push(`Buy tax is extremely high: ${response.buy_tax}%. Likely a scam.`); }
    if(response.sell_tax==="1") { results.push("Sell tax is 100%, therefore no tokens will actually be bought when putting Ether in"); }
    else if(response.sell_tax >= MAX_ACCEPTABLE_TAX) { results.push(`Sell tax is extremely high: ${response.sell_tax}%. Likely a scam.`); }
    
    //more issues
    if(response.hidden_owner===1) { results.push("Contract has a hidden owner"); }
    if(response.personal_slippage_modifiable===1) { results.push("Contract owner can target specific users with higher taxes"); }
    if(response.can_take_back_ownership===1) { results.push("Contract can "); }
    if(response.cannot_sell_all===1) { results.push("Contract prevents you from selling all your assets at once"); }

    //TODO: check if other_potential_risks key exists, and do something with that
  }

  return results;
}

export function SecurityCheck({chainName, contractAddress}) {
  //config
  const chainIds = {"ethereum": 1, "bsc": 56, "okc": 66, "heco": 128, "polygon": 137, "fantom":250, "arbitrum": 42161, "avalanche": 43114};

  const [issues, setIssues] = useState([]);

  useEffect(()=>{
    const thisChainId = chainIds[chainName.toString().toLowerCase()];
    if(thisChainId === undefined) { setIssues([]); return; }

    fetch(`https://api.gopluslabs.io/api/v1/approval_security/${thisChainId}?contract_addresses=${contractAddress}`)
      .then(response => response.json())
      .then((data) => {
        const parsed = parseResponseSecurityCheckApproval(data);
        setIssues(issues.concat(parsed));
      });

      fetch(`https://api.gopluslabs.io/api/v1/token_security/${thisChainId}?contract_addresses=${contractAddress}`)
      .then(response => response.json())
      .then((data) => {
        const parsed = parseResponseSecurityCheckToken(data);
        setIssues(issues.concat(parsed));
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

