"use client";
import { useConfigStore } from "@/store/configStore";
import getConfig from "@/utils/api/getConfig";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Transfer() {
  const { activeDeploymentConfig, setActiveDeploymentConfig } =
    useConfigStore();
  const { id } = useParams();
  useEffect(() => {
    if (activeDeploymentConfig) return;
    getConfig(id as string).then((data) => {
      setActiveDeploymentConfig(data);
    });
  }, [id]);

  return (
    <div>
      {activeDeploymentConfig && (
        <WormholeConnect config={activeDeploymentConfig} />
      )}
    </div>
  );
}
