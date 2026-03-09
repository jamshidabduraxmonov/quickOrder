import {collection, query, onSnapshot, orderBy} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import { db } from './firebase.js';
import data from './products.json'


const StaffDashboard = () => {
    const [orders, setOrders] = useState([]); // No_1 state
    const [orderNames, setOrderNames] = useState([]); // No_2 State
    console.log('Total Orders: ', orders);

    useEffect(() => {
        const ordersCollection = collection(db, 'orders');

        const q = query(ordersCollection, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot)=> {
            let tempOrders = [];
            let allNames = [];
            snapshot.forEach((doc) => {
                const realData = doc.data();
                tempOrders.push({id: doc.id, ...realData});
                setOrders(tempOrders);
             });

            
            


         });

        
         


        return() => unsubscribe();
    }, []);






    return (
        <div>
            <h1>StaffDashboard</h1>

            
            {
                orders.map( order =>{
                    const itemsMap = order.items;

                    const productIds = Object.keys(itemsMap);

                    return (
                        <div key={order.id} className="order-card">
                            <h2>Order #{order.id.slice(-3)}</h2>
                            {
                                productIds.map(productId => {
                                    const foundProduct = data.find(product => product.id == productId);
                                    const quantity = itemsMap[productId]
                                    return(
                                        <p key={productId}>{foundProduct.name} x {quantity}</p>
                                    )
                                })

                                
                            }

                            <footer>{order.createdAt?.toDate().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) || 'Loading...' }</footer>
                        </div>
                    )
                })
             
            }
        </div>
    );
};

export default StaffDashboard;
