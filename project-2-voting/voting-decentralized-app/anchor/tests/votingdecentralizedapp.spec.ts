import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Votingdecentralizedapp} from '../target/types/votingdecentralizedapp'

describe('votingdecentralizedapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votingdecentralizedapp as Program<Votingdecentralizedapp>

  const votingdecentralizedappKeypair = Keypair.generate()

  it('Initialize Votingdecentralizedapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        votingdecentralizedapp: votingdecentralizedappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votingdecentralizedappKeypair])
      .rpc()

    const currentCount = await program.account.votingdecentralizedapp.fetch(votingdecentralizedappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votingdecentralizedapp', async () => {
    await program.methods.increment().accounts({ votingdecentralizedapp: votingdecentralizedappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingdecentralizedapp.fetch(votingdecentralizedappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votingdecentralizedapp Again', async () => {
    await program.methods.increment().accounts({ votingdecentralizedapp: votingdecentralizedappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingdecentralizedapp.fetch(votingdecentralizedappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votingdecentralizedapp', async () => {
    await program.methods.decrement().accounts({ votingdecentralizedapp: votingdecentralizedappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingdecentralizedapp.fetch(votingdecentralizedappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set votingdecentralizedapp value', async () => {
    await program.methods.set(42).accounts({ votingdecentralizedapp: votingdecentralizedappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingdecentralizedapp.fetch(votingdecentralizedappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the votingdecentralizedapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        votingdecentralizedapp: votingdecentralizedappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.votingdecentralizedapp.fetchNullable(votingdecentralizedappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
