import { mutation, query } from './_generated/server';

export const add = mutation(async ({ db }, name, chainName, ownerAddress, contractAbi, contractAddress, contractCode, numViews) => {
  return await db.insert('contracts', {
    name,
    chainName,
    ownerAddress,
    contractAbi,
    contractAddress,
    contractCode,
    numViews
  });
});

export const getBy = query(async ({ db }, chainName: string, contractAddress: string) => {
  return await db
  .query("contracts")
  .withIndex("by_contract_address", q =>
  q
  .eq("chainName", chainName)
  .eq("contractAddress", contractAddress)
  )
  .collect();
}); 

export const incrementNumViews = mutation(async ({ db }, documentId) => {
  const record = await db.get(documentId);
  const number = (record.numViews > 0 ? record.numViews : 0) + 1;
  return await db.patch(documentId, { numViews: number });
});

export const get = query(async ({ db }) => {
  return await db.query('contracts').collect();
});
