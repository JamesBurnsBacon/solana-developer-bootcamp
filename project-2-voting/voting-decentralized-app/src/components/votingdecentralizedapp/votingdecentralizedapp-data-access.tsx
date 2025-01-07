'use client'

import { getVotingdecentralizedappProgram, getVotingdecentralizedappProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useVotingdecentralizedappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingdecentralizedappProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getVotingdecentralizedappProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['votingdecentralizedapp', 'all', { cluster }],
    queryFn: () => program.account.votingdecentralizedapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['votingdecentralizedapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ votingdecentralizedapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotingdecentralizedappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotingdecentralizedappProgram()

  const accountQuery = useQuery({
    queryKey: ['votingdecentralizedapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.votingdecentralizedapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['votingdecentralizedapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ votingdecentralizedapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['votingdecentralizedapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ votingdecentralizedapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['votingdecentralizedapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ votingdecentralizedapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['votingdecentralizedapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ votingdecentralizedapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
