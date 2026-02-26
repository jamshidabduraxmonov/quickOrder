import {useState, useEffect} from 'react';


function ProductCard({ name, onAdd, price }) {

  const [ count, setCount ] = useState(0);


  function addUp(){
    setCount(count  + 1);
    onAdd(price);
    return count;
  }

  return(
    <>
    
      <div>{name}</div>
      <h3>{count}</h3>
      <h4>{price}</h4>
      <button onClick={() => addUp()}>+</button>
    </>
  )

}




export default function MainMenu() {

  const [ total, setTotal ] = useState(0);
  const sandwiches = [
    {name: "Turkey Club", price: 5 },
    {name: "Ham Sandwich", price: 6 },
    {name: "Turkey Croissant", price: 7 }
  ];

  function addToTotal(price) {
    setTotal(total + price);
  }

 useEffect( () => {
  console.log(`Total: ${total}$`);
}, [total]);
    
  


  return(

    <>
      {sandwiches.map( (sandwich) => (
    <ProductCard name={sandwich.name} price={sandwich.price} key={sandwich.name} onAdd={addToTotal} />
    
    ))}

  {total > 0 && <button>Order Now!</button>}

  </>

  )
  
}