import React, {useState} from "react";
import {token, canisterId, createActor} from "../../../declarations/token";
import {AuthClient} from "@dfinity/auth-client";

function Faucet(props) {

  const [isDisabled, setDisabled] = useState(false);
  const [buttonText, setText] = useState("Gimme Gimme");

  async function handleClick(event) {
    setDisabled(true);

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();

    const auhenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    //for the authentication to work, we need to deploy the project to the live internet computer
    //currently we have 403 error
    //to deploy .. follow steps in read me

    //to stop having the error, delete the the authClient part
                      
                            //..aici era token.payOut() !..
    const result = await auhenticatedCanister.payOut();
    setText(result);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free TÆT tokens here! Claim 10,000 TÆT coins to your account. <br />Account ID: {props.userPrincipal}.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
