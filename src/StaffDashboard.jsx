import {collection, query, onSnapshot} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import { db } from './firebase.js';


const StaffDashboard = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const ordersCollection = collection(db, 'orders');
        const unsubscribe = onSnapshot(ordersCollection, (snapshot)=> {
            console.log("Current orders:", snapshot.docs.length);
         });

        return() => unsubscribe();
    }, []);


    return (
        <div>
            <h1>StaffDashboard</h1>
        </div>
    );
};

export default StaffDashboard;

