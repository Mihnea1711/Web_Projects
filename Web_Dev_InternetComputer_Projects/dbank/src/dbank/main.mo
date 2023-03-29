import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

actor DBank {
  stable var startTime = Time.now();
  startTime := Time.now();

  stable var currentValue: Float = 300.9188;   //<= variable (changeble)>
  currentValue := 300;

  //let id = 9494848;  //<= constant>

  public func topUp(amount: Float) {
    currentValue += amount;
    Debug.print(debug_show(currentValue));
  };

  public func withdraw(amount: Float) {
    let tempValue: Float = currentValue - amount;
    if(tempValue >= 0) {
      currentValue -= amount;
      Debug.print(debug_show(currentValue));
    } else {
      Debug.print("Not enough funds to withdraw..");
    }
  };
  
  public query func checkBalance(): async Float {
    return currentValue;
  };

  public func compound() {
    let currentTime = Time.now();
    let timeElapsedSec = (currentTime - startTime) / 1000000000;

    currentValue := currentValue * (1.000001 ** Float.fromInt(timeElapsedSec));

    startTime := currentTime;
  };

};