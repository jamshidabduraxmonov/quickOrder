import {useState, useEffect} from 'react';
import data from './products.json';

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
  const [ itemCount, setItemCount] = useState(0);
  const sandwiches = data;

  function addToTotal(price) {
    setTotal(total + price);
    setItemCount(itemCount + 1);
  }

 useEffect( () => {
  console.log(`Total: ${total}$ - ${itemCount} products`);
}, [total]);
    
  


  return(

    <>
      {sandwiches.map( (sandwich) => (
    <ProductCard name={sandwich.name} price={sandwich.price} key={sandwich.name} onAdd={addToTotal} />
    
    ))}

  {total > 0 && <button className="orderBtn" >Order ({itemCount}) - ${total}</button>}

  </>

  )
  
}