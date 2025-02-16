<!-- frontend/src/components/GigCard.svelte -->
<script>
  import { onMount } from 'svelte';
  import { TonConnect } from '@tonconnect/sdk';
  
  // TON Blockchain Data Fetching
  let gigs = [];
  let walletAddress = '';
  
  onMount(async () => {
    // Connect to Telegram Mini-App environment
    const connector = new TonConnect({
      manifestUrl: 'https://platform.ton/tonconnect-manifest.json'
    });
    
    // Fetch gigs from TON Storage
    const response = await fetch('https://ton.storage/gigs');
    gigs = await response.json();
    
    // Initialize TON Wallet connection
    walletAddress = await connector.connect();
  });
  
  // AI-powered gig recommendation
  const recommendGigs = (userProfile) => {
    return gigs.filter(gig => 
      gig.skills.some(skill => userProfile.skills.includes(skill)) &&
      gig.budget <= userProfile.budget * 1.2
    );
  };
</script>

<div class="gig-container">
  {#each recommendGigs($userProfile) as gig}
    <div class="gig-card">
      <h3>{gig.title}</h3>
      <p>Budget: {gig.budget} Stars</p>
      <button on:click={() => handleBid(gig.id)}>
        Bid with {walletAddress.slice(0,6)}...
      </button>
    </div>
  {/each}
</div>

<style>
  .gig-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
</style>