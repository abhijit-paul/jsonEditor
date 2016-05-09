schema = {
	"$schema": "http://json-schema.org/draft-04/schema#",
	"title": "Tunnels",
	"type": "array",
	"minItems": 1,
	"items": {
		"title": "Tunnel",
		"type": "object",
		"required": [
			"type",
			"name",
			"listenAddress",
			"listenPort"
		],
		"__propertiesDisplayOrder": [
			"name",
			"type",
			"listenAddress",
			"listenPort",
			"certificate",
			"ciphers"
		],
		"additionalProperties": false,
		"properties": {
			"type": {
				"title": "Type",
				"description": "Tunnels are instances of server-side transport/application protocol stacks in PCG. Configure the type of tunnel based on the desired application/transport protocol.",
				"default": "HTTP",
				"enum": [
					"HTTP",
					"SMTP",
					"SFTP"
				]
			},
			"name": {
				"title": "Name",
				"description": "Unique identifying name for the tunnel.",
				"type": "string"
			},
			"description": {
				"title": "Description",
				"description": "Any free form descriptive text of users choosing for annotating the tunnel.",
				"type": "string",
				"__control": "textarea"
			},
			"listenAddress": {
				"title": "Address",
				"description": "Listener binding IP address, hostname or NIC name; use 0.0.0.0 to listen on all NICs.",
				"type": "string"
			},
			"listenPort": {
				"title": "Port",
				"description": "A Tunnel represents the server-side in client/server communication. This setting configures the listening port number for Tunnel.",
				"type": "integer"
			},
			"certificate": {
				"title": "Certificate",
				"description": "Select a SSL/TLS certificate to secure this tunnel. This is mandatory for SFTP; and secures HTTP or SMTP on provision.",
				"type": "string",
				"default": "<Not Specified>",
				"__control": "select",
				"__reference": "getCertFileNames"
			},
			"ciphers": {
				"title": "OpenSSL Cipher Lists",
				"description": "The ciphers command converts textual OpenSSL cipher lists into ordered SSL cipher preference lists. It should be a string in the OpenSSL cipher list format. For more information visit https://openssl.org/docs/manmaster/apps/ciphers.html",
				"type": "string",
				"default": "ALL:!aNULL:!ADH:!eNULL:!LOW:!EXP:RC4+RSA:+HIGH:+MEDIUM:-SSLv2"
			}
		}
	}
};