// Compound Data Types
// arrays, tuples, slices, and strings (slice string)
// Arrays are homogeneous

fn main(){
    let numbers: [i32; 5] = [1,2,3,4,5];
    println!("Number Array: {:?}", numbers); // the :? (debuggable format) is required to print array elements
    
    let fruits: [&str; 3] = ["Apple", "Banana", "Orange"];
    println!("Fruits Array: {:?}", fruits);
    println!("Fruits Array: {}", fruits[0]); //indexing

    let human = ("Alice", 30, false);
    //let human2: (String, i32, bool) = ("Alicia".to_string(), 22, true);
    println!("Human Tuple: {:?}", human);
    let my_mix_tuple = (-45, 6009, "WEIRD", [1,2,3]);
    println!("my_mix_tuple is: {:?}", my_mix_tuple);

    // Slices: contiguous sequence of elements, [1,2,3]
    let number_slices: &[i32] = &[1,2,3];
    println!("number slices: {:?}", number_slices);

    let animal_slices: &[&str] = &["Lion", "Dog", "Cat"];
    println!("animal slices: {:?}", animal_slices);

    let book_slices: &[&String] = &[&"Genesis".to_string(), &"Exodus".to_string()];
    println!("book slices: {:?}", book_slices);

    // Strings Vs String Slices (&str)
    // Strings are mutable, growable, owned
    let mut stone_cold: String = String::from("The Underworld, "); //stored on heap memory
    stone_cold.push_str("IS FULL OF ZOMBIES");
    println!("Stone Cold Says: {}", stone_cold);
    
    // B- &str (String Slice)
    // are immutable, not owned, references, stored in stack memory
    let string_example: String = String::from("Hello, World!");
    let slice: &str = &string_example[0..5]; //defined which chars
    println!("Slice Value: {}", slice);
}    

// not found in scope error if you run this
// fn print() {
//     println!("SLICE: {}", slice);
// }