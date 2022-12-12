require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

const { API_URL } = process.env;
if (typeof API_URL == 'undefined') {
  // Make this error a bit more evident. If we don't manually check,
  // the message Hardhat gives isn't that helpful to determine the root cause
  console.error('No API_URL defined!');
  process.exit(1);
}

const FORK_DEPLOY = 16170580; // Shortly after LIVE deployment

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: 'Etherscan API Key',
  },
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
      forking: {
        url: API_URL,
        blockNumber: FORK_DEPLOY,
      },
    },
    local: {
      url: 'http://127.0.0.1:8545',
      forking: {
        url: API_URL,
        blockNumber: FORK_DEPLOY,
      },
    },
    docker: {
      url: 'http://hardhat-node:8545',
    },
    mainnet: {
      chainId: 1,
      url: API_URL,
    },
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 60000,
    slow: 50000,
  },
};
