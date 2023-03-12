import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

//declare it
//const addFunction = useMutation("contracts:add");
//use it later
//const response = await addFunction(
//   contractName,
//   blockchainName,
//   ownerAddress,
//   JSON.stringify(abiAsJson),
//   contractAddress,
//   contractCode,
//   null,
//   0 //times it has been viewed
// );
export const add = mutation(async ({ db }, name, chainName, ownerAddress, contractAbi, contractAddress, contractCode, themeId, themeNameForWalletConnect, numViews) => {
  return await db.insert('contracts', {
    name,
    chainName,
    ownerAddress,
    contractAbi,
    contractAddress,
    contractCode,
    themeId,
    themeNameForWalletConnect,
    numViews
  });
});

/*
  declare it
    const getFunction = useQuery("themes:get");

  use it later
    const response = await getFunction(id);
*/
export const get = query(async ({ db }, contractId) => {
  const id = new Id("contracts", contractId);
  return await db.get(id);
});

//no longer needed but keep it around
export const getBy = query(async ({ db }, chainName: string, contractAddress: string) => {
  return await db
  .query("contracts")
  .withIndex("by_contract_address", q =>
  q
  .eq("chainName", chainName)
  .eq("contractAddress", contractAddress)
  )
  .order("desc")
  .collect();
});

// export const incrementNumViews = mutation(async ({ db }, documentId) => {
//   const record = await db.get(documentId);
//   const number = (record.numViews > 0 ? record.numViews : 0) + 1;
//   return await db.patch(documentId, { numViews: number });
// });

export const getAll = query(async ({ db }) => {
  return await db.query('contracts').collect();
});
