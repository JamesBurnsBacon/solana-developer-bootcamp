#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod crud {
    use super::*;

}

#[derive(Accounts)]
pub struct InitializeCrud<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Crud::INIT_SPACE,
  payer = payer
  )]
  pub crud: Account<'info, Crud>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseCrud<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub crud: Account<'info, Crud>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub crud: Account<'info, Crud>,
}

#[account]
#[derive(InitSpace)]
pub struct Crud {
  count: u8,
}
