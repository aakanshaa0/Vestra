import React from 'react'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import {useContext} from 'react';

const ProductItem = ({id, image, name, price}) => {
    const { currency } = useContext(ShopContext);

    let imgSrc = "";
    if (image && image.length > 0) {
        if (typeof image[0] === "string" && image[0].startsWith("http")) {
            imgSrc = image[0];
        } 
        else if (typeof image[0] === "string" || typeof image[0] === "object") {
            imgSrc = image[0];
        }
    } 
    else {
        imgSrc = "/placeholder.png";
    }

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden'>
                <img className='hover:scale-110 transition ease-in-out' src={imgSrc} alt={name || ''} />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='text-sm font-medium'>{currency} {price}</p>
        </Link>
    )
}

export default ProductItem