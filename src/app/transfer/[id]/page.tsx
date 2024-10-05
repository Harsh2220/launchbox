"use client";
import getConfig from "@/utils/api/getConfig";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Transfer() {
  const [config, setConfig] = useState(null);
  const params = useParams();

  const { id } = useRouter<{ id: string }>();

  useEffect(() => {
    getConfig(id).then((data) => {
      setConfig(data);
    });
  }, []);

  return <div>{config && <WormholeConnect config={config} />}</div>;
}

export default Transfer;
