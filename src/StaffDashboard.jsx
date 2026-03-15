import {collection, query, onSnapshot, orderBy, addDoc, doc, deleteDoc} from 'firebase/firestore';
import {useState, useEffect} from 'react';
import { db } from './firebase.js';


const StaffDashboard = () => {
    const [orders, setOrders] = useState([]); // No_1 state
    const [data, setData] = useState([]);

    const [newProduct, setNewProduct] = useState({name: '', price: '', code: ''});

    const [ imageFile, setImageFile ] = useState(null);

    const [ isUploading, setIsUploading ] = useState(false);

    // console.log('Total Orders: ', orders);

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
            });

                setData(tempProducts);

        });

        return() => unsubscribe2();
    }, [])


    async function handleDelete(productId) {
        const docRef = doc(db, 'products', productId);
        await deleteDoc(docRef);
    }

    
    const handleChange = (e) => {
        
        const keyName = e.target.name;
        const val = e.target.value;

        setNewProduct((prev) => ({
            ...prev,
            [keyName]: val
        }));
    }

   const handleAddProduct = async() => {
    // Cloudinary logic ////////////////////////////////////////////////

        if(!imageFile) return alert("Please, select an image first!");

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'Quick_order');

        try {
            // 3. Upload to Cloudinary
            const resp = await fetch("https://api.cloudinary.com/v1_1/dano4bou5/image/upload", {
                method: "POST",
                body: formData
            });
            const fileData = await resp.json();
            console.log("Image Data: ", fileData);
            const imageUrl = fileData.secure_url; // This is the webLink to my photo!
            
            // FireBase/FireStore logic ///////////////////////////////////////

            const collectionRef = collection(db, 'products');

            const docRef= await addDoc(collectionRef,{
                ...newProduct,
                image: imageUrl
            });
            console.log(docRef.id);
            setNewProduct({ name: '', price: '', code: ''});
            setImageFile(null);
            document.getElementById('fileInput').value = "";

            setIsUploading(false);

            alert("Product added successfully!");
        } catch(error) {
            console.error("Upload failed: ", error);
        }








    

    }

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
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


            <div className="create-new">
                <h2>Add New Product</h2>

                <input name="name" value={newProduct.name} onChange={handleChange} className="name" type="text" placeholder='Product name' />
                <input name="price" value={newProduct.price} onChange={handleChange} className="price" type="text" placeholder='Price' />
                <input name="code" value={newProduct.code} onChange={handleChange} className="code" type="text"  placeholder='Code'/>

                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <button disabled={isUploading} onClick={handleAddProduct}>
                    {isUploading ? "Uploading..." : "Add Product"}
                </button>
            
            </div>


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
