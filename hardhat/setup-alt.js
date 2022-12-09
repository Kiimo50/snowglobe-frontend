const { network, ethers } = require('hardhat');
const curioABI = require('./abi.json');

console.log('starting setup-alt.js');

async function makeClaim(signer, recipient, nonce) {
  let rawMessage = ethers.utils.solidityKeccak256(
    ['string', 'address', 'uint16'],
    ['curioglobe', recipient, nonce]
  );
  return await signer.signMessage(ethers.utils.arrayify(rawMessage));
}

(async () => {
  const [deployer, userA] = await ethers.getSigners();

  CURIOS = await ethers.getContractAt(
    curioABI,
    '0xE642b4c4f4be390cADfb6E3f9d50F740F7A04E56'
  );
  console.log(`CURIOS Live: ${CURIOS.address}`);

  let owner = await CURIOS.owner();

  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [owner],
  });
  let ownerSigner = await ethers.provider.getSigner(owner);

  await CURIOS.connect(ownerSigner).transferOwnership(deployer.address);
  console.log(`Change Ownership: ${deployer.address}`);

  // Change Signer Address
  await CURIOS.changeClaimSigner(deployer.address);
  console.log('Update signer address');

  // Unpause
  await CURIOS.unpause();
  console.log('Curios unpaused');

  // Claim Almost Everything
  let specials = [
    0, // Globe #0; Raccoon Supply not Tracked here
    111, // Globe #1; Apples
    135, // Globe #2; Nuts
    151, // Globe #3; Berries
    47, // Globe #4; Clay
    40, // Globe #5; Paint
    41, // Globe #6; Ink
    182, // Globe #7; Sculpture
    195, // Globe #8; Painting
    177, // Globe #9; Book
    191, // Globe #10; Future
    195, // Globe #11; BTC Keys
    179, // Globe #12; Mine Bitcoin
    196, // Globe #13; BTC
    46, // Globe #14; CryptoCurrency
    33, // Globe #15; DigitalCash
    47, // Globe #16; Original
    43, // Globe #17; UASF
    42, // Globe #18; To The Moon
    43, // Globe #19; Dogs Trading
    151, // Globe #20; MadBitcoins (Should be 152 - leaving one)
    30, // Globe #21; The Wizard
    30, // Globe #22; The Bard
    30, // Globe #23; The Barbarian
    30, // Globe #24; Complexity
    30, // Globe #25; Passion
    30, // Globe #26; Education
    57, // Globe #27; Blue
    39, // Globe #28; Pink
    30, // Globe #29; Yellow
    82, // Globe #30; Eclipse
    50, // Globe #17b; UASFb
  ];

  let nonce = 2;

  for (let i = 1; i < specials.length; i++) {
    for (let s = 0; s < specials[i]; s++) {
      let claim = await makeClaim(deployer, deployer.address, nonce);
      await CURIOS.claim(i, nonce, claim);
      nonce++;
    }
  }
  console.log(`${nonce - 2} Test claims complete`);

  // Usable Claims
  let claims = {};
  claims[deployer.address] = {
    nonce: 0,
    claim: await makeClaim(deployer, deployer.address, 0),
  };
  claims[userA.address] = {
    nonce: 1,
    claim: await makeClaim(deployer, userA.address, 1),
  };
  console.log(claims);
})();
