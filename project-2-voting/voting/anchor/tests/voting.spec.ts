import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Voting } from '../target/types/voting'
import { startAnchor } from 'anchor-bankrun'
import { BankrunProvider } from 'anchor-bankrun'

const IDL = require("../target/idl/voting.json");
const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

describe('Voting', () => {
  // Configure the client to use the local cluster.

  let context: any;
  let provider: BankrunProvider;
  let votingProgram: Program<Voting>;

  beforeAll(async () => {
    context = await startAnchor("", [{name: "voting", programId: votingAddress}], []); //because tests are local, leave first param as blank str
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider,
    );
  })

  it('Initialize Poll', async () => {

    await votingProgram.methods.initializePoll(
        new anchor.BN(1),
        "What is your favorite type of peanut butter?",
        new anchor.BN(0),
        new anchor.BN(1836646607),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)], //grab buffer from u64
      votingAddress,
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite type of peanut butter?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it("initialize candidate", async() => {

    await votingProgram.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();

    await votingProgram.methods.initializeCandidate(
      "Crunchy",
      new anchor.BN(1),
    ).rpc();

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingAddress,
    )

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
      votingAddress,
    )

    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress);
    const crunchyCandidate = await votingProgram.account.candidate.fetch(crunchyAddress);

    console.log(smoothCandidate);
    console.log(crunchyCandidate);

    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0);
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);

  });

  it("vote", async() => {
    await votingProgram.methods
      .vote(
        "Crunchy",
        new anchor.BN(1)
      )
      .rpc();

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
      votingAddress,
    )

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
      votingAddress,
    )

    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress);
    const crunchyCandidate = await votingProgram.account.candidate.fetch(crunchyAddress);

    console.log(smoothCandidate);
    console.log(crunchyCandidate);

    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(1);
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);
  });
})