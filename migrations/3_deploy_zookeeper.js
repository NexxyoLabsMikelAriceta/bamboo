const Bamboo = artifacts.require('token/BambooToken.sol');
const ZooKeeper = artifacts.require('ZooKeeper.sol')



module.exports = async function (deployer, _network, addresses) {
    let bamboo;
    if (_network === 'live') {
        bamboo = await Bamboo.at('0xf56842Af3B56Fd72d17cB103f92d027bBa912e89');
    }
    else{
        // Deploy BambooToken
        console.log("Deploying Bamboo...")
        await deployer.deploy(Bamboo);
        bamboo = await Bamboo.deployed()
        console.log("Bamboo addr: " + bamboo.address)
    }

    // Deploy ZooKeeper
    console.log("Deploying ZooKeeper...")

    await deployer.deploy(
        ZooKeeper,
        bamboo.address,
        addresses[0],
        web3.utils.toWei('100'),
        1
    );
    const zooKeeper = await ZooKeeper.deployed();
    console.log(zooKeeper.address);
    // Transfer ownership of BambooDeFi Token to ZooKeeper
    await bamboo.proposeOwner(zooKeeper.address);
    await zooKeeper.claimToken(bamboo.address);

    console.log("ZooKeeper deployed!")




};
