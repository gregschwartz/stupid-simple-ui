import { securityCheck, parseResponseSecurityCheckApproval, parseResponseSecurityCheckToken, parseResponseSecurityCheckAddress, parseResponseSecurityCheckNFT } from './securityCheck';

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

test('parseResponseSecurityCheckAddress', () => {
  let data = {"code":1,"message":"ok","result":{"cybercrime":"1","money_laundering":"0","number_of_malicious_contracts_created":"5","financial_crime":"0","darkweb_transactions":"0","phishing_activities":"0","contract_address":"0","fake_kyc":"0","blacklist_doubt":"0","data_source":"","stealing_attack":"0","blackmail_activities":"1","sanctioned":"0","malicious_mining_activities":"0","mixer":"0","honeypot_related_address":"0"}};

  expect(parseResponseSecurityCheckAddress(data, "Tester")).toStrictEqual([
    "Tester has been involved in blackmail activity",
    "Tester has been involved in cybercrime",
    "Tester has created 5 malicious contracts",
  ]);

  data.result.phishing_activities="1";
  data.result.cybercrime="0";
  data.result.number_of_malicious_contracts_created="0";
  data.result.darkweb_transactions="1"; //should NOT be shown in output
  expect(parseResponseSecurityCheckAddress(data, "Tester")).toStrictEqual([
    'Tester has been involved in phishing activity',
    "Tester has been involved in blackmail activity",
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

test('parseResponseSecurityCheckNFT', () => {
  let data = {"code":2,"message":"partial data obtained","result":{"nft_address":"0x57a216567d596073dff4cc5026450619ee0be4a5","traded_volume_24h":0,"red_check_mark":null,"total_volume":0,"nft_proxy":1,"restricted_approval":null,"highest_price":0,"transfer_without_approval":{},"discord_url":null,"nft_open_source":1,"privileged_minting":{"value":null,"owner_address":null,"owner_type":null},"nft_owner_number":381,"trust_list":0,"token_id":null,"lowest_price_24h":0,"average_price_24h":0,"nft_erc":"erc721","creator_address":"0x4abf33dbec1e62ae8082fcd67062248e9f5fb515","medium_url":null,"privileged_burn":{"value":null,"owner_address":null,"owner_type":null},"malicious_nft_contract":0,"twitter_url":null,"nft_description":"[Mint on the website](https://dailys.top)\n\nNintendo Official is a collection of collectible Nintendo Entertainment System console game cartridges.You will enjoy online connection, cloud archives, member-exclusive games, member-limited bonuses, and member-exclusive privileges. Additional services such as member discounts will be added in the future, and there may also be member-limited themed gifts.","nft_symbol":"Nintendo","self_destruct":{"value":null,"owner_address":null,"owner_type":null},"metadata_frozen":null,"owner_address":"0x4abf33dbec1e62ae8082fcd67062248e9f5fb515","token_owner":null,"nft_verified":0,"same_nfts":[{"symbol":"Nintendo","createBlockHeight":14596256,"ownerCount":2533,"contractAddress":"0x572887624c096d0a1d84e3d7ecfe0cc55673b1d7","fullName":"Nintendo"},{"symbol":"Nintendo","createBlockHeight":14769194,"ownerCount":1499,"contractAddress":"0x3c28c9e1314b977de890dfd5a1a46d652d171ed9","fullName":"Nintendo"},{"symbol":"Nintendo","createBlockHeight":14624456,"ownerCount":1474,"contractAddress":"0x176ff191b9d4de11c9d5f979ea5a56f2ac027aaf","fullName":"Nintendo"},{"symbol":"Nintendo","createBlockHeight":14712533,"ownerCount":1264,"contractAddress":"0x54144a0ca4822414ec4e745e6ace543a322d94ee","fullName":"Nintendo"},{"symbol":"Nintendo","createBlockHeight":14737904,"ownerCount":1212,"contractAddress":"0xa1626168c67cb21ef5433f52a76e951feb1ebb30","fullName":"Nintendo"},{"symbol":"Nintendo","createBlockHeight":14570938,"ownerCount":892,"contractAddress":"0xdd0f35c245c141937ac6acc6aedc3eb157cbda51","fullName":"Nintendo"},{"symbol":"Nintendo","createBlockHeight":14731247,"ownerCount":883,"contractAddress":"0xfa3e2b753ba1cc8045e2aefe30667a1147717a78","fullName":"Nintendo"},{"symbol":"Nintendo","createBlockHeight":14657715,"ownerCount":865,"contractAddress":"0xeff9852106430fbe38defe2c1b0dc4436ec1dad3","fullName":"Nintendo"},{"symbol":"Nintendo","createBlockHeight":14609733,"ownerCount":623,"contractAddress":"0xa9295ad63ed907b29d70874f41b8dd3b5abc98fe","fullName":"Nintendo"},{"symbol":"Nintendo","createBlockHeight":14667635,"ownerCount":621,"contractAddress":"0xa81a6bbf12d3187e60640b0fe91df136b9935382","fullName":"Nintendo"}],"nft_items":811,"oversupply_minting":null,"nft_name":"Nintendo","github_url":null,"website_url":"https://dailys.top","telegram_url":null,"sales_24h":0,"create_block_number":14602651}};
  expect(parseResponseSecurityCheckNFT(data)).toStrictEqual([]);
  
  data.result.restricted_approval="1";
  data.result.transfer_without_approval={value: "1"};
  data.result.self_destruct={value: "1"};
  expect(parseResponseSecurityCheckNFT(data)).toStrictEqual([
    "Contract Owner can transfer other accounts' NFTs without permission!",
    "Contract can  self destruct, destroying all assets!",
    "Contract restricts trading, cannot be traded on regular exchanges",
  ]);

  data.result.restricted_approval="0";
  data.result.oversupply_minting="1";
  data.result.privileged_burn={value: "1"};
  data.result.transfer_without_approval={};
  data.result.self_destruct={};
  expect(parseResponseSecurityCheckNFT(data)).toStrictEqual([
    "Contract Owner can burn other accounts' NFTs!",
    "Contract Owner can mint more than the claimed supply, which will drive value down",  ]);
});