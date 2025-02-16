// contracts/EscrowContract.tact
import "@stdlib/deploy";
import "@stdlib/jetton";

// Hybrid escrow supporting tgBTC, Telegram Stars, and Toncoin
contract Escrow with Deployable, JettonReceiver {
    persistent balances: Address -> Int as coins;
    persistent jobRegistry: Address -> Slice as jobs;
    
    init() {
        // Initialize with TON Teleport bridge address
        require(tgBTC_WALLET != null, "TG_BTC_WALLET_NOT_SET");
    }

    receive(msg: Message) {
        // Handle Telegram Stars payments
        if (msg.info.type == MessageType.Comment && msg.info.value > 0) {
            let stars = msg.info.value;
            balances.set(sender, stars + balances.get(sender));
            storeJobMetadata(sender, msg.body);
        }
        
        // Handle tgBTC transfers
        if (msg.jetton == tgBTC_WALLET) {
            let amount = msg.amount;
            balances.set(sender, amount + balances.get(sender));
            storeJobMetadata(sender, msg.comment);
        }
    }

    fun storeJobMetadata(addr: Address, data: Slice) {
        // Store job details in TON Storage
        jobs.set(addr, data);
        send(SendParameters{
            to: TON_STORAGE_ADDRESS,
            value: 0.1 TON,
            body: data
        });
    }

    // DAO-based dispute resolution
    function resolveDispute(jobId: Int, winner: Address) requires validatorQuorum(60) {
        let amount = balances.get(jobId);
        sendCoins(winner, amount);
        emit JobResolved(jobId, winner);
    }
}