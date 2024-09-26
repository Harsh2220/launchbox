import { Ntt } from "@wormhole-foundation/sdk-definitions-ntt";
import { Chain, encoding } from "@wormhole-foundation/sdk";

export type NttContracts = {
    [key in Chain]?: Ntt.Contracts;
};

export const DEVNET_SOL_PRIVATE_KEY = encoding.b58.encode(
    new Uint8Array([15, 72, 28, 71, 169, 31, 85, 87, 7, 34, 201, 28, 141, 128, 5, 223, 57, 8, 77, 225, 51, 242, 237, 152, 27, 238, 100, 13, 15, 161, 64, 151, 211, 16, 235, 218, 119, 127, 45, 165, 132, 75, 102, 184, 69, 49, 32, 178, 68, 250, 13, 246, 129, 28, 49, 25, 68, 37, 48, 85, 207, 48, 118, 122])
);

export const DEVNET_ETH_PRIVATE_KEY =
    "0x705219df84de3c3a4e26163c2b65be6871d5b04dd4507c7cc0306f351ad674c7";

export const TEST_NTT_TOKENS: NttContracts = {
    Solana: {
        token: "vMTbSqZZNv7UCKB9mhXJARittB1yD1jnKSKkTuTMkCG",
        manager: "VnTzEc4B8RBfJ9Arw3mwod2HTXakH85rrJL3TxTh3d2",
        transceiver: {
            wormhole: "ErYH6fAu21vYyeZXz4CtwQbUhbf55FwLuo2wshHKRarp",
        },
    },
    Bsc: {
        token: "0xf771Fd35eB85ba622Cf98d81DaC12e135eC1e8Ca",
        manager: "0xC07995099aEB8ce3a93B0293dF38c0c3B3385B56",
        transceiver: { wormhole: "0x54C92F576000cDd306f632167BF6800d6eD08502" },
    },
};