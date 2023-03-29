import { dbank } from "../../declarations/dbank";

window.addEventListener("load", async function() {
  update();
});

document.querySelector("form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const button = event.target.querySelector("#submit-btn");
  button.setAttribute("disabled", true);

  const inputAmount = parseFloat(document.getElementById("input-amount").value);
  const outputAmount = parseFloat(document.getElementById("withdraw-amount").value);

  if(document.getElementById("input-amount").value.length != 0) await dbank.topUp(inputAmount);
  if(document.getElementById("withdraw-amount").value.length != 0) await dbank.withdraw(outputAmount);

  await dbank.compound();

  update();

  document.getElementById("input-amount").value = "";
  document.getElementById("withdraw-amount").value = "";

  button.removeAttribute("disabled");
});

// document.querySelector("form #input-amount").addEventListener("click", async function(event) {
//   document.querySelector("form #withdraw-amount").setAttribute("type", "hidden");
// });

async function update() {
  const currentAmount = await dbank.checkBalance();
  document.getElementById("value").innerText = currentAmount.toFixed(2);
}