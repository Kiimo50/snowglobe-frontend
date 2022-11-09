# Curio Snow Globes

## Getting Started

Before you begin development you will need to create a `.env` file in BOTH the root directory and `hardhat` directories using the `DOTENV_TEMPLATE.txt` as a guide. To complete these you will need an API key from both https://www.alchemy.com/ and https://www.infura.io/. These can just be free/development keys.

The development environment is configured for ease to run using [Docker Compose](https://docs.docker.com/compose/install/). You can however just run things locally if preferred.

## Development

To setup using Docker run the following commands:
`docker-compose up`

This will result in two containers launching. One is a Hardhat node running on port 8545. You can connect to this via MetaMask using the 'localhost' network. The second is a node container which will serve the Web UI via: http://localhost:8000/

In a separate terminal tab run:
`docker-compose run --no-deps --rm hardhat-node npx hardhat --network docker run setup.js`

This will unpause the contract and claim a number of test mints to the first 3 Hardhat test wallets.

## Build

Once development is complete you can run the following command to build the production version of the site:

`docker-compose run --no-deps --rm web npm run build `

The contents of the `public` folder can then be published.

## Go Live

Prior to Go Live we will need to swap the `src/data/claims.json` with the live claims.