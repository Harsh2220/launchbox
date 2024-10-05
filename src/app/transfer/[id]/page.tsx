"use client";

import getConfig from "@/utils/api/getConfig";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Transfer() {
  const [config, setConfig] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    getConfig(id as string).then((data) => {
      setConfig(data);
    });
  }, [id]);

  return <div>{config && <WormholeConnect config={config} />}</div>;
}
