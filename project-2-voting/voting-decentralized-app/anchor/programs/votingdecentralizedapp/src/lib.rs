#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod votingdecentralizedapp {
    use super::*;

  pub fn close(_ctx: Context<CloseVotingdecentralizedapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.votingdecentralizedapp.count = ctx.accounts.votingdecentralizedapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.votingdecentralizedapp.count = ctx.accounts.votingdecentralizedapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVotingdecentralizedapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.votingdecentralizedapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVotingdecentralizedapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Votingdecentralizedapp::INIT_SPACE,
  payer = payer
  )]
  pub votingdecentralizedapp: Account<'info, Votingdecentralizedapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVotingdecentralizedapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub votingdecentralizedapp: Account<'info, Votingdecentralizedapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub votingdecentralizedapp: Account<'info, Votingdecentralizedapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Votingdecentralizedapp {
  count: u8,
}
