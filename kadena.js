const Pact = require('pact-lang-api');
const endpoint = 'api.testnet';
// const endpoint = 'api'; // Use this for mainnet
const networkId = 'testnet04';
// const networkId = 'mainnet01'; // Use this for mainnet
const chainId = '1';
const NETWORK = `https://${endpoint}.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;

const handleError = (error) => {
	const errorMessage = error?.result?.error?.message
		? JSON.stringify(error?.result?.error?.message)
		: JSON.stringify(error);

	console.error(` ERROR: ${errorMessage}`);

	return errorMessage || 'Unhandled Exception';
};

const creationTime = () => (Math.round(new Date().getTime() / 1000) - 10);


const pactFetchLocal = async (pactCode, options) => {
	console.log('Pact code:', pactCode);

	const data = await Pact.fetch.local(
		{
			pactCode,
			envData: {},
			meta: Pact.lang.mkMeta('', '1', 1e-5, 150000, creationTime(), 600),
			networkId: networkId,
			...options,
		},
		NETWORK,
	);
	console.log('Pact response data:', data);
	if (data.result.status === 'success') {
		return data.result.data;
	}
	else {
		const errorMessage = handleError(data);
		return { errorMessage };
	}
};

module.exports = {
	pactFetchLocal,
	handleError,
};
