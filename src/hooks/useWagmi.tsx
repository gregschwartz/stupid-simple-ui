import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
//import { Web3Modal } from "@web3modal/react";
import { useMemo, useState } from "react";
import { configureChains, createClient /*, WagmiConfig */ } from "wagmi";
import { goerli, arbitrum, mainnet, polygon } from "wagmi/chains";

export const useWagmi = () => {
  const [chains, setChains] = useState([])
  const [wagmiClient, setWagmiClient] = useState<any>()
  const [ethereumClient, setEthereumClient] = useState<any>()

  useMemo(() => {
    const chains = [goerli, mainnet, arbitrum, polygon];
    const { provider } = configureChains(chains, [
      walletConnectProvider({ projectId: "6469fc0f92c76b3fb593c78ff3fd92c7" }),
    ]);

    const wagmiClient = createClient({
      autoConnect: true,
      connectors: modalConnectors({
        projectId: "6469fc0f92c76b3fb593c78ff3fd92c7",
        version: "1", //metamask doesnt work with v2
        appName: "web3Modal",
        chains,
      }),
      provider,
    });

    // Web3Modal Ethereum Client
    const ethereumClient = new EthereumClient(wagmiClient, chains);
    /***** WalletConnect end */
    setChains(chains);
    setWagmiClient(wagmiClient);
    setEthereumClient(ethereumClient);
  },[]);

  return {
    chains,
    wagmiClient,
    ethereumClient
  }
}