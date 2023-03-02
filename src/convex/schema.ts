import { defineSchema, defineTable, s } from 'convex/schema';

export default defineSchema({
  contracts: defineTable({
    name: s.string(),
    chainName: s.string(),
    ownerAddress: s.string(),
    contractAbi: s.any(),
    contractAddress: s.string(),
    contractCode: s.string(),
    numViews: s.number()
  })
  .index("by_owner_address", ["chainName", "ownerAddress"])
  .index("by_contract_address", ["chainName", "contractAddress"])
  .index("by_owner_address_contract_address", ["chainName", "ownerAddress", "contractAddress"]),
  
  // reactions: defineTable({
  //   pup: s.id('pups'),
  //   type: s.union(
  //     s.literal('heart'),
  //     s.literal('cute'),
  //     s.literal('star_eyes')
  //   ),
  // }),
});
