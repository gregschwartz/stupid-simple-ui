"If you're building products in web3, you spend 20% of the time writing the smart contract, and 80% of the time doing the damn frontend!"
- [Austin Griffith](https://youtu.be/Q9LC5bS0Ghw?t=372)

# Stupid Simple UI - Automagic UI for Smart Contracts

At ETHDenver the most requested teammate was Front End Developer. In general, most smart contract developers don't know front-end development, and they shouldn't have to. 

So meet StupidSimpleUI: an automagical UI builder for smart contracts. 

- Provide your smart contract.
- We make and host a beautiful customizable UI that you can immediately share.
- No need to learn React, web hosting, domain management, or even CSS!

## Steps

1. Input contract details
2. Connect your wallet to publish
3. Share your new UI!

## Presentation
https://drive.google.com/file/d/1hXAHlFCoIlkXnXv4xlslKyUPrKXeW2a9/view



## Set Up And Start

1. Run `npm install` to get the packages.

2. Create `.env.local` with:
  ````
  REACT_APP_ALCHEMY_API_KEY=
  REACT_APP_ALCHEMY_URL=
  REACT_APP_CONVEX_URL=
  ````

3. Run: `npm run start`. This starts the server and the Convex database system at the same time, using `concurrently`.

  It will open [http://localhost:3000](http://localhost:3000), but you can load it manually if need be.

## Building On Vercel
Command should be `npm run prodBuild`
