import { Blockchain } from "@ton-community/sandbox";
import { EscrowContract } from "../../contracts/EscrowContract";

describe("Escrow Contract", () => {
  it("should handle tgBTC deposits", async () => {
    const blockchain = await Blockchain.create();
    const deployer = await blockchain.treasury("deployer");
    
    const contract = blockchain.openContract(
      await EscrowContract.createFromConfig({/*...*/})
    );

    // Simulate tgBTC transfer
    await contract.sendJettonTransfer(deployer.getSender(), {
      amount: toNano("1"),
      jettonAmount: 1000000n,
      toAddress: contract.address
    });

    const balance = await contract.getBalance(deployer.address);
    expect(balance).toEqual(1000000n);
  });
});
