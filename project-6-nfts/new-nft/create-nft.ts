import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";
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

const collectionAddress = publicKey("vAVSe66vQgi2EV5smbqkPvupkd97RxQHfsgCyJ5Ufcg"); //umi method, differs from web3 js method of new PublicKey

console.log(`creating NFT...`);

const mint = generateSigner(umi);

const transaction = await createNft(umi, {
    mint,
    name: "Dylan The Destroyer",
    uri: "https://raw.githubusercontent.com/JamesBurnsBacon/solana-developer-bootcamp/refs/heads/main/project-6-nfts/new-nft/test-nft.json",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAddress, 
        verified: false //when we first make it, it's false, changes to true during minting process
    },
})

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi, mint.publicKey);

console.log(`Created NFT! Address is ${getExplorerLink("address", createdNft.mint.publicKey, "devnet")}`);