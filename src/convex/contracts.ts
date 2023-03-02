import { mutation, query } from './_generated/server';

export const add = mutation(async ({ db }, name, chainName, ownerAddress, contractAbi, contractAddress, contractCode, timesLoaded) => {
  return await db.insert('contracts', {
    name,
    chainName,
    ownerAddress,
    contractAbi,
    contractAddress,
    contractCode,
    timesLoaded
  });
});

export const get = query(async ({ db }) => {
  return await db.query('contracts').collect();
});
