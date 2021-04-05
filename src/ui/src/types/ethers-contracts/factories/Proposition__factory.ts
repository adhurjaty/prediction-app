/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { Proposition } from "../Proposition";

export class Proposition__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Proposition> {
    return super.deploy(overrides || {}) as Promise<Proposition>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Proposition {
    return super.attach(address) as Proposition;
  }
  connect(signer: Signer): Proposition__factory {
    return super.connect(signer) as Proposition__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Proposition {
    return new Contract(address, _abi, signerOrProvider) as Proposition;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "wager_pool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newMember",
        type: "address",
      },
    ],
    name: "addMember",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "wager",
        type: "uint256",
      },
    ],
    name: "addBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyWager",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060016000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550610476806100776000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806372c4fee5146100515780638ef483eb1461006f578063ca6d56dc1461008d578063cdaba786146100d1575b600080fd5b6100596100ff565b6040518082815260200191505060405180910390f35b610077610105565b6040518082815260200191505060405180910390f35b6100cf600480360360208110156100a357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061020a565b005b6100fd600480360360208110156100e757600080fd5b8101908080359060200190929190505050610322565b005b60025481565b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff166101c5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f43616c6c6572206973206e6f742061206d656d6265720000000000000000000081525060200191505060405180910390fd5b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff166102c8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f43616c6c6572206973206e6f742061206d656d6265720000000000000000000081525060200191505060405180910390fd5b60016000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff166103e0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f43616c6c6572206973206e6f742061206d656d6265720000000000000000000081525060200191505060405180910390fd5b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806002600082825401925050819055505056fea26469706673582212202cfd656ca9067ba07bd5d43fe43e4acb469b754325e20c9e1a782d83063c8e7a64736f6c63430007030033";