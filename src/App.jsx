import {useState, useEffect} from 'react';
import data from './products.json';
import { db } from './firebase.js';
import {collection, addDoc, serverTimestamp} from 'firebase/firestore';
import StaffDashboard from './StaffDashboard.jsx';

function ProductCard({ name, onAdd, price, onRemove, image, code, id }) {

  const [ count, setCount ] = useState(0);


  function addUp(){
    setCount(count  + 1);
    onAdd(price, id);
    return count;
  }

  function takeDown() {
    if(count > 0){
      setCount(count -1);
      onRemove(price, id);
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




/* To build the confirmation content and switches after 'Confirm' button:
     1. We need a new state called 'isConfirmed' which is initially false
     2. 'Confirm button at the end of the popup
     3. The button sets the 'isConfirmed' to 'true'
     4. if 'isConfirmed' is false, when order button pressed the popup should
              should show the list of products and total price
     5. Else it shows the code of the products.

*/



export default function MainMenu() {

  const [ total, setTotal ] = useState(0);
  const [ itemCount, setItemCount] = useState(0);
  const sandwiches = data;

  const [ cartContents, setCartContents ] = useState({});

  const [ isPopupOpen, setIsPopupOpen ] = useState(false); 

  const [ isConfirmed, setIsConfirmed ] = useState(false);

  const [ isBusy, setIsBusy ] = useState(false);

  const [ orderId, setOrderId] = useState("");

  function addToTotal(price, id) {
    setTotal(total + price);
    setItemCount(itemCount + 1);
    
    // To get the quantity of this code
    const currentQty = cartContents[id] || 0;

    setCartContents({
      ...cartContents,
      [id]: currentQty + 1
    });
  }

  function removeFromTotal(price, id){
    setTotal(total - price);
    setItemCount(itemCount - 1);

    const currentQty = cartContents[id] || 0;

    if(currentQty > 1) {
      let tempContent = {...cartContents};

      tempContent = {...tempContent, 
        [id]: currentQty - 1
      };

      setCartContents(tempContent);

    }else {
      let temp = {...cartContents}
      delete temp[id];
      setCartContents(temp);
    }
  } 



  let codeKeys = Object.keys(cartContents);
   


  const handleOrder = async() => {
    try{
      setIsBusy(true);
      const collectionRef = collection(db, "orders");
      const newOrder = {
        items: cartContents,
        totalPrice: total,
        status: "pending",
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collectionRef, newOrder);
      console.log("Success! Order ID:", docRef.id);
      if(docRef.id) {
        setOrderId(docRef.id);
        setIsConfirmed(true);
      }
    }catch(errors){
        console.error(errors);
        alert("Something went wrong. Please try again or tell the cashier!");
    }finally{
      setIsBusy(false);
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
          id={sandwich.id} 
          />
          
          ))}

          <StaffDashboard />

    </div>
      

  {total > 0 && 
    <div>
      <button className="orderBtn" onClick={() => setIsPopupOpen(true)}>
        Order({itemCount}) - ${total}
      </button>
      <button className="clearBtn" onClick={() => window.location.reload()}>
        Clear All
      </button>
    </div>
  }

  {isPopupOpen === true && 
    
      <div className="popup">
        <div className="popup-box">

          {isConfirmed=== false ? (
            <>
              <button onClick={()=> setIsPopupOpen(false)}>x</button>
              <h3>List of Products</h3>
              {
                codeKeys.map((key)=> {
                  const spcProduct = sandwiches.find((item) => item.id === key);
                  const name = spcProduct.name;
                  const price = spcProduct.price;

                  return(
                    <p key={name}>{name}({cartContents[spcProduct.id]}) - ${price} - ${cartContents[spcProduct.id] * price}</p>
                  )
                })
              }

              <h3>Total: ${total}</h3>

              <button onClick={() => { handleOrder() }} disabled={isBusy}>{isBusy ? "Sending..." : "Comfirm"}</button>
            </>
            
          ) : ( 
            <>
              <button onClick={()=> {setIsPopupOpen(false); window.location.reload()}}>x</button>
              <h3>Order Confirmed</h3>
              <p>Show these codes to the cashier:</p>
              {
                codeKeys.map((codeKey)=> {
                  const spcProduct = sandwiches.find(item => item.id === codeKey);
                  const code = spcProduct.code;

                  return(
                    <p key={spcProduct.id}>{code}({cartContents[spcProduct.id]})</p>
                  )
                })
              }
            </>
          
          )}
            
        </div>
        
      </div>
      
      
  }

  </>

  )
}

