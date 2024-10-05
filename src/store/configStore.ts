import { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import { create } from "zustand";

// Define the shape of your store
interface DeploymentConfigStore {
  activeDeploymentConfig: WormholeConnectConfig | null;
  setActiveDeploymentConfig: (config: WormholeConnectConfig | null) => void;
  updateStatus: (status: "pending" | "deployed" | "failed") => void;
}

// Create the store
export const useConfigStore = create<DeploymentConfigStore>((set) => ({
  activeDeploymentConfig: null,
  setActiveDeploymentConfig: (config) =>
    set({ activeDeploymentConfig: config }),
  updateStatus: (status) =>
    set((state) => ({
      activeDeploymentConfig: state.activeDeploymentConfig
        ? { ...state.activeDeploymentConfig, status }
        : null,
    })),
}));
