
export const validateKey = key => {
	const masterKey = "T8j9qBtqG7R3hDfbrVDNR97hFpqbMg3FzxTYJNe8DNTLXnuxSK";
	const secondaryKey = "yYZZZKHzEzrjjwDtCYW9BC5L2kfvzpDcJxZnj93vkk8N2mUF8E";
	const keys = [ masterKey, secondaryKey ];
	if (keys.indexOf(key) === -1) {
		throw "Unauthorized: missing key. Got: " + key;
	}
};