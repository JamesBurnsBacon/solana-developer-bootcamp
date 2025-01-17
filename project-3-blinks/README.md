Project 3: Solana Actions and Blinks

Solana Actions are a specification for an API to return a tx on solana that can be previewed, signed, and sent.
Blinks are blockchain links, that allow any website or social media links to be embedded with solana transactions, without taking the user elsewhere.

Actions resemble a typical REST API call. See solana.com/docs/advanced/actions [Solana Docs](https://solana.com/docs/advanced/actions)

Dialect allows us to test the blink: https://dial.to/?action=solana-action:http://localhost:3000/api/vote
In production, you must register solana actions via dialect or others to turn off warnings.

The local RPC setup provided in the bootcamp example is deprecated. Fully testing this code would require a devnet deploy.