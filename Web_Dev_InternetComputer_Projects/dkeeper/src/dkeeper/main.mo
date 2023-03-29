import List "mo:base/List";
import Debug "mo:base/Debug";

actor DKepper {
  public type Note = {
    title : Text;
    content : Text;
  };

  stable var notes : List.List<Note> = List.nil<Note>();

  public func createNote(titleText : Text, contentText : Text) {
    let newNote : Note = {
      title = titleText;
      content = contentText;
    };

    notes := List.push(newNote, notes);

    Debug.print(debug_show (notes));
  };

  public query func readNotes() : async [Note] {
    return List.toArray(notes);
  };

  public func removeNote(index : Nat) {
    notes := List.append(List.take(notes, index), List.drop(notes, index + 1));
  };
};
