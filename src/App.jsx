import {useState, useEffect} from 'react';
import data from './products.json';

function ProductCard({ name, onAdd, price, onRemove, image }) {

  const [ count, setCount ] = useState(0);


  function addUp(){
    setCount(count  + 1);
    onAdd(price);
    return count;
  }

  function takeDown() {
    if(count > 0){
      setCount(count -1);
      onRemove(price);
      return count;
    }
    
  }

  return(
    <div className="product-card">
      <img src={image} alt={name} />
      <div>{name}</div>
      <h3>{count}</h3>
      <h4>{price}</h4>
      <button onClick={() => addUp()}>+</button>
      <button onClick={() => takeDown()}>-</button>
    </div>
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

  function removeFromTotal(price){
    setTotal(total - price);
    setItemCount(itemCount - 1);
  }

 useEffect( () => {
  console.log(`Total: ${total}$ - ${itemCount} products`);
}, [total]);
    
  


  return(

    <>

    <div className="product-grid">
        {sandwiches.map( (sandwich) => (
          <ProductCard 
          name={sandwich.name} 
          price={sandwich.price} 
          key={sandwich.name} 
          onAdd={addToTotal} 
          onRemove={removeFromTotal} 
          image={sandwich.image}/>
          
          ))}
    </div>
      

  {total > 0 && <button className="orderBtn" >Order({itemCount}) - ${total}</button>}

  </>

  )
  
}