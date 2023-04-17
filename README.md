## Getting Started

First, run the development server:

```bash
node discord.js

You will need to follow the instrucitons for adding bots to your environment from https://discordjs.guide/.

The commands with descriptions will show up to users in the form of "/" commands.

Create config.json and include this line, with your bot ID that is generated from discord.
{
	"token": "your-token-goes-here"
}

Things you will want to change in kadena.js:
    * NetworkId configuration for your chain and testnet or mainnet(I've added a mainnet example)
    * chainId specify your chain
    * endpoint an example was provided for testnet and mainnet
    * contract with your smart contract name in discord.js
    * review every command in discord.js and configure them for your contract calls

Feel free to use this code however you please, hit me up on telegram or discord if you have any questions.