// scripts/deploy-contracts.ts
import { compile } from "ton-compiler";
import { Blockchain } from "@ton-community/sandbox";

async function deployEscrow() {
  const blockchain = await Blockchain.create();
  const deployer = await blockchain.treasury("deployer");
  
  // Compile Tact contract
  const escrowCode = await compile("EscrowContract.tact");
  
  // Initialize with TON Teleport parameters
  const contract = blockchain.openContract(
    EscrowContract.createFromConfig({
      tgBTCWallet: "EQCD...39",
      storageAddress: "EQAS...f2",
      daoValidator: "EQDA...o1"
    }, escrowCode)
  );

  await contract.sendDeploy(deployer.getSender(), toNano("0.05"));
  console.log("Contract deployed at:", contract.address);
}

deployEscrow().catch(console.error);
