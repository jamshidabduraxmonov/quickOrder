import {collection, query, onSnapshot, orderBy, addDoc, doc, deleteDoc} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import { db } from './firebase.js';


const StaffDashboard = () => {
    const [orders, setOrders] = useState([]); // No_1 state
    const [data, setData] = useState([]);
    console.log('Total Orders: ', orders);

    useEffect(() => {
        const ordersCollection = collection(db, 'orders');

        const q = query(ordersCollection, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot)=> {
            let tempOrders = [];
            snapshot.forEach((doc) => {
                const realData = doc.data();
                tempOrders.push({id: doc.id, ...realData});
             });
            setOrders(tempOrders);


         });

        return() => unsubscribe();
    }, []);


    useEffect(() => {
        const productsCollection = collection(db, 'products');
        const unsubscribe2 = onSnapshot(productsCollection, (snapshot) => {
            let tempProducts = [];
            snapshot.forEach((doc)=> {
                const realData = doc.data();
                tempProducts.push({id: doc.id, ...realData});
                setData(tempProducts);
            });
        });

        return() => unsubscribe2();
    }, [])


    async function handleDelete(productId) {
        const docRef = doc(db, 'products', productId);
        await deleteDoc(docRef);
    }





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

                                    if (!foundProduct) {
                                        return <p key={productId}>[Deleted Item] x {quantity}</p>
                                    }

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



            <div className="product-management">
                
                <h2>Product Management</h2>

                {
                    data.map(sandwich => {
                        const name = sandwich.name;
                        const code = sandwich.code;
                        const price = sandwich.price;


                        return(

                            <div key={sandwich.id}>
                                <p key={name}>{name}</p>
                                <p key={code}>{code}</p>
                                <p>{price}</p>
                                <button>Edit</button>
                                <button onClick={()=> handleDelete(sandwich.id)}>Remove</button>
                            </div>
                            
                        )
                    })
                }
            </div>
        </div>
    );
};

export default StaffDashboard;
