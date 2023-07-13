import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { BigNumberish, ethers, utils } from "ethers";
import { TagG } from "../typechain-types";
import { useWallet } from "./WalletProvider";
import { TagG_Addr } from "../utils/const";
import { TagG_ABI } from "../utils/abi";

interface TagGContext {
  deposit: (method: number) => Promise<void>;
  userStatus: boolean;
  progressDeposit: boolean;
  tagGContract: TagG | null;
  tagGContractConn: TagG | null;
}

export const TagGContext = createContext<TagGContext>({
  deposit: async () => {},
  userStatus: false,
  progressDeposit: false,
  tagGContract: null,
  tagGContractConn: null,
});

export const TagGProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected, signerAddr, signer, provider } = useWallet();
  const [tagGContract, settagGContract] = useState<TagG | null>(null);
  const [tagGContractConn, setTagGContractConn] = useState<TagG | null>(null);
  const [progressDeposit, setProgressDeposit] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<boolean>(false);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(0);
  const [threeMonthlyPrice, setThreeMonthlyPrice] = useState<number>(0);
  const [yearlyPrice, setYearlyPrice] = useState<number>(0);

  // CONNECT TO CONTRACT
  useEffect(() => {
    if (!!signer && !!provider) {
      const newtagGContract = new ethers.Contract(
        TagG_Addr,
        TagG_ABI,
        provider
      ) as unknown as TagG;
      settagGContract(newtagGContract);
      const newtagGContractConn = newtagGContract.connect(signer);
      setTagGContractConn(newtagGContractConn);
    } else {
      settagGContract(null);
      setTagGContractConn(null);
    }
  }, [signer, provider]);

  useEffect(() => {
    (async () => {
      if (!!tagGContract && !!signerAddr && signerAddr !== "") {
        console.log("here");
        // const monthly = await tagGContract.monthly();
        // console.log("hre", utils.formatEther(monthly));
        // const status = await tagGContract.getStatus(signerAddr);
        // setUserStatus(status);
        // // setMonthlyPrice(monthly);
        // const thMonthly = await tagGContract.threeMonthly();
        // // setThreeMonthlyPrice(thMonthly);
        // const yearly = await tagGContract.yearly();
        // setYearlyPrice(yearly);
      }
    })();
  }, [tagGContract, signerAddr]);

  // Function to mint new tagG
  const deposit = useCallback(
    async (mothod: number) => {
      // if (isConnected && !!tagGContractConn) {
      //   try {
      //     setProgressDeposit(true);
      //     const txnCreatetagG = await tagGContractConn.deposit(method, {
      //       value: parseEther ? parseEther("0.1"),
      //     });
      //     await txnCreatetagG.wait();
      //     const tokenId = await tagGContractConn.getNewTokenId();
      //     const { data, status } = await axios.get(`/api/createtagGImage`, {
      //       params: {
      //         tokenId: tokenId.toString(),
      //       },
      //       responseType: "json",
      //     });
      //     if (status !== 200) {
      //       throw new Error("Error while creating tagG image on server");
      //     } else {
      //       const cid = data.message;
      //       const txnSetNewTokenURI = await tagGContractConn.setNewTokenURI(
      //         `ipfs://${cid}`
      //       );
      //       await txnSetNewTokenURI.wait();
      //       setNumOftagGsOwned((prev) => BigNumber.from(prev.add(1)));
      //       settagGsMintedNum((prev) => BigNumber.from(prev.add(1)));
      //       toast({
      //         title: "MINTED",
      //         description: "You have successfully minted a tagG!",
      //         status: "success",
      //       });
      //     }
      //   } catch (e) {
      //     dev.error(e);
      //     toast({
      //       title: "ERROR",
      //       description: "An unexpected error occured while trying to purchase!",
      //       status: "error",
      //     });
      //   } finally {
      //     setProgressDeposit(false);
      //   }
      // } else {
      //   toast({
      //     title: "WALLET NOT CONNECTED",
      //     description: "You need to connect your wallet first before purchasing!",
      //     status: "error",
      //   });
      // }
    },
    [tagGContractConn, isConnected, toast]
  );

  return (
    <TagGContext.Provider
      value={{
        deposit,
        userStatus,
        progressDeposit,
        tagGContract,
        tagGContractConn,
      }}
    >
      {children}
    </TagGContext.Provider>
  );
};

export const useTagG = () => {
  return useContext(TagGContext);
};
