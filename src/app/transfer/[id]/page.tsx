"use client";
import getConfig from "@/utils/api/getConfig";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Transfer() {
  const [config, setConfig] = useState(null);
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    if (!id) return;
    getConfig(id as string).then((data) => {
      setConfig(data);
    });
  }, [id]);

  return <div>{config && <WormholeConnect config={config} />}</div>;
}

export default Transfer;
