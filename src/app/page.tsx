"use client";

import {
  TransactionId,
  Wormhole,
  amount,
  signSendWait,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/platforms/evm";
import solana from "@wormhole-foundation/sdk/platforms/solana";

import "@wormhole-foundation/sdk-evm-ntt";
import "@wormhole-foundation/sdk-solana-ntt";
import { DEVNET_SOL_PRIVATE_KEY, TEST_NTT_TOKENS } from "@/constants";
import { getEnv, getSigner } from "@/utils/helpers";
import Navbar from "@/components/Navbar";
import ToolTip from "@/components/ToolTip";

export default function Home() {
  async function handle() {
    try {
      const wh = new Wormhole("Testnet", [solana.Platform, evm.Platform], {
        chains: {
          Bsc: {
            rpc: "https://weathered-intensive-energy.bsc-testnet.quiknode.pro/c9e311b4f2541be7fd6bdba1e4df46e884fba39c",
          },
        },
      });
      const src = wh.getChain("Bsc");
      const dst = wh.getChain("Solana");

      const srcSigner = await getSigner(src);
      const dstSigner = await getSigner(dst);

      console.log(srcSigner, dstSigner, "signeres", srcSigner.chain.config.rpc);

      const srcNtt = await src.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[src.chain],
      });
      const dstNtt = await dst.getProtocol("Ntt", {
        ntt: TEST_NTT_TOKENS[dst.chain],
      });

      const amt = amount.units(
        amount.parse("0.01", await srcNtt.getTokenDecimals())
      );

      console.log(amt, "Amount");

      const xfer = () =>
        srcNtt.transfer(srcSigner.address.address, amt, dstSigner.address, {
          queue: false,
          automatic: false,
          gasDropoff: BigInt(0),
        });

      // Initiate the transfer (or set to recoverTxids to complete transfer)
      const txids: TransactionId[] = await signSendWait(
        src,
        xfer(),
        srcSigner.signer
      );

      console.log("Source txs", txids);

      const vaa = await wh.getVaa(
        txids[txids.length - 1]!.txid,
        "Ntt:WormholeTransfer",
        25 * 60 * 1000
      );
      console.log(vaa);

      const dstTxids = await signSendWait(
        dst,
        dstNtt.redeem([vaa!], dstSigner.address.address),
        dstSigner.signer
      );

      console.log("dstTxids", dstTxids);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-landing-bg">
      <div className="h-screen overflow-hidden max-h-screen relative">
        <img
          src="/assets/sphere.png"
          className="absolute -bottom-12 left-0 overflow-hidden opacity-80"
        />
        <Navbar />
        <ToolTip />
        <div className="text-white py-4 px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-7xl font-semibold mb-4 leading-loose font-inter">
            Take your tokens <br />
            from Ethereum -{">"} Solana
          </h1>
          <p className="text-gray-400 leading-loose text-[0.875rem] max-w-3xl mx-auto my-8 font-inter">
            Experience the future of digital transactions with our
            state-of-the-art blockchain technology. Our secure, decentralized
            platform ensures every transaction is transparent, immutable, and
            protected against fraud.
          </p>
          <button className="bg-white text-gray-900 font-semibold py-2 px-12 rounded-full text-md hover:bg-gray-200 transition duration-300 font-inter">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
