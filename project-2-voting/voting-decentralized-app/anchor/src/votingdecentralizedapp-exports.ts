// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingdecentralizedappIDL from '../target/idl/votingdecentralizedapp.json'
import type { Votingdecentralizedapp } from '../target/types/votingdecentralizedapp'

// Re-export the generated IDL and type
export { Votingdecentralizedapp, VotingdecentralizedappIDL }

// The programId is imported from the program IDL.
export const VOTINGDECENTRALIZEDAPP_PROGRAM_ID = new PublicKey(VotingdecentralizedappIDL.address)

// This is a helper function to get the Votingdecentralizedapp Anchor program.
export function getVotingdecentralizedappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...VotingdecentralizedappIDL, address: address ? address.toBase58() : VotingdecentralizedappIDL.address } as Votingdecentralizedapp, provider)
}

// This is a helper function to get the program ID for the Votingdecentralizedapp program depending on the cluster.
export function getVotingdecentralizedappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votingdecentralizedapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOTINGDECENTRALIZEDAPP_PROGRAM_ID
  }
}
