"use strict";
exports.__esModule = true;
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var helpers_1 = require("@solana-developers/helpers");
var umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
var umi_1 = require("@metaplex-foundation/umi");
var web3_js_1 = require("@solana/web3.js");
var connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
var user = await (0, helpers_1.getKeypairFromFile)(); //unspecified will use the id.json in home dir
await (0, helpers_1.airdropIfRequired)(connection, user.publicKey, 1 * web3_js_1.LAMPORTS_PER_SOL, 0.5 * web3_js_1.LAMPORTS_PER_SOL); //adds devnet sol
console.log("Loaded user", user.publicKey.toBase58());
var umi = (0, umi_bundle_defaults_1.createUmi)(connection.rpcEndpoint);
umi.use((0, mpl_token_metadata_1.mplTokenMetadata)()); //tools we want to use
var umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey); //umi version of user
umi.use((0, umi_1.keypairIdentity)(umiUser));
console.log("Set up Umi instance for user");
var collectionAddress = (0, umi_1.publicKey)("vAVSe66vQgi2EV5smbqkPvupkd97RxQHfsgCyJ5Ufcg"); //umi method, differs from web3 js method of new PublicKey
var nftAddress = (0, umi_1.publicKey)("E4NHykaNFqNuNBScFYAL5qPywcNgKoChzbLjXgTiAxHz");
var transaction = await (0, mpl_token_metadata_1.verifyCollectionV1)(umi, {
    metadata: (0, mpl_token_metadata_1.findMetadataPda)(umi, { mint: nftAddress }),
    collectionMint: collectionAddress,
    authority: umi.identity
});
transaction.sendAndConfirm(umi);
console.log("Verified NFT! Address: ".concat(nftAddress, " as member fo collection ").concat(collectionAddress, "! See explorer at ").concat((0, helpers_1.getExplorerLink)("address", nftAddress, "devnet")));
