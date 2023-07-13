import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

export const WalletContext = createContext<WalletContext>({
  provider: null,
  signer: null,
  signerAddr: "",
  progress: false,
  error: false,
  handleConnect: async () => {},
  isConnected: false,
});

export interface WalletContext {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  signerAddr: string;
  progress: boolean;
  error: boolean;
  handleConnect: () => Promise<void>;
  isConnected: boolean;
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // WEB3
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [signerAddr, setSignerAddr] = useState<string>("");
  const [progress, setProgress] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Function to start setup
  const setup = useCallback(
    async (typeOfSetup: "connect" | "disconnect" | "change") => {
      if (typeOfSetup === "connect" || typeOfSetup === "change") {
        // Handle connecting wallet and contracts
        if (!("ethereum" in window && !!window.ethereum.request)) {
          toast.error("Please install the Metamask extension to continue.");
        } else {
          try {
            setProgress(true);
            setError(false);

            // const [newSignerAddr] = (await window.ethereum.request({
            //   method: "eth_requestAccounts",
            // })) as Array<string>;
            const newSignerAddr = localStorage.getItem("addr");
            setSignerAddr(newSignerAddr ?? "");

            const newProvider = new ethers.providers.Web3Provider(
              window.ethereum
            );
            setProvider(newProvider);

            const newSigner = await newProvider.getSigner();
            setSigner(newSigner);

            // typeOfSetup === "change"
            //   ? toast.success("ACCOUNT CHANGED")
            //   : toast.success("WALLET CONNECTED");
          } catch (e) {
            setError(true);
            console.error("ERROR WHILE SETTING UP WALLET", e);
            toast.error("Your wallet could not be connected! Try again.");
          } finally {
            setProgress(false);
          }
        }
      } else {
        setProvider(null);
        setSigner(null);
        setSignerAddr("");
        toast.error("Your wallet is now disconnected!");
        console.log("WALLET DISCONNECTED");
      }
    },
    [toast]
  );

  // Function that the Connect button will invoke
  const handleConnect = useCallback(async () => {
    try {
      setProgress(true);
      if (localStorage.getItem("addr")) {
        localStorage.removeItem("addr");
        setSignerAddr("");
      } else {
        const accounts = await window.ethereum
          .request({
            method: "wallet_requestPermissions",
            params: [
              {
                eth_accounts: {},
              },
            ],
          })
          .then(() =>
            window.ethereum.request({
              method: "eth_requestAccounts",
            })
          );

        const account = accounts[0];
        localStorage.setItem("addr", account);
        setSignerAddr(account);
      }
    } catch (e: any) {
      if (e.message === "User rejected the request.") {
        toast.error("REQUEST REJECTED");
      }
    } finally {
      setProgress(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Setup provider and signer update listener
  useEffect(() => {
    const handleAccountChange = async () => {
      const [newSignerAddr] = (await window.ethereum?.request({
        method: "eth_accounts",
      })) as Array<string>;

      if (newSignerAddr !== signerAddr) {
        if (!!newSignerAddr && newSignerAddr !== "") {
          // New account was selected
          await setup(signerAddr !== "" ? "change" : "connect");
        } else if (!newSignerAddr || newSignerAddr === "") {
          // All accounts disconnected
          await setup("disconnect");
        }
      }
    };
    window.ethereum?.on("accountsChanged", handleAccountChange);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signerAddr]);

  // Handle wallet pre-connection on page load if wallet is already connected
  useEffect(() => {
    (async () => {
      if ("ethereum" in window) {
        const [newSignerAddr] = (await window.ethereum?.request({
          method: "eth_accounts",
        })) as Array<string>;
        if (!!newSignerAddr && newSignerAddr !== "") {
          // If wallet is pre-connected
          await setup("connect");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        signerAddr,
        progress,
        error,
        handleConnect,
        isConnected: signerAddr !== "",
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
