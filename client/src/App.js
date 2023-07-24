import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./Components/FileUpload.js";
import Display from "./Components/Display.js";
import Modal from "./Components/Model.js";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  //useeffect is run for 2nd time when the account is set
  useEffect(() => {
    //windows.ethereum is injected by metamask
    //provider is used to connect to the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //loadProvider is a function that loads the provider and sets the account
    const loadProvider = async () => {
      if (provider) {
        //this is used to reload the page when the account is changed
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        //this is the address of the contract that we deployed got from the terminal
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
    <div className="background">
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>Share The File</h1>
        <p className="des">
          This is a decentralized file sharing application. You can upload your files and share them with your friends. 
        </p>
        <p className="account">
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
      </div>
    </>
  );
}

export default App;
