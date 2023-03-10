import { securityCheck, parseResponseSecurityCheckApproval } from './securityCheck';

// test('securityCheck', async () => {
//   const nastyContract = "0xe5c26b21f34fbb63f759e82f3fd1a2ea575ed5d8";
//   const response = await securityCheck("ethereum", nastyAddress);
//   console.log(response);
//   expect(response).toStrictEqual([
//     "Contract is a suspected malicious contract",
//     "Contract is related to honeypot tokens or has created scam tokens",
//   ]);
// });

test('parseResponseSecurityCheckApproval', () => {

  expect(parseResponseSecurityCheckApproval({
    "code": 1,
    "message": "ok",
    "result": {
      "contract_name": "TransparentUpgradeableProxy",
      "tag": "ALPACA",
      "is_contract": 1,
      "creator_address": "0xc44f82b07ab3e691f826951a6e335e1bc1bb0b51",
      "deployed_time": 1641541530,
      "is_open_source": 1,
      "trust_list": 0,
      "doubt_list": 1,
      "malicious_behavior":["phishing_activities"]
    }
  })).toStrictEqual([
    "Contract is a suspected malicious contract",
    "Contract has implemented phishing activities",
  ]);

  expect(parseResponseSecurityCheckApproval({
    "code": 1,
    "message": "ok",
    "result": {
      "contract_name": "TransparentUpgradeableProxy",
      "tag": "ALPACA",
      "is_contract": 1,
      "creator_address": "0xc44f82b07ab3e691f826951a6e335e1bc1bb0b51",
      "deployed_time": 1641541530,
      "is_open_source": 1,
      "trust_list": 0,
      "doubt_list": 0,
      "malicious_behavior":["phishing_activities"]
    }
  })).toStrictEqual([
    "Contract has implemented phishing activities",
  ]);

  expect(parseResponseSecurityCheckApproval({
    "code": 1,
    "message": "ok",
    "result": {
      "contract_name": "TransparentUpgradeableProxy",
      "tag": "ALPACA",
      "is_contract": 1,
      "creator_address": "0xc44f82b07ab3e691f826951a6e335e1bc1bb0b51",
      "deployed_time": 1641541530,
      "is_open_source": 1,
      "trust_list": 0,
      "doubt_list": 0,
      "malicious_behavior":[
        "fake_kyc",
        "malicious_mining_activities",
        "darkweb_transactions",
        "cybercrime",
        "money_laundering",
        "financial_crime"
      ]
    }
  })).toStrictEqual([
    "Contract is involved in fake KYC",
    "Contract is involved in malicious mining activities",
    "Contract is involved in darkweb transactions",
    "Contract is involved in cybercrime",
    "Contract is involved in money laundering",
    "Contract is involved in financial crime",  
  ]);

});

