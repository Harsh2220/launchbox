//@ts-ignore
interface RegisterMigrationRequest {
  token_name: string;
  symbol: string;
  image_url: string;
  decimals: number;
  init_supply: number;
  hub_chain: string;
  new_owner: string;
}

interface MigrateRequest {
  migrationId: string;
  tokenAddress: string;
  name: string;
  hubChain: string;
  isOneWay: boolean;
  solOwnerPubKey: string;
  evmOwnerAddress: string;
}

interface RegisterNewTokenRequest {
  token_name: string;
  symbol: string;
  image_url: string;
  new_owner: string;
}

interface CreateMultichainToken {
  tokenName: string;
  tokenSymbol: string;
  chainNames: string[];
  token_id: string;
}
