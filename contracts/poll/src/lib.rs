#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, Map, Symbol, Address, log};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Votes,
    Voters,
    Admin,
    Options,
}

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    /// Initialize the poll with admin and voting options
    pub fn initialize(env: Env, admin: Address, options: soroban_sdk::Vec<Symbol>) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();

        let mut votes: Map<Symbol, u32> = Map::new(&env);
        for option in options.iter() {
            votes.set(option.clone(), 0);
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Votes, &votes);
        env.storage().instance().set(&DataKey::Options, &options);

        let voters: Map<Address, Symbol> = Map::new(&env);
        env.storage().instance().set(&DataKey::Voters, &voters);

        log!(&env, "Poll initialized with {} options", options.len());
    }

    /// Cast a vote — each address can only vote once
    pub fn vote(env: Env, voter: Address, option: Symbol) {
        voter.require_auth();

        let mut voters: Map<Address, Symbol> = env
            .storage().instance().get(&DataKey::Voters).expect("not initialized");

        if voters.contains_key(voter.clone()) {
            panic!("already voted");
        }

        let mut votes: Map<Symbol, u32> = env
            .storage().instance().get(&DataKey::Votes).expect("not initialized");

        let current = votes.get(option.clone()).unwrap_or(0);
        votes.set(option.clone(), current + 1);
        voters.set(voter.clone(), option.clone());

        env.storage().instance().set(&DataKey::Votes, &votes);
        env.storage().instance().set(&DataKey::Voters, &voters);

        // Emit event for real-time tracking
        env.events().publish((symbol_short!("vote"),), (voter, option, current + 1));
    }

    /// Read current vote tallies (free, no gas)
    pub fn get_votes(env: Env) -> Map<Symbol, u32> {
        env.storage().instance().get(&DataKey::Votes).expect("not initialized")
    }

    /// Check if an address has already voted
    pub fn has_voted(env: Env, voter: Address) -> bool {
        let voters: Map<Address, Symbol> = env
            .storage().instance().get(&DataKey::Voters).unwrap_or(Map::new(&env));
        voters.contains_key(voter)
    }

    /// Get total number of votes cast
    pub fn total_votes(env: Env) -> u32 {
        let votes: Map<Symbol, u32> = env
            .storage().instance().get(&DataKey::Votes).expect("not initialized");
        let mut total: u32 = 0;
        for (_, count) in votes.iter() { total += count; }
        total
    }
}