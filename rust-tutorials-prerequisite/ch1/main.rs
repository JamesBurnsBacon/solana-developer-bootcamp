//primitive data types
// int, float, bool, char

// Integer
// Rust has signed (+ and -) and unsigned integer (only +) types of different sizes
// i8, i16, i32, i64, i128: Signed integers
// u8. u16, u32, u64. u128: Unisgned integers
fn main(){
    let x: i32 = -42;
    let y: u64 = 1000;
    println!("Signed Integer: {}", x);
    println!("Unsigned Integer: {}", y);
// diff bet i32 and i64, latter has double the bits
// range:
// i32 - 2147483647 or 2 to the power of 31 in both positive and negative
// i64 - 9223372036854775807 or 2 to the power of 63 in both positive and negative
    let e: i32 = 2147483647;
    let i: i64 = 9223372036854775807;
    println!("i32: {}", e);
    println!("i64: {}", i);

//rust will suggest a workable int type if yours is too large or negative

// Floats
// f32, f64
    let pi: f64 = 3.14159;
    println!("pi: {}", pi);

// Boolean values
// true, false
    let is_snowing: bool = true;
    println!("Is it snowing? {}", is_snowing);

// Char Type -char
    let letter: char = 'a';
    println!("First letter is: {}", letter)
}    