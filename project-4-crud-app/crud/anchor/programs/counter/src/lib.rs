#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod counter {
    use super::*;

    pub fn create_journal_entry(context: Context<CreateEntry>, title: String, message: String) -> Result<()> {
      let journal_entry = &mut context.accounts.journal_entry;
      journal_entry.owner = *context.accounts.owner.key;
      journal_entry.title = title;
      journal_entry.message = message;
      Ok(())
    }

    pub fn update_journal_entry(context: Context<UpdateEntry>, _title: String, message: String) -> Result<()> {
      let journal_entry = &mut context.accounts.journal_entry;
      journal_entry.message = message;
      
      Ok(())
    }
}

#[derive(accounts)]
#[instruction(title: String)]
pub struct CreateEntry<'info> {
  #[account(
    init,
    seeds = [title.as_bytes(), owner.key().as_ref()], //must have two seeds or more, not just owner
    bump, //needed bc we defined a seed
    space = 8 + JournalEntryState::INIT_SPACE,
    payer = owner,
  )]

  pub journal_entry: Account<'Info, JournalEntryState>,

  #[account(mut)]
  pub owner: Signer<'Info>,

  pub system_program: Program<'Info, System>
}

#[derive(accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
  #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()], //must have two seeds or more, not just owner
    bump, //needed bc we defined a seed
    realloc = 8 + JournalEntryState::INIT_SPACE,
    realloc::payer = owner,
    realloc::zero = true,
  )]

  pub journal_entry: Account<'Info, JournalEntryState>,

  #[account(mut)]
  pub owner: Signer<'Info>,

  pub system_program: Program<'Info, System>
}

#[account]
#[derive(initSpace)]
pub struct JournalEntryState {
  pub owner: Pubkey,
  #[max_len(64)]
  pub title: String,
  #[max_len(1024)]
  pub message: String,
}