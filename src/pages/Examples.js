import './Examples.scss'

export default function Examples() {

  return (
    <div className="exampleList prettyBackground">
      <h2>Examples of UIs so you can see how this works</h2>
      <div>
        <h3>Ethereum Goerli Testnet</h3>
        <ul>
          <li><a href="/contracts/25BTYkHThC6e6_5inHhL3Q">Guestbook</a></li>
          <li><a href="/contracts/dWBVHGxza6GwT5Vh3P1L2g">Escrow</a></li>
          <li><a href="/contracts/M7PGJpZi9HPPpBpnDgxL2g">ERC20 Token</a></li>
        </ul>
      </div>
      <div>
        <h3>Coinbase Base Testnet</h3>
        <ul>
          <li><a href="https://www.stupidsimpleui.com/contracts/ebh5YmN52fDWFOK54oZL3Q">Guestbook</a></li>
        </ul>
      </div>
      <div>
        <h3>Ethereum</h3>
        <ul>
          <li><a href="/contracts/Jy7p21Xy_fKkrz9rZAtL4g">Contract with security issues (100% taxes, can prevent transfers)</a></li>
          <li><a href="/contracts/KLHNuGS5NtryxUjLZL4g">Contract with security issues (honeypot)</a></li>
        </ul>
      </div>
    </div>
  );
}
