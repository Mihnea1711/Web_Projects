import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";

actor Token {

    let owner: Principal = Principal.fromText("3bys3-bofl5-vcihi-fxemv-td3kj-mcqrt-qt2bs-hb5uz-4qrr2-ic47z-oae");
    let totalSupply: Nat = 1000000000;
    let symbol: Text = "TÆT";

    private stable var balanceEntries: [(Principal, Nat)] = [];
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);     //<ledger of balances>
    if(balances.size() < 1) {
        balances.put(owner, totalSupply);
    };

    public query func balanceOf(who: Principal): async Nat {
        let balance: Nat = switch (balances.get(who)) {
            case null 0;
            case (?result) result;
        };
        
        return balance;
    };

    public query func getSymbol() : async Text {
        return symbol;
    };

    public shared(msg) func payOut() : async Text {
        if(balances.get(msg.caller) == null) {
            let amount = 10000;
            let result = await transfer(msg.caller, amount);
            return "Claimed";
        } else {
            return "Already Claimed";
        }        
    };

    public shared(msg) func transfer(to: Principal, amount: Nat): async Text {
        let fromBalance = await balanceOf(msg.caller);
        if(fromBalance > amount) {
            let newFromBalance: Nat = fromBalance - amount;
            balances.put(msg.caller, newFromBalance);       //<= updates the balance>

            let toBalance = await balanceOf(to);
            let newToBalance: Nat = toBalance + amount;
            balances.put(to, newToBalance);

            return "Amount transferred successfully..";
        } else {
            return "Insufficient funds..";
        }        
    };

    system func preupgrade() {
        balanceEntries := Iter.toArray(balances.entries());
    };

    system func postupgrade() {
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
        if(balances.size() < 1) {
            balances.put(owner, totalSupply);
        }
    };
};
