import {collection, query, onSnapshot} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import { db } from './firebase.js';
import data from './products.json'


const StaffDashboard = () => {
    const [orders, setOrders] = useState([]); // No_1 state
    const [orderNames, setOrderNames] = useState([]); // No_2 State
    console.log('Total Orders: ', orders);

    useEffect(() => {
        const ordersCollection = collection(db, 'orders');

        const unsubscribe = onSnapshot(ordersCollection, (snapshot)=> {
            let tempOrders = [];
            let allNames = [];
            snapshot.forEach((doc) => {
                const realData = doc.data();
                tempOrders.push({id: doc.id, ...realData});
             });


            tempOrders.forEach((order) => {
                const ids = Object.keys(order.items);
                ids.forEach((keyId) => {
                   const product = data.find(food => food.id == keyId); 
                   allNames.push(product.name);
                   setOrderNames(allNames);
                    }
                );

                   
                });
            
            


         });

        
         


        return() => unsubscribe();
    }, []);






    return (
        <div>
            <h1>StaffDashboard</h1>

            {
                
              orderNames.map((name) => {
                
                return(
                    <p>{name}</p>
                )
              })

                
            }
        </div>
    );
};

export default StaffDashboard;

