import {useState, useEffect} from 'react';
import data from './products.json';

function ProductCard({ name, onAdd, price, onRemove, image, code }) {

  const [ count, setCount ] = useState(0);


  function addUp(){
    setCount(count  + 1);
    onAdd(price, code);
    return count;
  }

  function takeDown() {
    if(count > 0){
      setCount(count -1);
      onRemove(price, code);
      return count;
    }
    
  }

  return(
    <div className="product-card">
      <img src={image} alt={name} />
      <div>{name}</div>
      <h3>{count}</h3>
      <button onClick={() => addUp()}>+</button>
      <button onClick={() => takeDown()}>-</button>
    </div>
  )

}




export default function MainMenu() {

  const [ total, setTotal ] = useState(0);
  const [ itemCount, setItemCount] = useState(0);
  const sandwiches = data;

  const [ cartContents, setCartContents ] = useState({});

  const [ isPopupOpen, setIsPopupOpen ] = useState(false); 

  function addToTotal(price, code) {
    setTotal(total + price);
    setItemCount(itemCount + 1);
    
    // To get the quantity of this code
    const currentQty = cartContents[code] || 0;

    setCartContents({
      ...cartContents,
      [code]: currentQty + 1
    });
  }

  function removeFromTotal(price, code){
    setTotal(total - price);
    setItemCount(itemCount - 1);

    const currentQty = cartContents[code] || 0;

    if(currentQty > 1) {
      let tempContent = {...cartContents};

      tempContent = {...tempContent, 
        [code]: currentQty - 1
      };

      setCartContents(tempContent);

    }else {
      let temp = {...cartContents}
      delete temp[code];
      setCartContents(temp);
    }
  } 


 useEffect( () => {
  console.log(`Total: ${total}$ - ${itemCount} products`);
}, [total]);

useEffect( () => {
  console.log('The Product code: ', cartContents)
}, [cartContents]);

useEffect( () => {
  console.log("Order Button: ", isPopupOpen);
}, [isPopupOpen]);
    
  


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
          image={sandwich.image}
          code={sandwich.code}  
          />
          
          ))}
    </div>
      

  {total > 0 && 
    <div>
      <button className="orderBtn" onClick={() => setIsPopupOpen(true)} >
        Order({itemCount}) - ${total}
      </button>
      <button className="clearBtn" onClick={() => window.location.reload()}>
        Clear All
      </button>
    </div>
  }

  {isPopupOpen === true && 
      <div>
        <button onClick={()=> setIsPopupOpen(false)}>x</button>
        <h3>Show codes to the cashier and proceed to payment</h3>

      </div>
  }

  </>

  )
}

