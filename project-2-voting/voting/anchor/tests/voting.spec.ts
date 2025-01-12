import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Voting } from '../target/types/voting'
import { startAnchor } from 'anchor-bankrun'
import { BankrunProvider } from 'anchor-bankrun'

const IDL = require("project-2-voting\voting\anchor\target\idl\voting.json");
const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

describe('Voting', () => {
  // Configure the client to use the local cluster.

  it('Initialize Poll', async () => {
    const context = await startAnchor("", [{name: "voting", programId: votingAddress}], []); //because tests are local, leave first param as blank str
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Voting>(
      IDL,
      provider,
    );

    await votingProgram.methods.initialize_poll(
        new anchor.BN(1),
        "What is your favorite type of peanut butter?",
        new anchor.BN(0),
        new anchor.BN(1836646607),
    ).rpc();

  })
})