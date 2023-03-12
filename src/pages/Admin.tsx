import './Examples.scss'
import { useQuery } from "../convex/_generated/react";
import { useAccount } from 'wagmi';
import { Web3Button } from "@web3modal/react";

export default function Admin() {
  const { address, isConnected } = useAccount();
  const allowedWalletAddresses = [
    "0xec603fe67485db117456a2de5dd39a35eaff9645", //greg
    "0x9190c66243b6180141a5d613fff05632389fcdec", //Luis
  ];

  //must always be called, can't be conditional
  const contracts = useQuery("contracts:getAll") || [];

  return (
    <div className="exampleList prettyBackground">
      {isConnected && allowedWalletAddresses.indexOf(address.toLowerCase()) !== -1 ? (
        <>
        <h3>All Contracts</h3>
        <ul>          
          {contracts.map((contract) => { 
            return (
              <li><a href={`/contracts/${contract._id.id}`}>{contract.name}</a></li>        
              );
            })}
        </ul>
        </>
      ) : (
        <Web3Button />
      )}
    </div>
  );
}
