import * as customChains from "@morpho-org/uikit/lib/chains";
import type { Chain, HttpTransportConfig } from "viem";
import {
  CreateConnectorFn,
  createConfig as createWagmiConfig,
  fallback,
  http,
  injected,
  unstable_connector,
  type Transport,
} from "wagmi";
import {
  arbitrum,
  base,
  corn,
  etherlink,
  flame,
  fraxtal,
  hemi,
  ink,
  lisk,
  mainnet,
  mode as modeMainnet,
  optimism,
  plumeMainnet,
  polygon,
  scroll as scrollMainnet,
  soneium,
  sonic,
  unichain,
  worldchain,
} from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

const httpConfig: HttpTransportConfig = {
  retryDelay: 0,
  timeout: 30_000,
};

function createFallbackTransport(rpcs: ({ url: string } & HttpTransportConfig)[]) {
  return fallback(
    [
      ...rpcs.map((rpc) => http(rpc.url, { ...httpConfig, ...(({ url, ...rest }) => rest)(rpc) })),
      unstable_connector(injected, { key: "injected", name: "Injected", retryCount: 0 }),
    ],
    { retryCount: 6, retryDelay: 100 },
  );
}

const chains = [
  // full support
  mainnet,
  base,
  etherlink,
  polygon,
  unichain,
  customChains.katana,
  // lite support (alphabetical)
  arbitrum,
  // NOTE: Camp is disabled because RPC rate limits are too strict
  // customChains.basecamp,
  corn,
  flame,
  fraxtal,
  hemi,
  customChains.hyperevm,
  ink,
  lisk,
  modeMainnet,
  optimism,
  plumeMainnet,
  scrollMainnet,
  soneium,
  sonic,
  customChains.tac,
  worldchain,
] as const;

