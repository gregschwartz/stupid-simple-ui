async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const weiAmount = await deployer.getBalance();
  const depositAmount = weiAmount.div(10);
  console.log("Account balance:", (await ethers.utils.formatEther(weiAmount)));

  let name = "GregGuestBook";
  let factory = await ethers.getContractFactory("GregGuestBook");
  let contract = await factory.deploy();
  console.log("Deployed ", name, " to address:", contract.address);

  name = "GregToken";
  factory = await ethers.getContractFactory(name);
  contract = await factory.deploy();
  console.log("Deployed ", name, " to address:", contract.address);
  
  name = "Faucet";
  factory = await ethers.getContractFactory(name);
  contract = await factory.deploy({value: depositAmount});
  console.log("Deployed ", name, " to address:", contract.address, " with amount ", await ethers.utils.formatEther(depositAmount));
  
  name = "Escrow";
  factory = await ethers.getContractFactory(name);
  contract = await factory.deploy( 
    "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec", //arbiter: bapic
    [ //beneficiaries
      "0xaDD95228501c0769b1047975faf93FC798C4E76C", //Adrian
      "0x636D0fD59463464D4635d98408d9Fe07096a2452", //oscar
      "0xBDE1EAE59cE082505bB73fedBa56252b1b9C60Ce", //vanes
    ],
    {value: depositAmount}
  );
  console.log("Deployed ", name, " to address:", contract.address, " with amount ", await ethers.utils.formatEther(depositAmount));  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
