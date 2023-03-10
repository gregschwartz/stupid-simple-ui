import './Examples.scss'

function Examples() {
  
  return (
    <div className="exampleList prettyBackground">
      <h2>Examples of UIs so you can see how this works</h2>
      <div>
        <h3>Ethereum Goerli Testnet</h3>
        <ul>
          <li><a href="/contracts/Goerli/0xDB0d5dB07d42D5589230e40c3A51Ac8454D312d3">Guestbook</a></li>
          <li><a href="/contracts/goerli/0xcaFAa9C9662f2a7EaeceD891C039317035286540">Escrow</a></li>
          <li><a href="/contracts/goerli/0xa4e4745a1066ac0faebe4e005793b172c69cc9c4">ERC20 Token</a></li>
        </ul>
      </div>
      <div>
        <h3>Coinbase Base Testnet</h3>
        <ul>
          <li><a href="https://www.stupidsimpleui.com/contracts/Chain%2084531/0x8b2948d486336e9ecAe12D570469D0C62CdcbaC1">Guestbook</a></li>
        </ul>
      </div>
      <div>
        <h3>Ethereum</h3>
        <ul>
          <li><a href="/contracts/Ethereum/0x84FA8f52E437Ac04107EC1768764B2b39287CB3e">Contract with security issues (100% taxes, can prevent transfers)</a></li>
          <li><a href="/contracts/Ethereum/0xE5C26b21F34fbb63f759E82f3fD1A2ea575Ed5D8">Contract with security issues (honeypot)</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Examples;
