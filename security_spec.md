# Security Specification for ZapPedidos

## Data Invariants
1. A Store must have a unique slug.
2. Only the owner of a store can modify it.
3. Categories and Products must belong to an existing store.
4. Only the owner of a store can manage its categories and products.
5. Store names must be strings between 3 and 100 characters.
6. WhatsApp numbers must follow a basic pattern string.
7. Prices must be positive numbers.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a store with someone else's `ownerId`.
2. **Slug Hijacking**: Attempt to update another store's slug.
3. **Invalid Price**: Create a product with a negative price.
4. **Invalid Type**: Send a boolean to a string field (e.g., `whatsapp: true`).
5. **Orphaned Product**: Create a product with a `storeId` that doesn't exist.
6. **Shadow Field**: Add `isAdmin: true` to a store document.
7. **Unauthorized Update**: Update a store's `ownerId` to yourself when you didn't own it.
8. **Malicious ID**: Use an ID of 1MB of symbols for a category.
9. **No Auth**: Attempt to write to a collection while not signed in.
10. **Cross-Store Category**: Create a category in Store A with `storeId` pointing to Store B.
11. **Large String**: Sending a 2MB string for the store description.
12. **Future Timestamp**: Setting `createdAt` to a time in the future from the client.

## Test Runner (Conceptual)
Tests will be implemented in `firestore.rules.test.ts` using the Firebase Rules Testing library.
However, in this environment, we focus on generating valid rules and performing a manual logic audit via the "Red Team" process.
