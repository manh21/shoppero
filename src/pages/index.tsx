import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <Head>
        <title>My E-Commerce Website</title>
      </Head>
      <div className="banner">
        <Image src="/banner.jpg" alt="Welcome to our store" width={1200} height={400} />
      </div>
      <h1>Featured Products</h1>
      <div className="product-list">
        <div className="product">
          <Image src="/userfiles/product/prod-1.jpg" alt="Product 1" width={200} height={200} />
          <h2>Product 1</h2>
          <p>$29.99</p>
          <button>Add to Cart</button>
        </div>
        <div className="product">
          <Image src="/userfiles/product/prod-2.jpg" alt="Product 2" width={200} height={200} />
          <h2>Product 2</h2>
          <p>$49.99</p>
          <button>Add to Cart</button>
        </div>
        <div className="product">
          <Image src="/userfiles/product/prod-3.jpg" alt="Product 3" width={200} height={200} />
          <h2>Product 3</h2>
          <p>$19.99</p>
          <button>Add to Cart</button>
        </div>
      </div>
    </div>
  )
}
