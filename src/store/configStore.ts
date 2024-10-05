import { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { create } from "zustand";

interface DeploymentConfigStore {
  activeDeploymentConfig: WormholeConnectConfig | null;
  setActiveDeploymentConfig: (config: WormholeConnectConfig | null) => void;
}

export const useConfigStore = create<DeploymentConfigStore>((set) => ({
  activeDeploymentConfig: null,
  setActiveDeploymentConfig: (config) =>
    set({ activeDeploymentConfig: config }),
}));
