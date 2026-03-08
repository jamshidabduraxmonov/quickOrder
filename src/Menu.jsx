import {ProductCard} from './App.jsx';


export const Menu = ({sandwiches, addToTotal, removeFromTotal}) => {
    return(<>
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
    </>)
}