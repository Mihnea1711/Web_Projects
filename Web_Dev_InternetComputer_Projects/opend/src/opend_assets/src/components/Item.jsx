import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIlFactory } from "../../../declarations/token";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { opend } from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) { 
  const [name, setName] = useState();
  const [owner, setOwner]= useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setShouldDisplay] = useState(true);

  const nftID = props.id;

  const localhost = "http://localhost:8080/";
  const httpAgent = new HttpAgent({host: localhost});
  //TODO: when deploying live, remove this line
  httpAgent.fetchRootKey();
  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent: httpAgent,
      canisterId: nftID
    });

    const name = await NFTActor.getName();
    setName(name);

    const owner = await NFTActor.getOwner();
    setOwner(owner.toText());

    const image = await NFTActor.getImage();
    const imageContent = new Uint8Array(image);
    const imageURL = URL.createObjectURL(new Blob([imageContent.buffer]), {type: "image/png"});
    setImage(imageURL);

    if(props.role == "Collection") {
      const nftIsListed = await opend.isListed(props.id);
      if(nftIsListed) {
        setOwner("OpenD");
        setBlur(
          {
            filter: "blur(4px)"
          }
        );
      setStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text={"Sell"}/>);
      } 
    } else if(props.role == "Discover") {
      const originalOwner = await opend.getOriginalOwner(props.id);
      if(originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text={"Buy"}/>);
      }      

      const price = await opend.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()}/>);
    }       
  };

  useEffect(() => {
    loadNFT();
  }, []);

  let price;
  function handleSell() {
    setPriceInput(
      <input
        placeholder="Price in TÆT"
        type="number"
        className="price-input"
        value={price}
        onChange={(event) => price=event.target.value}
      />
    );
    setButton(<Button handleClick={sellItem} text={"Confirm"}/>)
  };

  async function sellItem() {
    setBlur(
      {
        filter: "blur(4px)"
      }
    );
    setLoaderHidden(false);
    const listingResult = await opend.listItem(props.id, Number(price));
    console.log(listingResult);
    if(listingResult == "Listing Success") {
      const opendID = await opend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(opendID);
      console.log(transferResult);
      if(transferResult == "Transfer Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenD");
        setStatus("Listed");
      }      
    }
  };

  //to see all the results to the buying/selling u must download the project token-local on udemy and follow read-me steps
  //just rewatch last vid (buy nft)
  //everything till last vid is working fine.
  async function handleBuy() {
    console.log("Buy pressed");
    setLoaderHidden(false);
    const tokenActor = await Actor.createActor(tokenIlFactory, {
      agent: httpAgent,
      canisterId: Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"),
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const itemPrice = await opend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, itemPrice);
    console.log(result);
    if(result == "Amount transferred successfully..") {
      //transfer ownership
      let transferResult = await opend.completePurchase(props.id, sellerId, CURRENT_USER_ID);
      console.log(transferResult);
    }
    setLoaderHidden(true);
    setShouldDisplay(false);
  };

  return (
    <div style={{display: shouldDisplay? "inline ": "none"}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus} </span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
