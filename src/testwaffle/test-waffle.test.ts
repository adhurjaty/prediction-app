import {expect, use} from 'chai';
import {Contract} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';

import Proposition from '../build/Proposition.json';
import EqualAnteProposition from '../build/EqualAnteProposition.json';

use(solidity);

describe('Proposition', () => {
  const [deployer, nonmember, newmember] = new MockProvider().getWallets();
  let prop: Contract;

  beforeEach(async () => {
    prop = await deployContract(deployer, Proposition, ["Test",1000,1000]);
  });

//   it('Assigns initial balance', async () => {
//     expect(await token.balanceOf(wallet.address)).to.equal(1000);
//   });

//   it('Transfer adds amount to destination account', async () => {
//     await token.transfer(walletTo.address, 7);
//     expect(await token.balanceOf(walletTo.address)).to.equal(7);
//   });

//   it('Transfer emits event', async () => {
//     await expect(token.transfer(walletTo.address, 7))
//       .to.emit(token, 'Transfer')
//       .withArgs(wallet.address, walletTo.address, 7);
//   });

  it('Deployer wager is initially zero', async () => {
    expect(await prop.getMyBet()).to.equal(0);
  });

  it('Deployer is able to wager', async () => {
    expect(await prop.getMyBet()).to.equal(0);
    await prop.wager(1000);
    expect(await prop.getMyBet()).to.equal(1000);
  });

//   it('Can not transfer from empty account', async () => {
//     const tokenFromOtherWallet = token.connect(walletTo);
//     await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
//       .to.be.reverted;
//   });

//   it('Calls totalSupply on BasicToken contract', async () => {
//     await token.totalSupply();
//     expect('totalSupply').to.be.calledOnContract(token);
//   });

//   it('Calls balanceOf with sender address on BasicToken contract', async () => {
//     await token.balanceOf(wallet.address);
//     expect('balanceOf').to.be.calledOnContractWith(token, [wallet.address]);
//   });
});

describe('EqualAnteProposition', () => {
  const [deployer, nonmember, newmember] = new MockProvider().getWallets();
  let prop: Contract;

  beforeEach(async () => {
    prop = await deployContract(deployer, EqualAnteProposition, ["Test",1000,1000]);
  });

  it('Deployer is able to wager', async () => {
    expect(await prop.getMyBet()).to.equal(0);
    await prop['wager()']();
    expect(await prop.getMyBet()).to.equal(1);
  });

  it('Non-member is not able to wager', async () => {
    const prop_nonmember = prop.connect(nonmember)
    await expect(prop_nonmember['wager()']()).to.be.reverted;
  });

  it('Deployer is able to add a member', async () => {
    expect(await prop.checkMembership(newmember.address)).to.equal(false);
    await prop.addMember(newmember.address);
    expect(await prop.checkMembership(newmember.address)).to.equal(true);
  });

  it('Member is not able to wager more than 1', async () => {
    await expect(prop['wager(uint256)'](1000)).to.be.reverted;
  });
});