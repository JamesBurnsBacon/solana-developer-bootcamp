import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile(); //unspecified will use the id.json in home dir
await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL); //adds devnet sol
console.log("Loaded user", user.publicKey.toBase58());
const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata()); //tools we want to use
const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey); //umi version of user
umi.use(keypairIdentity(umiUser));
console.log("Set up Umi instance for user");
const collectionMint = generateSigner(umi); //making a keypair
const transaction = await createNft(umi, {
    mint: collectionMint,
    name: "My Collection",
    symbol: "MC",
    uri: "https://raw.githubusercontent.com/JamesBurnsBacon/solana-developer-bootcamp/refs/heads/main/project-6-nfts/new-nft/test-collection.json",
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true
}); //creates the nft collection
await transaction.sendAndConfirm(umi);
const createdCollectionNft = await fetchDigitalAsset(umi, collectionMint.publicKey);
console.log(`Created Collection MC! Address is ${getExplorerLink("address", createdCollectionNft.mint.publicKey, "devnet")}`);
