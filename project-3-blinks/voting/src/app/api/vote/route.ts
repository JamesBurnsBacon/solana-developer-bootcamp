import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Voting } from '../../../../anchor/target/types/voting'
import { AnchorError, BN, Program } from "@coral-xyz/anchor";

const IDL = require('../../../../anchor/target/idl/voting.json');

export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetadata: ActionGetResponse = {
    icon: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-02-homemade-peanut-butter%2Fhomemade-peanut-butter-363",
    title: "Vote for your favorite style of peanut butter",
    description: "Please choose between crunchy and smooth peanut butter",
    label: "Vote",
    links: {
      actions: [
        {
          label: "Vote for Crunchy",
          href: "/api/vote?candidate=Crunchy",
          type: "transaction"
        },
        {
          label: "Vote for Smooth",
          href: "/api/vote?candidate=Smooth",
          type: "transaction"
        },
      ]
    }
  };
  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");

  if (candidate != "Crunchy" && candidate != "Smooth") {
    return new Response("Invalid candidate!", { status: 400, headers: ACTIONS_CORS_HEADERS });
  }
  
  const connection = new Connection("http://127.0.0.1:8899", "confirmed"); //commitment status, confirmed by 6%, finalized by 66% of 31 blocks afterwards
  const program: Program<Voting> = new Program(IDL, {connection});
  const body: ActionPostRequest = await request.json();
  let voter;

  try {
    voter = new PublicKey(body.account);  //if acct is not a publickey, will throw error
  } catch (error) {
    return new Response("Invalid Account", { status: 400, headers: ACTIONS_CORS_HEADERS });
  }

  const instruction = await program.methods
    .vote(candidate, new BN(1))
    .accounts({
      signer: voter,
    })
    .instruction();

  const blockhash = await connection.getLatestBlockhash();  //expire after 150 confirmed blocks, to prevent replay attacks

  const transaction = new Transaction({
    feePayer: voter,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  }).add(instruction);

  const response = await createPostResponse({
    fields: {
      type: "transaction",
      transaction: transaction
    }
  });

  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}