import { securityCheck, parseResponseSecurityCheckApproval, parseResponseSecurityCheckToken } from './securityCheck';

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

test('parseResponseSecurityCheckToken', () => {

  const j1 = {"code":1,"message":"OK","result":{"0x84fa8f52e437ac04107ec1768764b2b39287cb3e":{"anti_whale_modifiable":"1","buy_tax":"1","can_take_back_ownership":"0","cannot_buy":"1","creator_address":"0x2760da4b34fab67884d9f9905460373d268e407a","creator_balance":"0","creator_percent":"0.000000","dex":[{"name":"UniswapV2","liquidity":"9945.36414120","pair":"0x1f1b4836dde1859e2ede1c6155140318ef5931c2"}],"external_call":"0","hidden_owner":"0","holder_count":"2574","holders":[{"address":"0x000000000000000000000000000000000000dead","tag":"","is_contract":0,"balance":"3189194891595283","percent":"0.425958492716196934","is_locked":1},{"address":"0x1f1b4836dde1859e2ede1c6155140318ef5931c2","tag":"UniswapV2","is_contract":1,"balance":"2763274978358650","percent":"0.369071343944508520","is_locked":0},{"address":"0xdfcc050d7ab45e8e345296ff94194a807cfe8fcc","tag":"","is_contract":1,"balance":"322097825646173.3","percent":"0.043020357483006858","is_locked":0},{"address":"0x1f7efdcd748f43fc4beae6897e5a6ddd865dccea","tag":"","is_contract":1,"balance":"288113099838301.44","percent":"0.038481254959468956","is_locked":0},{"address":"0xdbc0eef081dec6630be67989009e0ade58274477","tag":"","is_contract":0,"balance":"274215208760739.3","percent":"0.036625010692010275","is_locked":0},{"address":"0xfbc1a66d70f152220a8bb1919088ee586f9472b8","tag":"","is_contract":0,"balance":"168055139128954.03","percent":"0.022445951467322331","is_locked":0},{"address":"0xa1f66f00d81cb7b41d15cad7afcccfb2ab306c86","tag":"","is_contract":1,"balance":"130521100453297.42","percent":"0.017432792007557638","is_locked":0},{"address":"0xb04ba3845d2c59f2b71544e426f9c37c43b68cbf","tag":"","is_contract":1,"balance":"64950056641951.04","percent":"0.008674925543731232","is_locked":0},{"address":"0xeb6e85f2f6b5ee2f0b5a44bfce788d7788ea1cd2","tag":"","is_contract":1,"balance":"33916340199285.734","percent":"0.004529968735310160","is_locked":0},{"address":"0x82eb30c45bc6ba437c5abd2190dcaa4117becd63","tag":"","is_contract":1,"balance":"24244570965158.715","percent":"0.003238178053052150","is_locked":0}],"is_anti_whale":"1","is_blacklisted":"0","is_honeypot":"0","is_in_dex":"1","is_mintable":"1","is_open_source":"1","is_proxy":"0","is_whitelisted":"0","lp_holder_count":"10","lp_holders":[{"address":"0x000000000000000000000000000000000000dead","tag":"","is_contract":0,"balance":"125511806.18559392","percent":"0.990894326168576578","is_locked":1},{"address":"0xaa0158358cca97e443e4845f705ca6f4e286b824","tag":"","is_contract":0,"balance":"1045180.9687670711","percent":"0.008251525679100131","is_locked":0},{"address":"0x2bacb531fafb021abcf14b3781ceebb6f2aca772","tag":"","is_contract":0,"balance":"44869.56048074385","percent":"0.000354237535489709","is_locked":0},{"address":"0xa1f66f00d81cb7b41d15cad7afcccfb2ab306c86","tag":"","is_contract":1,"balance":"32159.68591479621","percent":"0.000253895241195187","is_locked":0},{"address":"0x7c3fb71b0527a86ce9cff152d4d9c9549cce1f6e","tag":"","is_contract":0,"balance":"26734.922325741358","percent":"0.000211067656886092","is_locked":0},{"address":"0xf312c6b650a3350cc0fb66c98391cb4ce828053f","tag":"","is_contract":0,"balance":"2453.137742842515","percent":"0.000019367104534359","is_locked":0},{"address":"0xc87fa022a38715b073eef90dc4a8e2ddb42e9119","tag":"","is_contract":0,"balance":"1873.3855440712248","percent":"0.000014790059698459","is_locked":0},{"address":"0x8ae71940dd8f8355dbbb47c4116976628ab489b5","tag":"","is_contract":0,"balance":"100.0","percent":"0.000000789482962824","is_locked":0},{"address":"0x2f893a00adfe1610ce9d5c898e54b845b54cdad9","tag":"","is_contract":0,"balance":"0.13572891815871982","percent":"0.000000001071556684","is_locked":0},{"address":"0x0000000000000000000000000000000000000000","tag":"","is_contract":0,"balance":"0.000000000000001","percent":"0.000000000000000000","is_locked":1}],"lp_total_supply":"126665177.982098100769463336","owner_address":"0xf032646f1c003b73f696fb4ca6267c2690732ae1","owner_balance":"23250456099933.5863010890911947","owner_change_balance":"0","owner_percent":"0.003105","personal_slippage_modifiable":"0","selfdestruct":"0","sell_tax":"1","slippage_modifiable":"0","token_name":"Grove Token","token_symbol":"GVR","total_supply":"7487102490336178.456769825360231457","trading_cooldown":"0","transfer_pausable":"1"}}};
  expect(parseResponseSecurityCheckToken(j1)).toStrictEqual([
    "Owner can prevent you from transfering tokens!",
    "Buy tax is 100%, therefore no tokens will actually be bought when putting Ether in",
    "Sell tax is 100%, therefore no tokens will actually be bought when putting Ether in",
  ]);

});

