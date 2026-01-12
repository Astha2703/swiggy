
// Mock data for restaurants, cuisines, and menu items
const cuisines = [
  'South Indian','North Indian','Chinese','Pizza','Biryani','Burgers','Desserts','Beverages','Healthy','Street Food'
];

const restaurants = [
  { id:'r1', name:'Madras Masala', rating:4.6, ratingsCount:1200, deliveryTime:25, costForTwo:350,
    cuisines:['South Indian','Healthy'], veg:true, promoted:true,
    imageUrl:'https://images.unsplash.com/photo-1604908176997-4f5b44f1af7d?q=80&w=1200&auto=format&fit=crop' },
  { id:'r2', name:'Bombay Biryani Co.', rating:4.4, ratingsCount:950, deliveryTime:32, costForTwo:500,
    cuisines:['Biryani','North Indian'], veg:false, promoted:false,
    imageUrl:'https://images.unsplash.com/photo-1625944526153-16e23320ed77?q=80&w=1200&auto=format&fit=crop' },
  { id:'r3', name:'Dragon Wok', rating:4.2, ratingsCount:780, deliveryTime:28, costForTwo:450,
    cuisines:['Chinese','Street Food'], veg:false, promoted:false,
    imageUrl:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop' },
  { id:'r4', name:'Slice of Heaven', rating:4.5, ratingsCount:1100, deliveryTime:30, costForTwo:600,
    cuisines:['Pizza','Desserts'], veg:true, promoted:true,
    imageUrl:'https://images.unsplash.com/photo-1548365328-8b0d3f846b03?q=80&w=1200&auto=format&fit=crop' },
  { id:'r5', name:'Burger Barn', rating:4.1, ratingsCount:640, deliveryTime:22, costForTwo:400,
    cuisines:['Burgers','Beverages'], veg:false, promoted:false,
    imageUrl:'https://images.unsplash.com/photo-1561758033-d89a0be1b3f6?q=80&w=1200&auto=format&fit=crop' },
  { id:'r6', name:'Sweet Tooth', rating:4.7, ratingsCount:1600, deliveryTime:20, costForTwo:300,
    cuisines:['Desserts','Beverages'], veg:true, promoted:true,
    imageUrl:'https://images.unsplash.com/photo-1511690731539-5a1a10f3f257?q=80&w=1200&auto=format&fit=crop' },
  { id:'r7', name:'Green Bowl', rating:4.3, ratingsCount:510, deliveryTime:24, costForTwo:420,
    cuisines:['Healthy','Salads'], veg:true, promoted:false,
    imageUrl:'https://images.unsplash.com/photo-1523182821563-1b1bf3fe8cb7?q=80&w=1200&auto=format&fit=crop' },
  { id:'r8', name:'Kart Street', rating:4.0, ratingsCount:430, deliveryTime:18, costForTwo:250,
    cuisines:['Street Food','Chinese'], veg:false, promoted:false,
    imageUrl:'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1200&auto=format&fit=crop' }
];

const menus = {
  r1:[
    {id:'m1', name:'Ghee Roast Dosa', price:120, veg:true, desc:'Crispy dosa with ghee and chutneys'},
    {id:'m2', name:'Mini Idli Sambar', price:100, veg:true, desc:'Soft idlis dunked in sambar'},
    {id:'m3', name:'Filter Coffee', price:60, veg:true, desc:'Authentic Kaapi'}
  ],
  r2:[
    {id:'m4', name:'Chicken Dum Biryani', price:240, veg:false, desc:'Aromatic long-grain rice with chicken'},
    {id:'m5', name:'Veg Hyderabadi Biryani', price:200, veg:true, desc:'Flavourful and fragrant'},
    {id:'m6', name:'Raita', price:40, veg:true, desc:'Cooling yogurt side'}
  ],
  r3:[
    {id:'m7', name:'Hakka Noodles', price:160, veg:true, desc:'Stir-fried noodles'},
    {id:'m8', name:'Chicken Manchurian', price:180, veg:false, desc:'Tangy and saucy'},
    {id:'m9', name:'Spring Rolls', price:140, veg:true, desc:'Crispy veg rolls'}
  ],
  r4:[
    {id:'m10', name:'Margherita Pizza', price:260, veg:true, desc:'Classic with basil'},
    {id:'m11', name:'Paneer Tikka Pizza', price:320, veg:true, desc:'Smoky paneer topping'},
    {id:'m12', name:'Chocolate Lava Cake', price:150, veg:true, desc:'Gooey dessert'}
  ],
  r5:[
    {id:'m13', name:'Classic Beef Burger', price:220, veg:false, desc:'Juicy patty'},
    {id:'m14', name:'Crispy Veg Burger', price:180, veg:true, desc:'Crunchy and tasty'},
    {id:'m15', name:'Cold Coffee', price:90, veg:true, desc:'Chilled and sweet'}
  ],
  r6:[
    {id:'m16', name:'Blueberry Cheesecake', price:220, veg:true, desc:'Rich and creamy'},
    {id:'m17', name:'Brownie Sundae', price:180, veg:true, desc:'Warm brownie with ice-cream'},
    {id:'m18', name:'Strawberry Milkshake', price:120, veg:true, desc:'Fresh strawberries'}
  ],
  r7:[
    {id:'m19', name:'Quinoa Salad', price:200, veg:true, desc:'Protein packed'},
    {id:'m20', name:'Grilled Paneer Bowl', price:240, veg:true, desc:'High-protein'},
    {id:'m21', name:'Detox Juice', price:100, veg:true, desc:'Refreshing'}
  ],
  r8:[
    {id:'m22', name:'Pani Puri', price:90, veg:true, desc:'Spicy tangy water balls'},
    {id:'m23', name:'Chicken Momos', price:160, veg:false, desc:'Steamed dumplings'},
    {id:'m24', name:'Masala Soda', price:60, veg:true, desc:'Fizz with spice'}
  ]
};
