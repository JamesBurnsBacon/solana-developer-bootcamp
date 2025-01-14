import { findMetadataPda, mplTokenMetadata, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
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
const nftAddress = publicKey("E4NHykaNFqNuNBScFYAL5qPywcNgKoChzbLjXgTiAxHz");

const transaction = await verifyCollectionV1(umi, {
    metadata: findMetadataPda(umi, { mint: nftAddress }),
    collectionMint: collectionAddress,
    authority: umi.identity
})

transaction.sendAndConfirm(umi);

console.log(`Verified NFT! Address: ${nftAddress} as member fo collection ${collectionAddress}! See explorer at ${getExplorerLink(
    "address",
    nftAddress,
    "devnet"
)}`)