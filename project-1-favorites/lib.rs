use anchor_lang::prelude::*;

declare_id!("UPzVZQBG7BDYU8y1sWQb7M1RHL2bu9QtYcewDiZuAoY");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8; //every acct in anchor has 8 bytes

#[program] //Anchor provides sensible set defaults
pub mod favorites {
    use super::*;

    pub fn set_favorites(
        context: Context<SetFavorites>, 
        number: u64, 
        color: String, 
        hobbies: Vec<String>,
    ) -> Result<()> {
        msg!("Greetings from {}", context.program_id); //like console.log or println, writes to solana log file
        let user_public_key = context.accounts.user.key();

        msg!("User {user_public_key}'s favorite number is {number}, favorite color is {color}, and favorite hobbies are {hobbies:?}");

        context.accounts.favorites.set_inner( Favorites {
            number,
            color,
            hobbies,
        } );

        Ok(()) //lets calling programs know this was completed successfully
    }
}

//defines what we want written to the blockchain
#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,

    #[max_len(50)]
    pub color: String,

    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}

//  accounts struct
#[derive(Accounts)]
pub struct SetFavorites<'info> {

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Favorites::INIT_SPACE,
        seeds = [b"favorites", user.key().as_ref()], //not a public key
        bump
    )]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}