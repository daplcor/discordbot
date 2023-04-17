const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { pactFetchLocal, handleError } = require('./kadena');
const { token } = require('./config.json');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember,
		Partials.Reaction,
	],
});

const contract = 'free.ku-create';

client.login(token);

client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	await client.application.commands.set([
		{
			name: 'allminted',
			description: 'Get all minted NFTs',
		},
		{
			name: 'allrevealed',
			description: 'Get all revealed NFTs',
		},
		{
			name: 'owned',
			description: 'Get owned NFTs by account',
			options: [
				{
					name: 'account',
					type: 3,
					description: 'The account to get owned NFTs for',
					required: true,
				},
			],
		},
		{
			name: 'collection',
			description: 'Get NFT collection details by collection name',
			options: [
				{
					name: 'collection_name',
					type: 3,
					description: 'The collection name to get details for',
					required: true,
				},
			],
		},
	]);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	try {
		if (commandName === 'allminted') {
			console.log('Calling /allminted command');
			const response = await pactFetchLocal(`(${contract}.get-all-nft)`);
			interaction.reply(`All minted NFTs: ${JSON.stringify(response)}`);
		}
		else if (commandName === 'allrevealed') {
			console.log('Calling /allrevealed command');
			const response = await pactFetchLocal(`(${contract}.get-all-revealed)`);
			interaction.reply(`All revealed NFTs: ${JSON.stringify(response)}`);
		}
		else if (commandName === 'owned') {
			console.log('Calling /owned command');
			const account = interaction.options.getString('account');
			const response = await pactFetchLocal(`(${contract}.get-owned "${account}")`);
			interaction.reply(`Owned NFTs: ${JSON.stringify(response)}`);
		}
		else if (commandName === 'collection') {
			console.log('Calling /collection command');
			const collectionName = interaction.options.getString('collection_name');
			const response = await pactFetchLocal(`(${contract}.get-nft-collection "${collectionName}")`);
			const { name, description, category, creator, totalSupply } = response;
			const remainingMint = totalSupply.int - (response.currentIndex.int + 1);

			const replyMessage = `Collection Details:
            - Name: ${name}
            - Description: ${description}
            - Category: ${category}
            - Creator: ${creator}
            - Total Supply: ${totalSupply.int}
            - Remaining Mint: ${remainingMint}`;

			interaction.reply(replyMessage);
		}
		else {
			console.log(`Command not recognized: ${commandName}`);
		}
	}
	catch (error) {
		const errorMessage = handleError(error);
		interaction.reply({ content: `Error: ${errorMessage}`, ephemeral: true });
	}
});

