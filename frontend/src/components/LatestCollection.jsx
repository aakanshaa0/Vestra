import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
      setLatestProducts(products.slice(0, 10));
    })

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Lorem ipsum blah blah blah blah textwdh ssfhuesf fhssjf cdsjcj dsjjes fdsjfds fdsufhds sgu fshfh fsdjuds vsdu sddsjh</p>
      </div>
    </div>
  )
}

export default LatestCollection