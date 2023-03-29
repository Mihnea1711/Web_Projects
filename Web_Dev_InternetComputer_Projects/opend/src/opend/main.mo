import Cycles "mo:base/ExperimentalCycles";
import NFTActorClass "../NFT/nft";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

actor OpenD {

    private type Listing = {
        itemOwner: Principal;
        itemPrice: Nat;
    };

    var nftsMap = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    var ownersMap = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    var listingsMap = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

    public shared(msg) func mint(imageData: [Nat8], name: Text): async Principal {
        let owner: Principal = msg.caller;

        Cycles.add(100_500_000_000);        // adds cycles from current canister to the next one created..
        let newNFT = await NFTActorClass.NFT(name, owner, imageData);

        let newNFTPrincipal = await newNFT.getCanisterID();

        nftsMap.put(newNFTPrincipal, newNFT);
        addToOwnershipMap(owner, newNFTPrincipal);

        return newNFTPrincipal;
    };

    private func addToOwnershipMap(owner: Principal, nftId: Principal) {
        var ownedNFTs: List.List<Principal> = switch (ownersMap.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result;
        };

        ownedNFTs := List.push(nftId, ownedNFTs);
        ownersMap.put(owner, ownedNFTs);
    };

    public query func getOwnedNFTs(user: Principal): async [Principal] {
        var ownedNFTs: List.List<Principal> = switch (ownersMap.get(user)) {
            case null List.nil<Principal>();
            case (?result) result;
        };

        return List.toArray(ownedNFTs);
    };

    public query func getListedNFTs(): async [Principal] {
        let listingIDs = Iter.toArray(listingsMap.keys());
        return listingIDs;
    };

    public shared(msg) func listItem(id: Principal, price: Nat): async Text {
        var item: NFTActorClass.NFT = switch (nftsMap.get(id)) {
            case null return "NFT does not exist..";
            case (?result) result;
        };

        let owner = await item.getOwner();
        if(Principal.equal(owner, msg.caller)) {
            let newListing: Listing = {
                itemOwner = owner;
                itemPrice = price;
            };
            listingsMap.put(id, newListing);
            return "Listing Success";
        } else {
            return "You don't own the NFT."
        }
    };

    public query func getOpenDCanisterID(): async Principal {
        return Principal.fromActor(OpenD);
    };

    public query func isListed(id: Principal): async Bool {
        if(listingsMap.get(id) == null) {
            return false;
        } else {
            return true;
        }
    };

    public query func getOriginalOwner(id: Principal): async Principal {
        var listing: Listing = switch(listingsMap.get(id)) {
            case null return Principal.fromText("");
            case (?result) result;
        };

        return listing.itemOwner;
    };

    public query func getListedNFTPrice(id: Principal): async Nat {
        var listing: Listing = switch(listingsMap.get(id)) {
            case null return 0;
            case (?result) result;
        };
        
        return listing.itemPrice;
    };

    public shared(msg) func completePurchase(id: Principal, ownerID: Principal, newOwnerID: Principal): async Text {
        var purchasedNFT: NFTActorClass.NFT = switch(nftsMap.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };

        let transferResult = await purchasedNFT.transferOwnership(newOwnerID);
        if (transferResult == "Transfer Success") {
            listingsMap.delete(id);
            var ownedNFTs: List.List<Principal> = switch (ownersMap.get(ownerID)) {
                case null List.nil<Principal>();
                case (?result) result;
            };
            ownedNFTs := List.filter(ownedNFTs, func (listItemId: Principal) : Bool {
                return listItemId != id;
            });

            addToOwnershipMap(newOwnerID, id);

            return "Success";
        } else {
            return transferResult;
        };        
    };
};
