"use client";

import getConfig from "@/utils/api/getConfig";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import BridgeSkelton from "./BridgeSkleton";

const WormholeConnect = dynamic(
  () => import("@wormhole-foundation/wormhole-connect"),
  { ssr: false }
);

interface TransferClientProps {
  id: string;
}

export function TransferClient({ id }: TransferClientProps) {
  const [activeDeploymentConfig, setActiveDeploymentConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConfig(id).then((data) => {
      setActiveDeploymentConfig(data);
      setLoading(false);
    });

    return () => {
      setActiveDeploymentConfig(null);
    };
  }, [id]);

  if (loading) {
    return <div className="my-14">  <BridgeSkelton /></div>
  }

  return (
    <div>
      {activeDeploymentConfig !== null && (
        <WormholeConnect config={activeDeploymentConfig} />
      )}
    </div>
  );
}
