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
    '0x06BCab7137b300dA5A4d0Ce047a71F4e7192c1a3'
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
    107, // Globe #1; Apples
    131, // Globe #2; Nuts
    147, // Globe #3; Berries
    43, // Globe #4; Clay
    36, // Globe #5; Paint
    37, // Globe #6; Ink
    178, // Globe #7; Sculpture
    191, // Globe #8; Painting
    173, // Globe #9; Book
    187, // Globe #10; Future
    191, // Globe #11; BTC Keys
    175, // Globe #12; Mine Bitcoin
    192, // Globe #13; BTC
    42, // Globe #14; CryptoCurrency
    29, // Globe #15; DigitalCash
    43, // Globe #16; Original
    39, // Globe #17; UASF
    38, // Globe #18; To The Moon
    39, // Globe #19; Dogs Trading
    147, // Globe #20; MadBitcoins (Should be 148 - leaving one)
    27, // Globe #21; The Wizard
    27, // Globe #22; The Bard
    27, // Globe #23; The Barbarian
    27, // Globe #24; Complexity
    27, // Globe #25; Passion
    27, // Globe #26; Education
    53, // Globe #27; Blue
    35, // Globe #28; Pink
    27, // Globe #29; Yellow
    78, // Globe #30; Eclipse
    46, // Globe #17b; UASFb
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
