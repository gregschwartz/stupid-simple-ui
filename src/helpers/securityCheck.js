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

export function parseResponseSecurityCheckNFT(data) {
  if(!data || !data.result) { return []; }
  
  const result = data.result;
  let issues = [];
  // console.log(result);

  //check for bad permissions by the owner
  if(result.privileged_burn?.value==="1" || result.privileged_burn?.value==="3") { issues.push(`Contract Owner can burn other accounts' NFTs!`); }
  if(result.transfer_without_approval?.value==="1" || result.transfer_without_approval?.value==="3") { issues.push(`Contract Owner can transfer other accounts' NFTs without permission!`); }
  if(result.self_destruct?.value==="1" || result.self_destruct?.value==="3") { issues.push(`Contract can  self destruct, destroying all assets!`); }
  
  //other
  if(result.restricted_approval==="1") { issues.push(`Contract restricts trading, cannot be traded on regular exchanges`); }
  if(result.oversupply_minting==="1") { issues.push(`Contract Owner can mint more than the claimed supply, which will drive value down`); }

  // console.log(issues);
  return issues;
}

export function parseResponseSecurityCheckAddress(data, nameForAddressBeingChecked) {
  if(!data || !data.result) { return []; }
  
  const result = data.result;
  let issues = [];
  // console.log(result);
  
  //high risk issues
  if(result.honeypot_related_address==="1") { issues.push(`${nameForAddressBeingChecked} has created tokens that were scams and/or honeypots`); }
  if(result.phishing_activities==="1") { issues.push(`${nameForAddressBeingChecked} has been involved in phishing activity`); }
  if(result.blackmail_activities==="1") { issues.push(`${nameForAddressBeingChecked} has been involved in blackmail activity`); }
  if(result.stealing_attack==="1") { issues.push(`${nameForAddressBeingChecked} has been involved in stealing attacks`); }
  if(result.fake_kyc==="1") { issues.push(`${nameForAddressBeingChecked} has been involved in fake identity verification (aka KYC)`); }
  if(result.malicious_mining_activities==="1") { issues.push(`${nameForAddressBeingChecked} has been involved in malicious mining`); }
  if(result.cybercrime==="1") { issues.push(`${nameForAddressBeingChecked} has been involved in cybercrime`); }
  if(result.money_laundering==="1") { issues.push(`${nameForAddressBeingChecked} has been involved in money laundering`); }
  if(result.financial_crime==="1") { issues.push(`${nameForAddressBeingChecked} has been involved in financial crime`); }
  if(result.blacklist_doubt==="1") { issues.push(`${nameForAddressBeingChecked} is suspected of malicious behavior`); }
  if(result.sanctioned==="1") { issues.push(`${nameForAddressBeingChecked} has been sanctioned for bad behavior`); }

  //number of contracts
  if(result.number_of_malicious_contracts_created!==undefined && result.number_of_malicious_contracts_created!=="0") { issues.push(`${nameForAddressBeingChecked} has created ${result.number_of_malicious_contracts_created} malicious contract${(result.number_of_malicious_contracts_created==="1" ? "" : "s")}`); }

  // console.log(issues);
  return issues;
}

export function SecurityCheck({chainName, contractAddress, uiCreatorAddress=undefined}) {
  //config
  const chainIds = {"ethereum": 1, "optimism": 10, "cronos": 25,
  "bsc": 56, "okc": 66, "gnosis": 100, "heco": 128, "polygon": 137, "fantom":250, "kcc": 321, "ethw": 10001, "arbitrum": 42161, "avalanche": 43114, "consensys zkevm": 59140, "fon": 201022, "harmony": 1666600000,};
  
  const [issues, setIssues] = useState([]);

  useEffect(()=>{

    async function fetchGoPlusSecurityData() {
      const thisChainId = chainIds[chainName.toString().toLowerCase()];
      if(thisChainId === undefined) { setIssues([]); return; }

      let found = [];
      let contractCreatorAddress;

      //check contract
      const r1 = await fetch(`https://api.gopluslabs.io/api/v1/approval_security/${thisChainId}?contract_addresses=${contractAddress}`);
      const j1 = await r1.json();
      found = found.concat(parseResponseSecurityCheckApproval(j1));
      
      //address check on contract creator
      if(j1.result?.creator_address !== undefined) {
        contractCreatorAddress = j1.result.creator_address;
        const r2 = await fetch(`https://api.gopluslabs.io/api/v1/address_security/${contractCreatorAddress}?chain_id=${thisChainId}`);
        const j2 = await r2.json();
        found = found.concat(parseResponseSecurityCheckAddress(j2, "Contract Creator"));
      }

      //address check on UI creator address (if different)
      if(uiCreatorAddress !== undefined && uiCreatorAddress !== contractCreatorAddress) {
        const r3 = await fetch(`https://api.gopluslabs.io/api/v1/address_security/${uiCreatorAddress}?chain_id=${thisChainId}`)
        const j3 = await r3.json();
        found = found.concat(parseResponseSecurityCheckAddress(j3, "UI Creator"));
      }

      //check token security issues
      const r4 = await fetch(`https://api.gopluslabs.io/api/v1/token_security/${thisChainId}?contract_addresses=${contractAddress}`);
      const j4 = await r4.json();
      found = found.concat(parseResponseSecurityCheckToken(j4));

      //check NFT
      const r5 = await fetch(`https://api.gopluslabs.io/api/v1/nft_security/${thisChainId}?contract_addresses=${contractAddress}`);
      const j5 = await r5.json();
      console.log("nft", j5);
      found = found.concat(parseResponseSecurityCheckNFT(j5));

      setIssues(found);
    }
    fetchGoPlusSecurityData();

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
