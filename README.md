# Stupid Simple UI

Automatically generate and host a front-end for any Solidity contract!

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

## Coming soon: `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

