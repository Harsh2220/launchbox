"use client";
import getConfig from "@/utils/api/getConfig";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { useEffect, useState } from "react";


function Transfer() {

  const [config, setConfig] = useState(null);

  useEffect(() => {
    getConfig("0c41f2f7-614e-4c3c-8bba-3ff5b8bcc1d3").then(data => {
      setConfig(data);
    })
  }, [])

  return (
    <div>
      {
        config && <WormholeConnect config={config} />
      }
    </div>
  );
}

export default Transfer;
