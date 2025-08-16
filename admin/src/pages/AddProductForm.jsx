import React, { useState } from 'react';

const categories = ['Men', 'Women', 'Kids'];
const subCategories = ['Topwear', 'Bottomwear', 'Winterwear'];
const sizesList = ['S', 'M', 'L', 'XL', 'XXL'];

export default function AddProductForm({ onProductAdded }) {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [subCategory, setSubCategory] = useState(subCategories[0]);
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (idx, file) => {
    const newImages = [...images];
    newImages[idx] = file;
    setImages(newImages);
  };

  const handleSizeToggle = (size) => {
    setSizes(sizes => sizes.includes(size) ? sizes.filter(s => s !== size) : [...sizes, size]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach((img, idx) => { if (img) formData.append(`image${idx+1}`, img); });
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('price', price);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('bestSeller', bestSeller);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:3000/api/product/add', {
        method: 'POST',
        body: formData,
        headers: { 'token': token }
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Product added successfully!');
        setName('');
        setDescription('');
        setCategory(categories[0]);
        setSubCategory(subCategories[0]);
        setPrice('');
        setSizes([]);
        setBestSeller(false);
        setImages([null, null, null, null]);
        if (onProductAdded) onProductAdded();
      } else {
        setError(data.message || 'Failed to add product');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit} style={{
      maxWidth: 600,
      margin: '0 auto',
      background: '#f6f8fa',
      padding: 36,
      borderRadius: 16,
      boxShadow: '0 2px 16px rgba(35,39,47,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }}>
      <h2 style={{fontWeight:700, fontSize:28, marginBottom:10, color:'#23272f', textAlign:'center'}}>Add New Product</h2>
      <div style={{display:'flex',gap:12,marginBottom:8, justifyContent:'center'}}>
        {[0,1,2,3].map(idx => (
          <div key={idx} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <input type="file" accept="image/*" onChange={e=>handleImageChange(idx, e.target.files[0])} style={{padding:4, border:'1px solid #ccc', borderRadius:6, background:'#fff'}}/>
            {images[idx] && <span style={{fontSize:10, color:'#888'}}>{images[idx].name}</span>}
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:18}}>
        <div style={{flex:1, display:'flex', flexDirection:'column', gap:10}}>
          <label style={{fontWeight:600}}>Product name</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Type here" required style={{padding:10, borderRadius:6, border:'1px solid #bbb'}}/>
        </div>
        <div style={{flex:1, display:'flex', flexDirection:'column', gap:10}}>
          <label style={{fontWeight:600}}>Product Price</label>
          <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="25" required style={{padding:10, borderRadius:6, border:'1px solid #bbb'}}/>
        </div>
      </div>
      <label style={{fontWeight:600}}>Product description</label>
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Write content here" required style={{padding:10, borderRadius:6, border:'1px solid #bbb'}}/>
      <div style={{display:'flex',gap:18}}>
        <div style={{flex:1, display:'flex', flexDirection:'column', gap:10}}>
          <label style={{fontWeight:600}}>Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} style={{padding:10, borderRadius:6, border:'1px solid #bbb'}}>
            {categories.map(c=>(<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div style={{flex:1, display:'flex', flexDirection:'column', gap:10}}>
          <label style={{fontWeight:600}}>Subcategory</label>
          <select value={subCategory} onChange={e=>setSubCategory(e.target.value)} style={{padding:10, borderRadius:6, border:'1px solid #bbb'}}>
            {subCategories.map(sc=>(<option key={sc} value={sc}>{sc}</option>))}
          </select>
        </div>
      </div>
      <div style={{display:'flex',gap:18,alignItems:'center'}}>
        <label style={{fontWeight:600}}>Sizes:</label>
        <div style={{display:'flex',gap:8}}>
          {sizesList.map(size => (
            <label key={size} style={{display:'flex',alignItems:'center',gap:4,fontWeight:500}}>
              <input type="checkbox" checked={sizes.includes(size)} onChange={()=>handleSizeToggle(size)} />
              {size}
            </label>
          ))}
        </div>
      </div>
      <label style={{display:'flex',alignItems:'center',gap:8,fontWeight:600}}>
        <input type="checkbox" checked={bestSeller} onChange={e=>setBestSeller(e.target.checked)} />
        Add to bestseller
      </label>
      <button type="submit" disabled={loading} style={{marginTop:14,background:'#23272f',color:'#fff',padding:'14px 0',border:'none',borderRadius:8, fontWeight:700, fontSize:18, cursor:'pointer', boxShadow:'0 2px 8px rgba(35,39,47,0.10)'}}>
        {loading ? 'Adding...' : 'ADD PRODUCT'}
      </button>
      {error && <div style={{color:'#d32f2f',marginTop:8, textAlign:'center'}}>{error}</div>}
      {success && <div style={{color:'green',marginTop:8, textAlign:'center'}}>{success}</div>}
    </form>
  );
}
