import { defineSchema, defineTable, s } from 'convex/schema';

export default defineSchema({
  contracts: defineTable({
    name: s.string(),
    chainName: s.string(),
    ownerAddress: s.string(),
    contractAbi: s.any(),
    contractAddress: s.string(),
    contractCode: s.string(),
    themeId: s.id('themes'),
    themeNameForWalletConnect: s.string(),
    numViews: s.number()
  })
  .index("by_owner_address", ["chainName", "ownerAddress"])
  .index("by_contract_address", ["chainName", "contractAddress"])
  .index("by_owner_address_contract_address", ["chainName", "ownerAddress", "contractAddress"]),
  
  themes: defineTable({
    name: s.string(),
    backgroundColor: s.string(),
    formBackgroundColor: s.string(),
    textColor: s.string(),
    buttonBackgroundColor: s.string(),
    buttonTextColor: s.string()
  })
});
