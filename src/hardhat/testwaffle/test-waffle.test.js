"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ethereum_waffle_1 = require("ethereum-waffle");
const Proposition_json_1 = __importDefault(require("../build/Proposition.json"));
const EqualAnteProposition_json_1 = __importDefault(require("../build/EqualAnteProposition.json"));
chai_1.use(ethereum_waffle_1.solidity);
describe('Proposition', () => {
    const [deployer, nonmember, newmember] = new ethereum_waffle_1.MockProvider().getWallets();
    let prop;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        prop = yield ethereum_waffle_1.deployContract(deployer, Proposition_json_1.default, ["Test", 1000, 1000]);
    }));
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
    it('Deployer wager is initially zero', () => __awaiter(void 0, void 0, void 0, function* () {
        chai_1.expect(yield prop.getMyBet()).to.equal(0);
    }));
    it('Deployer is able to wager', () => __awaiter(void 0, void 0, void 0, function* () {
        chai_1.expect(yield prop.getMyBet()).to.equal(0);
        yield prop.wager(1000);
        chai_1.expect(yield prop.getMyBet()).to.equal(1000);
    }));
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
    const [deployer, nonmember, newmember] = new ethereum_waffle_1.MockProvider().getWallets();
    let prop;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        prop = yield ethereum_waffle_1.deployContract(deployer, EqualAnteProposition_json_1.default, ["Test", 1000, 1000]);
    }));
    it('Deployer is able to wager', () => __awaiter(void 0, void 0, void 0, function* () {
        chai_1.expect(yield prop.getMyBet()).to.equal(0);
        yield prop['wager()']();
        chai_1.expect(yield prop.getMyBet()).to.equal(1);
    }));
    it('Non-member is not able to wager', () => __awaiter(void 0, void 0, void 0, function* () {
        const prop_nonmember = prop.connect(nonmember);
        yield chai_1.expect(prop_nonmember['wager()']()).to.be.reverted;
    }));
    it('Deployer is able to add a member', () => __awaiter(void 0, void 0, void 0, function* () {
        chai_1.expect(yield prop.checkMembership(newmember.address)).to.equal(false);
        yield prop.addMember(newmember.address);
        chai_1.expect(yield prop.checkMembership(newmember.address)).to.equal(true);
    }));
    it('Member is not able to wager more than 1', () => __awaiter(void 0, void 0, void 0, function* () {
        yield chai_1.expect(prop['wager(uint256)'](1000)).to.be.reverted;
    }));
});
//# sourceMappingURL=test-waffle.test.js.map