const transports: Record<(typeof chains)[number]["id"], Transport> = {
  [mainnet.id]: createFallbackTransport([
    { url: "https://rpc.mevblocker.io", batch: { batchSize: 10 } },
    { url: "https://rpc.ankr.com/eth", batch: { batchSize: 10 } },
    { url: "https://eth-pokt.nodies.app", batch: false },
    { url: "https://eth.drpc.org", batch: false },
    { url: "https://eth.merkle.io", batch: false },
  ]),
  [base.id]: createFallbackTransport([
    { url: "https://base.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://base.drpc.org", batch: false },
    { url: "https://mainnet.base.org", batch: { batchSize: 10 } },
    { url: "https://base.lava.build", batch: false },
  ]),
  [ink.id]: createFallbackTransport([
    { url: "https://ink.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://rpc-gel.inkonchain.com", batch: false },
    { url: "https://rpc-qnd.inkonchain.com", batch: false },
    { url: "https://ink.drpc.org", batch: false },
  ]),
  [optimism.id]: createFallbackTransport([
    { url: "https://optimism.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://op-pokt.nodies.app", batch: { batchSize: 10 } },
    { url: "https://optimism.drpc.org", batch: false },
    { url: "https://optimism.lava.build", batch: false },
  ]),
  [etherlink.id]: createFallbackTransport([
    { url: "https://node.mainnet.etherlink.com", batch: { batchSize: 10 } },
    { url: "https://rpc.ankr.com/etherlink_mainnet", batch: { batchSize: 10 } },
  ]),
  [arbitrum.id]: createFallbackTransport([
    { url: "https://arbitrum.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://rpc.ankr.com/arbitrum", batch: { batchSize: 10 } },
    { url: "https://arbitrum.drpc.org", batch: false },
  ]),
  [polygon.id]: createFallbackTransport([
    { url: "https://polygon.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://polygon.drpc.org", batch: false },
  ]),
  [plumeMainnet.id]: createFallbackTransport([{ url: "https://rpc.plume.org", batch: false }]),
  [unichain.id]: createFallbackTransport([
    { url: "https://unichain.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://mainnet.unichain.org", batch: false },
    { url: "https://unichain.drpc.org", batch: false },
  ]),
  [worldchain.id]: createFallbackTransport([
    { url: "https://worldchain-mainnet.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://worldchain.drpc.org", batch: false },
  ]),
  [scrollMainnet.id]: createFallbackTransport([
    { url: "https://scroll-mainnet.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://rpc.ankr.com/scroll", batch: false },
    { url: "https://scroll.drpc.org", batch: false },
  ]),
  [fraxtal.id]: createFallbackTransport([
    { url: "https://fraxtal.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://fraxtal.drpc.org", batch: false },
  ]),
  [sonic.id]: createFallbackTransport([
    { url: "https://sonic.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://rpc.soniclabs.com", batch: false },
    { url: "https://rpc.ankr.com/sonic_mainnet", batch: false },
    { url: "https://sonic.drpc.org", batch: false },
  ]),
  [corn.id]: createFallbackTransport([
    { url: "https://corn.gateway.tenderly.co", batch: { batchSize: 10 } },
    { url: "https://mainnet.corn-rpc.com", batch: false },
    { url: "https://maizenet-rpc.usecorn.com", batch: false },
    { url: "https://rpc.ankr.com/corn_maizenet", batch: false },
  ]),
  [modeMainnet.id]: createFallbackTransport([
    { url: "https://mode.gateway.tenderly.co", batch: false },
    { url: "https://mainnet.mode.network", batch: false },
    { url: "https://mode.drpc.org", batch: false },
  ]),
  [hemi.id]: createFallbackTransport([{ url: "https://rpc.hemi.network/rpc", batch: false }]),
  [flame.id]: createFallbackTransport(flame.rpcUrls.default.http.map((url) => ({ url, batch: false }))),
  [lisk.id]: createFallbackTransport([
    { url: "https://lisk.gateway.tenderly.co", batch: { batchSize: 10 } },
    ...lisk.rpcUrls.default.http.map((url) => ({ url, batch: false })),
  ]),
  [soneium.id]: createFallbackTransport([
    { url: "https://soneium.gateway.tenderly.co", batch: { batchSize: 10 } },
    ...soneium.rpcUrls.default.http.map((url) => ({ url, batch: false })),
  ]),
  [customChains.hyperevm.id]: createFallbackTransport(
    customChains.hyperevm.rpcUrls.default.http.map((url) => ({ url, batch: false })),
  ),
  [customChains.katana.id]: createFallbackTransport([
    { url: "https://katana.gateway.tenderly.co", batch: { batchSize: 10 } },
    ...customChains.katana.rpcUrls.default.http.map((url) => ({ url, batch: false })),
  ]),
  [customChains.tac.id]: createFallbackTransport([
    {
      url: `https://v1-indexer.marble.live/rpc/${customChains.tac.id}`,
      batch: false,
      methods: { include: ["eth_getLogs"] },
    },
    ...customChains.tac.rpcUrls.default.http.map((url) => ({ url, batch: false })),
  ]),
  // [customChains.basecamp.id]: createFallbackTransport(
  //   customChains.basecamp.rpcUrls.default.http.map((url) => ({ url, batch: false })),
  // ),
};

export function createConfig(args: {
  chains?: readonly [Chain, ...Chain[]];
  transports?: { [k: number]: Transport };
  connectors?: CreateConnectorFn[];
}) {
  return createWagmiConfig({
    chains: args.chains ?? chains,
    transports: args.transports ?? transports,
    connectors:
      args.connectors ??
      (import.meta.env.VITE_WALLET_KIT_PROJECT_ID
        ? [injected({ shimDisconnect: true }), walletConnect({ projectId: import.meta.env.VITE_WALLET_KIT_PROJECT_ID })]
        : [injected({ shimDisconnect: true })]),
    batch: {
      multicall: {
        batchSize: 2048,
        wait: 100,
      },
    },
    cacheTime: 250,
    pollingInterval: 4000,
  });
}
