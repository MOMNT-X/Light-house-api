const fs = require('fs');

const data = [
  {
    "name": "Five Star Bakery",
    "slug": "five-star-bakery",
    "description": "Freshly baked breads and pastries.",
    "category": "Bakery",
    "logoUrl": "/4 Ingredient Chocolate Bread (No Butter or Oil).jfif",
    "bannerUrl": "/4 Ingredient Chocolate Bread (No Butter or Oil).jfif",
    "isActive": true,
    "isOpen": true,
    "deliveryFee": 50000,
    "minOrder": 150000,
    "deliveryRadius": 10.5,
    "categories": [
      {
        "name": "Breads",
        "sortOrder": 1,
        "items": [
          {
            "name": "Mini Loaf",
            "description": "Deliciously made Mini Loaf.",
            "price": 50000,
            "imageUrl": "/mini loaf.jfif"
          },
          {
            "name": "Buns (2 in 1)",
            "description": "Deliciously made Buns (2 in 1).",
            "price": 60000,
            "imageUrl": "/buns.jfif"
          },
          {
            "name": "Medium Loaf",
            "description": "Deliciously made Medium Loaf.",
            "price": 100000,
            "imageUrl": "/medium loaf.jfif"
          },
          {
            "name": "Coconut Bread",
            "description": "Deliciously made Coconut Bread.",
            "price": 130000,
            "imageUrl": "/coconut bread.jfif"
          },
          {
            "name": "Large Loaf",
            "description": "Deliciously made Large Loaf.",
            "price": 130000,
            "imageUrl": "/White Bread.jfif"
          },
          {
            "name": "Xtra-Large Loaf",
            "description": "Deliciously made Xtra-Large Loaf.",
            "price": 150000,
            "imageUrl": "/medium loaf.jfif"
          },
          {
            "name": "Mixed Fruit",
            "description": "Deliciously made Mixed Fruit.",
            "price": 150000,
            "imageUrl": "/4 Ingredient Chocolate Bread (No Butter or Oil).jfif"
          },
          {
            "name": "Sardine Bread",
            "description": "Deliciously made Sardine Bread.",
            "price": 160000,
            "imageUrl": "/sardine bread.jfif"
          }
        ]
      },
      {
        "name": "Choco Mix",
        "sortOrder": 2,
        "items": [
          {
            "name": "Choco Mix (Medium Loaf)",
            "description": "Deliciously made Choco Mix (Medium Loaf).",
            "price": 90000,
            "imageUrl": "/4 Ingredient Chocolate Bread (No Butter or Oil).jfif"
          },
          {
            "name": "Choco Mix (Big Loaf)",
            "description": "Deliciously made Choco Mix (Big Loaf).",
            "price": 140000,
            "imageUrl": "/4 Ingredient Chocolate Bread (No Butter or Oil).jfif"
          }
        ]
      },
      {
        "name": "Milk Bloom",
        "sortOrder": 3,
        "items": [
          {
            "name": "Milk Bloom (Medium Loaf)",
            "description": "Deliciously made Milk Bloom (Medium Loaf).",
            "price": 150000,
            "imageUrl": "/milk bread.jfif"
          },
          {
            "name": "Milk Bloom (Big Loaf)",
            "description": "Deliciously made Milk Bloom (Big Loaf).",
            "price": 200000,
            "imageUrl": "/Easy Milk Bread Loaf.jfif"
          }
        ]
      },
      {
        "name": "Cakes",
        "sortOrder": 4,
        "items": [
          {
            "name": "Single Cupcake",
            "description": "Deliciously made Single Cupcake.",
            "price": 70000,
            "imageUrl": "/cupcake.jfif"
          },
          {
            "name": "Foil Cake",
            "description": "Deliciously made Foil Cake.",
            "price": 150000,
            "imageUrl": "/foil cake.jfif"
          },
          {
            "name": "Pack of 6",
            "description": "Deliciously made Pack of 6.",
            "price": 400000,
            "imageUrl": "/vanilla cupcakes"
          }
        ]
      },
      {
        "name": "Pastries",
        "sortOrder": 5,
        "items": [
          {
            "name": "Fish Pie",
            "description": "Deliciously made Fish Pie.",
            "price": 80000,
            "imageUrl": "/Easy sausage rolls.jfif"
          },
          {
            "name": "Sausage Roll",
            "description": "Deliciously made Sausage Roll.",
            "price": 80000,
            "imageUrl": "/sausage roll.jfif"
          },
          {
            "name": "Meat Pie",
            "description": "Deliciously made Meat Pie.",
            "price": 100000,
            "imageUrl": "/Nigeria meat pie.jfif"
          },
          {
            "name": "Chicken Pie",
            "description": "Deliciously made Chicken Pie.",
            "price": 100000,
            "imageUrl": "/Nigeria meat pie.jfif"
          }
        ]
      },
      {
        "name": "Donuts",
        "sortOrder": 6,
        "items": [
          {
            "name": "Plain and Sugar-Coated Donut",
            "description": "Deliciously made Plain and Sugar-Coated Donut.",
            "price": 80000,
            "imageUrl": "/sugarcoated donut.jfif"
          },
          {
            "name": "Jelly Donut",
            "description": "Deliciously made Jelly Donut.",
            "price": 100000,
            "imageUrl": "/cream-filled donut.jfif"
          },
          {
            "name": "Cream-Filled Donut",
            "description": "Deliciously made Cream-Filled Donut.",
            "price": 110000,
            "imageUrl": "/Nutella Filled Donuts.jfif"
          }
        ]
      }
    ]
  },
  {
    "name": "Choplife Kitchen",
    "slug": "choplife-kitchen",
    "description": "Your favorite local dishes.",
    "category": "Local Food",
    "logoUrl": "/bogaad.svg",
    "bannerUrl": "/Jollof Rice & Chicken.jfif",
    "isActive": true,
    "isOpen": true,
    "deliveryFee": 120000,
    "minOrder": 200000,
    "categories": [
      {
        "name": "Jollof Rice with Chicken/Beef",
        "sortOrder": 1,
        "items": [
          {
            "name": "Big Plate",
            "description": "Deliciously made Big Plate.",
            "price": 330000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          },
          {
            "name": "Small Plate",
            "description": "Deliciously made Small Plate.",
            "price": 280000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          },
          {
            "name": "Big Plate with Egg",
            "description": "Deliciously made Big Plate with Egg.",
            "price": 200000,
            "imageUrl": "/Smoky Asun Jollof Rice.jfif"
          },
          {
            "name": "Small Plate with Egg",
            "description": "Deliciously made Small Plate with Egg.",
            "price": 150000,
            "imageUrl": "/Smoky Asun Jollof Rice.jfif"
          }
        ]
      },
      {
        "name": "Spaghetti with Chicken/Beef",
        "sortOrder": 2,
        "items": [
          {
            "name": "Big Plate",
            "description": "Deliciously made Big Plate.",
            "price": 330000,
            "imageUrl": "/spaghetti.jpeg"
          },
          {
            "name": "Small Plate",
            "description": "Deliciously made Small Plate.",
            "price": 280000,
            "imageUrl": "/spaghetti.jpeg"
          },
          {
            "name": "Big Plate with Egg",
            "description": "Deliciously made Big Plate with Egg.",
            "price": 200000,
            "imageUrl": "/pasta.jfif"
          },
          {
            "name": "Small Plate with Egg",
            "description": "Deliciously made Small Plate with Egg.",
            "price": 150000,
            "imageUrl": "/pasta.jfif"
          }
        ]
      },
      {
        "name": "Rice and Beans with Chicken/Beef",
        "sortOrder": 3,
        "items": [
          {
            "name": "Big Plate",
            "description": "Deliciously made Big Plate.",
            "price": 330000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "Small Plate",
            "description": "Deliciously made Small Plate.",
            "price": 280000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "Big Plate with Egg",
            "description": "Deliciously made Big Plate with Egg.",
            "price": 200000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "Small Plate with Egg",
            "description": "Deliciously made Small Plate with Egg.",
            "price": 150000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          }
        ]
      },
      {
        "name": "Maccaroni with Chicken/Beef",
        "sortOrder": 4,
        "items": [
          {
            "name": "Big Plate",
            "description": "Deliciously made Big Plate.",
            "price": 330000,
            "imageUrl": "/maccaroni.jfif"
          },
          {
            "name": "Small Plate",
            "description": "Deliciously made Small Plate.",
            "price": 280000,
            "imageUrl": "/maccaroni.jfif"
          },
          {
            "name": "Big Plate with Egg",
            "description": "Deliciously made Big Plate with Egg.",
            "price": 200000,
            "imageUrl": "/maccaroni.jfif"
          },
          {
            "name": "Small Plate with Egg",
            "description": "Deliciously made Small Plate with Egg.",
            "price": 150000,
            "imageUrl": "/maccaroni.jfif"
          }
        ]
      },
      {
        "name": "Turkey Meals",
        "sortOrder": 5,
        "items": [
          {
            "name": "Jollof Rice with Turkey (Big)",
            "description": "Deliciously made Jollof Rice with Turkey (Big).",
            "price": 500000,
            "imageUrl": "/Nigeria Jollof and turkey.jfif"
          },
          {
            "name": "Jollof Rice with Turkey (Small)",
            "description": "Deliciously made Jollof Rice with Turkey (Small).",
            "price": 450000,
            "imageUrl": "/Nigeria Jollof and turkey.jfif"
          },
          {
            "name": "Spaghetti with Turkey (Big)",
            "description": "Deliciously made Spaghetti with Turkey (Big).",
            "price": 500000,
            "imageUrl": "/Jollof Spaghetti - KikiFoodies.jfif"
          },
          {
            "name": "Spaghetti with Turkey (Small)",
            "description": "Deliciously made Spaghetti with Turkey (Small).",
            "price": 450000,
            "imageUrl": "/Jollof Spaghetti - KikiFoodies.jfif"
          },
          {
            "name": "Rice and Beans with Turkey (Big)",
            "description": "Deliciously made Rice and Beans with Turkey (Big).",
            "price": 500000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "Rice and Beans with Turkey (Small)",
            "description": "Deliciously made Rice and Beans with Turkey (Small).",
            "price": 450000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "Maccaroni with Turkey (Big)",
            "description": "Deliciously made Maccaroni with Turkey (Big).",
            "price": 500000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Maccaroni with Turkey (Small)",
            "description": "Deliciously made Maccaroni with Turkey (Small).",
            "price": 450000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          }
        ]
      },
      {
        "name": "Noodles",
        "sortOrder": 6,
        "items": [
          {
            "name": "Noodles with Chicken",
            "description": "Deliciously made Noodles with Chicken.",
            "price": 300000,
            "imageUrl": "/noodles.jfif"
          },
          {
            "name": "Noodles with Turkey",
            "description": "Deliciously made Noodles with Turkey.",
            "price": 400000,
            "imageUrl": "/noodles.jfif"
          }
        ]
      }
    ]
  },
  {
    "name": "Tee Munchies Kitchen",
    "slug": "tee-munchies-kitchen",
    "description": "Noodles, shawarma, and fast food.",
    "category": "Fast Food",
    "logoUrl": "/bogaad.svg",
    "bannerUrl": "/noodles.jfif",
    "isActive": true,
    "isOpen": true,
    "deliveryFee": 100000,
    "minOrder": 250000,
    "categories": [
      {
        "name": "Tee’s Noddle Experience",
        "sortOrder": 1,
        "items": [
          {
            "name": "Simple Stir",
            "description": "Deliciously made Simple Stir.",
            "price": 250000,
            "imageUrl": "/noodles.jfif"
          },
          {
            "name": "Suya Loaded Noodles",
            "description": "Deliciously made Suya Loaded Noodles.",
            "price": 350000,
            "imageUrl": "/maccaroni.jfif"
          },
          {
            "name": "SeaFusion Noodles",
            "description": "Deliciously made SeaFusion Noodles.",
            "price": 400000,
            "imageUrl": "/5-minuterecipe_com.jfif"
          },
          {
            "name": "Sunshine",
            "description": "Deliciously made Sunshine.",
            "price": 450000,
            "imageUrl": "/pasta.jfif"
          },
          {
            "name": "Chicken Vibes Bowl",
            "description": "Deliciously made Chicken Vibes Bowl.",
            "price": 400000,
            "imageUrl": "/vibes bowl.jfif"
          },
          {
            "name": "Tee Ultimate Combo",
            "description": "Deliciously made Tee Ultimate Combo.",
            "price": 750000,
            "imageUrl": "/noodles.jfif"
          }
        ]
      },
      {
        "name": "Shawarma Pricelist",
        "sortOrder": 2,
        "items": [
          {
            "name": "Royale Classic Shawarma",
            "description": "Deliciously made Royale Classic Shawarma.",
            "price": 250000,
            "imageUrl": "/sharwama 1.jfif"
          },
          {
            "name": "Double Royale Supreme",
            "description": "Deliciously made Double Royale Supreme.",
            "price": 300000,
            "imageUrl": "/Chicken Shawarma.jfif"
          },
          {
            "name": "Suya Fusion Royale",
            "description": "Deliciously made Suya Fusion Royale.",
            "price": 350000,
            "imageUrl": "/Chicken Shawarma.jfif"
          },
          {
            "name": "Grand Supreme Double",
            "description": "Deliciously made Grand Supreme Double.",
            "price": 350000,
            "imageUrl": "/sharwama 1.jfif"
          },
          {
            "name": "Suya Heritage Combo",
            "description": "Deliciously made Suya Heritage Combo.",
            "price": 400000,
            "imageUrl": "/sharwama 1.jfif"
          }
        ]
      },
      {
        "name": "Toast & Sandwich",
        "sortOrder": 3,
        "items": [
          {
            "name": "Loaded Cheese Toast",
            "description": "Deliciously made Loaded Cheese Toast.",
            "price": 100000,
            "imageUrl": "/toast.jfif"
          }
        ]
      },
      {
        "name": "Chicken & Chips",
        "sortOrder": 4,
        "items": [
          {
            "name": "Chicken and Chips",
            "description": "Deliciously made Chicken and Chips.",
            "price": 600000,
            "imageUrl": "/chicken and chips.jfif"
          },
          {
            "name": "Extra Chicken",
            "description": "Deliciously made Extra Chicken.",
            "price": 400000,
            "imageUrl": "/chicken and chips.jfif"
          },
          {
            "name": "Extra Chips/Fries",
            "description": "Deliciously made Extra Chips/Fries.",
            "price": 150000,
            "imageUrl": "/chicken and chips.jfif"
          }
        ]
      },
      {
        "name": "Coffee",
        "sortOrder": 5,
        "items": [
          {
            "name": "Small Cup",
            "description": "Deliciously made Small Cup.",
            "price": 100000,
            "imageUrl": "/Cappuccino.jfif"
          },
          {
            "name": "Big Cup",
            "description": "Deliciously made Big Cup.",
            "price": 150000,
            "imageUrl": "/coffee.jfif"
          }
        ]
      },
      {
        "name": "Popcorn / Desserts",
        "sortOrder": 6,
        "items": [
          {
            "name": "Popcorn with Milk",
            "description": "Deliciously made Popcorn with Milk.",
            "price": 50000,
            "imageUrl": "/Popcorn.jfif"
          },
          {
            "name": "Ice Cream",
            "description": "Deliciously made Ice Cream.",
            "price": 150000,
            "imageUrl": "/ice cream.jfif"
          },
          {
            "name": "Candy Floss",
            "description": "Deliciously made Candy Floss.",
            "price": 50000,
            "imageUrl": "/candy floss.jfif"
          }
        ]
      },
      {
        "name": "Extras",
        "sortOrder": 7,
        "items": [
          {
            "name": "Egg",
            "description": "Deliciously made Egg.",
            "price": 50000,
            "imageUrl": "/egg and meat.jpg"
          },
          {
            "name": "Chicken",
            "description": "Deliciously made Chicken.",
            "price": 150000,
            "imageUrl": "/Nigeria Jollof and turkey.jfif"
          },
          {
            "name": "Turkey",
            "description": "Deliciously made Turkey.",
            "price": 500000,
            "imageUrl": "/Nigeria Jollof and turkey.jfif"
          },
          {
            "name": "Sauce",
            "description": "Deliciously made Sauce.",
            "price": 50000,
            "imageUrl": "/egg and meat.jpg"
          },
          {
            "name": "Plantain",
            "description": "Deliciously made Plantain.",
            "price": 50000,
            "imageUrl": "/plantain.jpg"
          }
        ]
      }
    ]
  },
  {
    "name": "Daps Kitchen",
    "slug": "daps-kitchen",
    "description": "Main meals and extras.",
    "category": "Local Food",
    "logoUrl": "/bogaad.svg",
    "bannerUrl": "/daps kitchen.jfif",
    "isActive": true,
    "isOpen": true,
    "deliveryFee": 50000,
    "minOrder": 250000,
    "categories": [
      {
        "name": "Main Items",
        "sortOrder": 1,
        "items": [
          {
            "name": "Small Plate with Beef",
            "description": "Deliciously made Small Plate with Beef.",
            "price": 250000,
            "imageUrl": "/daps kitchen.jfif"
          },
          {
            "name": "Big Plate with Beef",
            "description": "Deliciously made Big Plate with Beef.",
            "price": 300000,
            "imageUrl": "/daps kitchen.jfif"
          },
          {
            "name": "Small Plate with Fish",
            "description": "Deliciously made Small Plate with Fish.",
            "price": 300000,
            "imageUrl": "/daps kitchen.jfif"
          },
          {
            "name": "Big Plate with Fish",
            "description": "Deliciously made Big Plate with Fish.",
            "price": 350000,
            "imageUrl": "/daps kitchen.jfif"
          },
          {
            "name": "Small Plate with Chicken",
            "description": "Deliciously made Small Plate with Chicken.",
            "price": 250000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          },
          {
            "name": "Big Plate with Chicken",
            "description": "Deliciously made Big Plate with Chicken.",
            "price": 300000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          },
          {
            "name": "Small Plate with Small Turkey",
            "description": "Deliciously made Small Plate with Small Turkey.",
            "price": 350000,
            "imageUrl": "/daps jollof.jfif"
          },
          {
            "name": "Big Plate with Small Turkey",
            "description": "Deliciously made Big Plate with Small Turkey.",
            "price": 400000,
            "imageUrl": "/daps jollof.jfif"
          },
          {
            "name": "Small Plate with Big Turkey",
            "description": "Deliciously made Small Plate with Big Turkey.",
            "price": 550000,
            "imageUrl": "/daps jollof.jfif"
          },
          {
            "name": "Big Plate with Big Turkey",
            "description": "Deliciously made Big Plate with Big Turkey.",
            "price": 600000,
            "imageUrl": "/daps jollof.jfif"
          },
          {
            "name": "Spaghetti with Chicken",
            "description": "Deliciously made Spaghetti with Chicken.",
            "price": 400000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Spaghetti with Turkey",
            "description": "Deliciously made Spaghetti with Turkey.",
            "price": 600000,
            "imageUrl": "/spaghetti.jfif"
          },
          {
            "name": "Asun Rice (Per Spoon)",
            "description": "Deliciously made Asun Rice (Per Spoon).",
            "price": 150000,
            "imageUrl": "/Ofada Stew Recipe (How To Make Ofada Stew) - My Active Kitchen.jfif"
          }
        ]
      },
      {
        "name": "Extras",
        "sortOrder": 2,
        "items": [
          {
            "name": "Rice",
            "description": "Deliciously made Rice.",
            "price": 50000,
            "imageUrl": "/Smoky Asun Jollof Rice.jfif"
          },
          {
            "name": "Plantain",
            "description": "Deliciously made Plantain.",
            "price": 20000,
            "imageUrl": "/plantain.jpg"
          },
          {
            "name": "Coleslaw",
            "description": "Deliciously made Coleslaw.",
            "price": 50000,
            "imageUrl": "/coleslaw.jfif"
          },
          {
            "name": "Turkey S/S",
            "description": "Deliciously made Turkey S/S.",
            "price": 200000,
            "imageUrl": "/Nigeria Jollof and turkey.jfif"
          },
          {
            "name": "Egg/Beef",
            "description": "Deliciously made Egg/Beef.",
            "price": 30000,
            "imageUrl": "/egg and meat.jpg"
          },
          {
            "name": "Fish",
            "description": "Deliciously made Fish.",
            "price": 200000,
            "imageUrl": "/Jollof Rice (2).jfif"
          },
          {
            "name": "Chicken",
            "description": "Deliciously made Chicken.",
            "price": 150000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          },
          {
            "name": "Turkey B/S",
            "description": "Deliciously made Turkey B/S.",
            "price": 400000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          }
        ]
      }
    ]
  },
  {
    "name": "BK 48 Kitchen",
    "slug": "bk-48-kitchen",
    "description": "Jollof, fried rice, pasta and swallows.",
    "category": "Restaurant",
    "logoUrl": "/bogaad.svg",
    "bannerUrl": "/Nigerian Native Jollof Rice.jfif",
    "isActive": true,
    "isOpen": true,
    "deliveryFee": 150000,
    "minOrder": 200000,
    "categories": [
      {
        "name": "Main Menu",
        "sortOrder": 1,
        "items": [
          {
            "name": "Jollof & Fried Rice with Chicken Big Plate",
            "description": "Deliciously made Jollof & Fried Rice with Chicken Big Plate.",
            "price": 300000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          },
          {
            "name": "Jollof & Fried Rice with Chicken Small Plate",
            "description": "Deliciously made Jollof & Fried Rice with Chicken Small Plate.",
            "price": 250000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          },
          {
            "name": "Jollof & Fried Rice with Beef Big Plate",
            "description": "Deliciously made Jollof & Fried Rice with Beef Big Plate.",
            "price": 200000,
            "imageUrl": "/daps kitchen.jfif"
          },
          {
            "name": "Jollof & Fried Rice with Beef Small Plate",
            "description": "Deliciously made Jollof & Fried Rice with Beef Small Plate.",
            "price": 150000,
            "imageUrl": "/daps kitchen.jfif"
          },
          {
            "name": "Jollof & Fried Rice with Hake Fish Big Plate",
            "description": "Deliciously made Jollof & Fried Rice with Hake Fish Big Plate.",
            "price": 300000,
            "imageUrl": "/Jollof Rice (2).jfif"
          },
          {
            "name": "Jollof & Fried Rice with Hake Fish Small Plate",
            "description": "Deliciously made Jollof & Fried Rice with Hake Fish Small Plate.",
            "price": 250000,
            "imageUrl": "/Jollof Rice (1).jfif"
          },
          {
            "name": "Stir-Fry Pasta with Chicken",
            "description": "Deliciously made Stir-Fry Pasta with Chicken.",
            "price": 350000,
            "imageUrl": "/Jollof Spaghetti - KikiFoodies.jfif"
          },
          {
            "name": "Native Pasta with Chicken",
            "description": "Deliciously made Native Pasta with Chicken.",
            "price": 350000,
            "imageUrl": "/Nigerian Native Jollof Rice.jfif"
          },
          {
            "name": "Beef Penne Pasta with Chicken",
            "description": "Deliciously made Beef Penne Pasta with Chicken.",
            "price": 350000,
            "imageUrl": "/maccaroni.jfif"
          },
          {
            "name": "Beef Stir-Fry Noodles with Chicken & Fried Egg",
            "description": "Deliciously made Beef Stir-Fry Noodles with Chicken & Fried Egg.",
            "price": 350000,
            "imageUrl": "/sample.jpeg"
          },
          {
            "name": "Beef Stir-Fry Noodles with Chicken",
            "description": "Deliciously made Beef Stir-Fry Noodles with Chicken.",
            "price": 300000,
            "imageUrl": "/noodles and eggs.jfif"
          },
          {
            "name": "Spicy Noodles with Fried Egg & Chicken",
            "description": "Deliciously made Spicy Noodles with Fried Egg & Chicken.",
            "price": 250000,
            "imageUrl": "/noodles.jfif"
          },
          {
            "name": "Spicy Noodles with Chicken",
            "description": "Deliciously made Spicy Noodles with Chicken.",
            "price": 200000,
            "imageUrl": "/noodles.jfif"
          },
          {
            "name": "Pancakes, Scrambled Eggs, Sausages & Maple Syrup",
            "description": "Deliciously made Pancakes, Scrambled Eggs, Sausages & Maple Syrup.",
            "price": 300000,
            "imageUrl": "/Classic Tuna Sandwich"
          },
          {
            "name": "Chicken & Chips with Ketchup",
            "description": "Deliciously made Chicken & Chips with Ketchup.",
            "price": 350000,
            "imageUrl": "/chicken and chips.jpeg"
          },
          {
            "name": "Fried Yam & Plantain with Chicken",
            "description": "Deliciously made Fried Yam & Plantain with Chicken.",
            "price": 200000,
            "imageUrl": "/chicken and chips.jpeg"
          },
          {
            "name": "Fried Yam & Plantain with Beef",
            "description": "Deliciously made Fried Yam & Plantain with Beef.",
            "price": 160000,
            "imageUrl": "/chicken and chips.jpeg"
          },
          {
            "name": "Boiled Plantain & Efo with Chicken",
            "description": "Deliciously made Boiled Plantain & Efo with Chicken.",
            "price": 300000,
            "imageUrl": "/plantain & efo.jpeg"
          },
          {
            "name": "Boiled Plantain & Efo with Beef",
            "description": "Deliciously made Boiled Plantain & Efo with Beef.",
            "price": 250000,
            "imageUrl": "/plantain & efo.jpeg"
          }
        ]
      },
      {
        "name": "Swallow",
        "sortOrder": 2,
        "items": [
          {
            "name": "Pounded Yam",
            "description": "Deliciously made Pounded Yam.",
            "price": 50000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Amala",
            "description": "Deliciously made Amala.",
            "price": 30000,
            "imageUrl": "/Breakfast served by Chat GPT😍😋_   Prompt_ A….jfif"
          },
          {
            "name": "Semo",
            "description": "Deliciously made Semo.",
            "price": 30000,
            "imageUrl": "/25 Authentic Nigerian Dinner Recipes.jfif"
          }
        ]
      },
      {
        "name": "Extras",
        "sortOrder": 3,
        "items": [
          {
            "name": "Rice",
            "description": "Deliciously made Rice.",
            "price": 40000,
            "imageUrl": "/Smoky Asun Jollof Rice.jfif"
          },
          {
            "name": "Plantain",
            "description": "Deliciously made Plantain.",
            "price": 50000,
            "imageUrl": "/plantain.jpg"
          },
          {
            "name": "Coleslaw",
            "description": "Deliciously made Coleslaw.",
            "price": 50000,
            "imageUrl": "/coleslaw.jfif"
          },
          {
            "name": "Fried Yam",
            "description": "Deliciously made Fried Yam.",
            "price": 50000,
            "imageUrl": "/chicken and chips.jpeg"
          },
          {
            "name": "Chicken",
            "description": "Deliciously made Chicken.",
            "price": 100000,
            "imageUrl": "/daps jollof.jfif"
          },
          {
            "name": "Beef",
            "description": "Deliciously made Beef.",
            "price": 50000,
            "imageUrl": "/Smoky Asun Jollof Rice.jfif"
          },
          {
            "name": "Hake Fish",
            "description": "Deliciously made Hake Fish.",
            "price": 100000,
            "imageUrl": "/hake fish.jfif"
          },
          {
            "name": "Sausage",
            "description": "Deliciously made Sausage.",
            "price": 50000,
            "imageUrl": "/egg and meat.jpg"
          }
        ]
      }
    ]
  },
  {
    "name": "Bissy Joy",
    "slug": "bissy-joy",
    "description": "Extensive rice and swallow dishes.",
    "category": "Local Food",
    "logoUrl": "/bogaad.svg",
    "bannerUrl": "/Top 21 Nigerian Foods That Will Blow Your Taste Buds - Chef's Pencil.jfif",
    "isActive": true,
    "isOpen": true,
    "deliveryFee": 100000,
    "minOrder": 250000,
    "categories": [
      {
        "name": "Rice / Main Dishes",
        "sortOrder": 1,
        "items": [
          {
            "name": "White Rice — Extra Plate",
            "description": "Deliciously made White Rice — Extra Plate.",
            "price": 300000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "White Rice — Regular Plate",
            "description": "Deliciously made White Rice — Regular Plate.",
            "price": 250000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "White Rice & Beans (Wache) — Extra Plate",
            "description": "Deliciously made White Rice & Beans (Wache) — Extra Plate.",
            "price": 350000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "White Rice & Beans (Wache) — Regular Plate",
            "description": "Deliciously made White Rice & Beans (Wache) — Regular Plate.",
            "price": 300000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "Jollof & Fried Rice — Extra Plate",
            "description": "Deliciously made Jollof & Fried Rice — Extra Plate.",
            "price": 300000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          },
          {
            "name": "Jollof & Fried Rice — Regular Plate",
            "description": "Deliciously made Jollof & Fried Rice — Regular Plate.",
            "price": 250000,
            "imageUrl": "/Jollof Rice & Chicken.jfif"
          },
          {
            "name": "Chinese Rice — Extra Plate",
            "description": "Deliciously made Chinese Rice — Extra Plate.",
            "price": 500000,
            "imageUrl": "/Ofada Stew Recipe (How To Make Ofada Stew) - My Active Kitchen.jfif"
          },
          {
            "name": "Chinese Rice — Regular Plate",
            "description": "Deliciously made Chinese Rice — Regular Plate.",
            "price": 400000,
            "imageUrl": "/Ofada Stew Recipe (How To Make Ofada Stew) - My Active Kitchen.jfif"
          },
          {
            "name": "Village Rice — Extra Plate",
            "description": "Deliciously made Village Rice — Extra Plate.",
            "price": 500000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Village Rice — Regular Plate",
            "description": "Deliciously made Village Rice — Regular Plate.",
            "price": 400000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Yam Porridge — Extra Plate",
            "description": "Deliciously made Yam Porridge — Extra Plate.",
            "price": 350000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Yam Porridge — Regular Plate",
            "description": "Deliciously made Yam Porridge — Regular Plate.",
            "price": 300000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Yam & Egg — Extra Plate",
            "description": "Deliciously made Yam & Egg — Extra Plate.",
            "price": 350000,
            "imageUrl": "/sample.jpeg"
          },
          {
            "name": "Yam & Egg — Regular Plate",
            "description": "Deliciously made Yam & Egg — Regular Plate.",
            "price": 300000,
            "imageUrl": "/sample.jpeg"
          },
          {
            "name": "Jollof Macaroni — Extra Plate",
            "description": "Deliciously made Jollof Macaroni — Extra Plate.",
            "price": 350000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Jollof Macaroni — Regular Plate",
            "description": "Deliciously made Jollof Macaroni — Regular Plate.",
            "price": 300000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Jollof Spaghetti — Extra Plate",
            "description": "Deliciously made Jollof Spaghetti — Extra Plate.",
            "price": 350000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Jollof Spaghetti — Regular Plate",
            "description": "Deliciously made Jollof Spaghetti — Regular Plate.",
            "price": 300000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Beans & Bread — Extra Plate",
            "description": "Deliciously made Beans & Bread — Extra Plate.",
            "price": 300000,
            "imageUrl": "/sample.jpeg"
          },
          {
            "name": "Beans & Bread — Regular Plate",
            "description": "Deliciously made Beans & Bread — Regular Plate.",
            "price": 250000,
            "imageUrl": "/sample.jpeg"
          },
          {
            "name": "Semo — Extra Plate",
            "description": "Deliciously made Semo — Extra Plate.",
            "price": 500000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Semo — Regular Plate",
            "description": "Deliciously made Semo — Regular Plate.",
            "price": 400000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Ofada Rice — Extra Plate",
            "description": "Deliciously made Ofada Rice — Extra Plate.",
            "price": 500000,
            "imageUrl": "/Ofada Stew Recipe (How To Make Ofada Stew) - My Active Kitchen.jfif"
          },
          {
            "name": "Ofada Rice — Regular Plate",
            "description": "Deliciously made Ofada Rice — Regular Plate.",
            "price": 400000,
            "imageUrl": "/Ofada Stew Recipe (How To Make Ofada Stew) - My Active Kitchen.jfif"
          }
        ]
      },
      {
        "name": "Swallow / Proteins",
        "sortOrder": 2,
        "items": [
          {
            "name": "Eba — Extra Plate",
            "description": "Deliciously made Eba — Extra Plate.",
            "price": 300000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Eba — Regular Plate",
            "description": "Deliciously made Eba — Regular Plate.",
            "price": 250000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Amala — Extra Plate",
            "description": "Deliciously made Amala — Extra Plate.",
            "price": 300000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Amala — Regular Plate",
            "description": "Deliciously made Amala — Regular Plate.",
            "price": 250000,
            "imageUrl": "/Breakfast served by Chat GPT😍😋_   Prompt_ A….jfif"
          },
          {
            "name": "Fufu — Extra Plate",
            "description": "Deliciously made Fufu — Extra Plate.",
            "price": 350000,
            "imageUrl": "/25 Authentic Nigerian Dinner Recipes.jfif"
          },
          {
            "name": "Fufu — Regular Plate",
            "description": "Deliciously made Fufu — Regular Plate.",
            "price": 300000,
            "imageUrl": "/25 Authentic Nigerian Dinner Recipes.jfif"
          },
          {
            "name": "Pounded Yam — Extra Plate",
            "description": "Deliciously made Pounded Yam — Extra Plate.",
            "price": 300000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Pounded Yam — Regular Plate",
            "description": "Deliciously made Pounded Yam — Regular Plate.",
            "price": 250000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Pepper Soup — Extra Plate",
            "description": "Deliciously made Pepper Soup — Extra Plate.",
            "price": 250000,
            "imageUrl": "/pepper soup.jfif"
          },
          {
            "name": "Pepper Soup — Regular Plate",
            "description": "Deliciously made Pepper Soup — Regular Plate.",
            "price": 200000,
            "imageUrl": "/pepper soup.jfif"
          },
          {
            "name": "Chicken — Extra Plate",
            "description": "Deliciously made Chicken — Extra Plate.",
            "price": 400000,
            "imageUrl": "/daps kitchen.jfif"
          },
          {
            "name": "Chicken — Regular Plate",
            "description": "Deliciously made Chicken — Regular Plate.",
            "price": 350000,
            "imageUrl": "/daps kitchen.jfif"
          },
          {
            "name": "Turkey — Extra Plate",
            "description": "Deliciously made Turkey — Extra Plate.",
            "price": 250000,
            "imageUrl": "/daps jollof.jfif"
          },
          {
            "name": "Turkey — Regular Plate",
            "description": "Deliciously made Turkey — Regular Plate.",
            "price": 200000,
            "imageUrl": "/daps jollof.jfif"
          },
          {
            "name": "Assorted — Extra Plate",
            "description": "Deliciously made Assorted — Extra Plate.",
            "price": 150000,
            "imageUrl": "/Smoky Asun Jollof Rice.jfif"
          },
          {
            "name": "Assorted — Regular Plate",
            "description": "Deliciously made Assorted — Regular Plate.",
            "price": 100000,
            "imageUrl": "/Smoky Asun Jollof Rice.jfif"
          },
          {
            "name": "Goat Meat",
            "description": "Deliciously made Goat Meat.",
            "price": 30000,
            "imageUrl": "/pepper soup.jfif"
          },
          {
            "name": "Egg — Extra Plate",
            "description": "Deliciously made Egg — Extra Plate.",
            "price": 50000,
            "imageUrl": "/egg and meat.jpg"
          },
          {
            "name": "Egg — Regular Plate",
            "description": "Deliciously made Egg — Regular Plate.",
            "price": 20000,
            "imageUrl": "/egg and meat.jpg"
          },
          {
            "name": "Ponmo",
            "description": "Deliciously made Ponmo.",
            "price": 50000,
            "imageUrl": "/egg and meat.jpg"
          }
        ]
      }
    ]
  },
  {
    "name": "Bukateria Malete",
    "slug": "bukateria-malete",
    "description": "Student favorite Bukateria.",
    "category": "Buka",
    "logoUrl": "/bogaad.svg",
    "bannerUrl": "/Top 21 Nigerian Foods That Will Blow Your Taste Buds - Chef's Pencil.jfif",
    "isActive": true,
    "isOpen": true,
    "deliveryFee": 100000,
    "minOrder": 100000,
    "categories": [
      {
        "name": "Food Per Portion",
        "sortOrder": 1,
        "items": [
          {
            "name": "Rice and Bean",
            "description": "Deliciously made Rice and Bean.",
            "price": 60000,
            "imageUrl": "/Steamed Rice and Beans with Tomato Sauce.jfif"
          },
          {
            "name": "Jollof Rice / Fried Rice",
            "description": "Deliciously made Jollof Rice / Fried Rice.",
            "price": 50000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Spaghetti",
            "description": "Deliciously made Spaghetti.",
            "price": 60000,
            "imageUrl": "/spaghetti.jpeg"
          },
          {
            "name": "Macaroni",
            "description": "Deliciously made Macaroni.",
            "price": 50000,
            "imageUrl": "/maccaroni.jfif"
          },
          {
            "name": "Porridge",
            "description": "Deliciously made Porridge.",
            "price": 60000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Porridge Bean",
            "description": "Deliciously made Porridge Bean.",
            "price": 60000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          },
          {
            "name": "Moi Moi",
            "description": "Deliciously made Moi Moi.",
            "price": 100000,
            "imageUrl": "/moi moi.jfif"
          }
        ]
      },
      {
        "name": "Food Per Wrap",
        "sortOrder": 2,
        "items": [
          {
            "name": "Amala / Eba / Semo / Fufu",
            "description": "Deliciously made Amala / Eba / Semo / Fufu.",
            "price": 30000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Pounded Yam",
            "description": "Deliciously made Pounded Yam.",
            "price": 60000,
            "imageUrl": "/Egusi Soup.jfif"
          }
        ]
      },
      {
        "name": "Soups & Stew",
        "sortOrder": 3,
        "items": [
          {
            "name": "Efo",
            "description": "Deliciously made Efo.",
            "price": 50000,
            "imageUrl": "/Making Nigerian Afang Soup Recipe - Dream Africa.jfif"
          },
          {
            "name": "Ewedu",
            "description": "Deliciously made Ewedu.",
            "price": 50000,
            "imageUrl": "/Breakfast served by Chat GPT😍😋_   Prompt_ A….jfif"
          },
          {
            "name": "Egusi",
            "description": "Deliciously made Egusi.",
            "price": 50000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Ila",
            "description": "Deliciously made Ila.",
            "price": 50000,
            "imageUrl": "/Breakfast served by Chat GPT😍😋_   Prompt_ A….jfif"
          },
          {
            "name": "Stew",
            "description": "Deliciously made Stew.",
            "price": 50000,
            "imageUrl": "/Designer Stew by Renny.jfif"
          },
          {
            "name": "Ata Rice",
            "description": "Deliciously made Ata Rice.",
            "price": 50000,
            "imageUrl": "/Craving a meal that hits all the right spots_….jpg"
          }
        ]
      },
      {
        "name": "Proteins",
        "sortOrder": 4,
        "items": [
          {
            "name": "Chicken",
            "description": "Deliciously made Chicken.",
            "price": 300000,
            "imageUrl": "/daps kitchen.jpeg"
          },
          {
            "name": "Turkey",
            "description": "Deliciously made Turkey.",
            "price": 400000,
            "imageUrl": "/daps jollof.jpeg"
          },
          {
            "name": "Ponmo",
            "description": "Deliciously made Ponmo.",
            "price": 70000,
            "imageUrl": "/egg and meat.jpg"
          },
          {
            "name": "Beef",
            "description": "Deliciously made Beef.",
            "price": 50000,
            "imageUrl": "/Delicious Jollof Spaghetti 😋😋.jpg"
          },
          {
            "name": "Titus",
            "description": "Deliciously made Titus.",
            "price": 300000,
            "imageUrl": "/hake fish.jfif"
          },
          {
            "name": "Assorted",
            "description": "Deliciously made Assorted.",
            "price": 70000,
            "imageUrl": "/Smoky Asun Jollof Rice.jfif"
          },
          {
            "name": "Hake",
            "description": "Deliciously made Hake.",
            "price": 300000,
            "imageUrl": "/hake fish.jfif"
          },
          {
            "name": "Egg",
            "description": "Deliciously made Egg.",
            "price": 50000,
            "imageUrl": "/egg and meat.jpg"
          }
        ]
      },
      {
        "name": "Snacks & Bread",
        "sortOrder": 5,
        "items": [
          {
            "name": "Sugar Donuts",
            "description": "Deliciously made Sugar Donuts.",
            "price": 50000,
            "imageUrl": "/jelley donut.jfif"
          },
          {
            "name": "Meat Pie",
            "description": "Deliciously made Meat Pie.",
            "price": 70000,
            "imageUrl": "/Nigerian meat pie.jfif"
          },
          {
            "name": "Chicken Pie",
            "description": "Deliciously made Chicken Pie.",
            "price": 80000,
            "imageUrl": "/Nigerian meat pie.jfif"
          },
          {
            "name": "Sausage Roll",
            "description": "Deliciously made Sausage Roll.",
            "price": 100000,
            "imageUrl": "/Easy sausage rolls.jfif"
          },
          {
            "name": "Chin Chin",
            "description": "Deliciously made Chin Chin.",
            "price": 50000,
            "imageUrl": "/Easy and Delicious Cruffins Recipe.jfif"
          },
          {
            "name": "Cake",
            "description": "Deliciously made Cake.",
            "price": 100000,
            "imageUrl": "/foil cake.jfif"
          },
          {
            "name": "Big Loaf Bread",
            "description": "Deliciously made Big Loaf Bread.",
            "price": 100000,
            "imageUrl": "/Easy Milk Bread Loaf.jfif"
          },
          {
            "name": "Small Loaf Bread",
            "description": "Deliciously made Small Loaf Bread.",
            "price": 60000,
            "imageUrl": "/Easy Milk Bread Loaf.jfif"
          }
        ]
      },
      {
        "name": "Drinks",
        "sortOrder": 6,
        "items": [
          {
            "name": "Water",
            "description": "Deliciously made Water.",
            "price": 30000,
            "imageUrl": "/water.jfif"
          },
          {
            "name": "Chi Exotic",
            "description": "Deliciously made Chi Exotic.",
            "price": 200000,
            "imageUrl": "/exotic.jfif"
          },
          {
            "name": "Pet Coke / Sprite / Pepsi",
            "description": "Deliciously made Pet Coke / Sprite / Pepsi.",
            "price": 60000,
            "imageUrl": "/coke.jfif"
          },
          {
            "name": "Teem",
            "description": "Deliciously made Teem.",
            "price": 60000,
            "imageUrl": "/teem.jfif"
          },
          {
            "name": "Fanta",
            "description": "Deliciously made Fanta.",
            "price": 60000,
            "imageUrl": "/FANTA ORANGE 🍊.jfif"
          },
          {
            "name": "Sprite",
            "description": "Deliciously made Sprite.",
            "price": 60000,
            "imageUrl": "/sprite.jfif"
          },
          {
            "name": "Pepsi",
            "description": "Deliciously made Pepsi.",
            "price": 60000,
            "imageUrl": "/pepsi.jfif"
          }
        ]
      }
    ]
  },
  {
    "name": "Okele-Joint Vendor",
    "slug": "okele-joint",
    "description": "Swallow and native soups.",
    "category": "Buka",
    "logoUrl": "/bogaad.svg",
    "bannerUrl": "/Making Nigerian Afang Soup Recipe - Dream Africa.jfif",
    "isActive": true,
    "isOpen": true,
    "deliveryFee": 100000,
    "minOrder": 150000,
    "categories": [
      {
        "name": "Swallow / Staples",
        "sortOrder": 1,
        "items": [
          {
            "name": "Amala",
            "description": "Deliciously made Amala.",
            "price": 30000,
            "imageUrl": "/Breakfast served by Chat GPT😍😋_   Prompt_ A….jfif"
          },
          {
            "name": "Pounded Yam",
            "description": "Deliciously made Pounded Yam.",
            "price": 50000,
            "imageUrl": "/Egusi Soup.jfif"
          },
          {
            "name": "Semo",
            "description": "Deliciously made Semo.",
            "price": 20000,
            "imageUrl": "/25 Authentic Nigerian Dinner Recipes.jfif"
          },
          {
            "name": "Fufu",
            "description": "Deliciously made Fufu.",
            "price": 20000,
            "imageUrl": "/25 Authentic Nigerian Dinner Recipes.jfif"
          },
          {
            "name": "Eba",
            "description": "Deliciously made Eba.",
            "price": 20000,
            "imageUrl": "/Making Nigerian Afang Soup Recipe - Dream Africa.jfif"
          },
          {
            "name": "Tuwo Rice",
            "description": "Deliciously made Tuwo Rice.",
            "price": 10000,
            "imageUrl": "/Steamy Nigeria Jollof.jfif"
          }
        ]
      },
      {
        "name": "Proteins / Sides",
        "sortOrder": 2,
        "items": [
          {
            "name": "Cow Meat",
            "description": "Deliciously made Cow Meat.",
            "price": 20000,
            "imageUrl": "/Designer Stew by Renny.jfif"
          },
          {
            "name": "Goat Meat",
            "description": "Deliciously made Goat Meat.",
            "price": 50000,
            "imageUrl": "Designer Stew by Renny.jfif"
          },
          {
            "name": "Fish",
            "description": "Deliciously made Fish.",
            "price": 150000,
            "imageUrl": "Designer Stew by Renny.jfif"
          },
          {
            "name": "Wara",
            "description": "Deliciously made Wara.",
            "price": 30000,
            "imageUrl": "Designer Stew by Renny.jfif"
          },
          {
            "name": "Ponmo",
            "description": "Deliciously made Ponmo.",
            "price": 30000,
            "imageUrl": "Designer Stew by Renny.jfif"
          },
          {
            "name": "Cow Leg",
            "description": "Deliciously made Cow Leg.",
            "price": 50000,
            "imageUrl": "Designer Stew by Renny.jfif"
          },
          {
            "name": "Chicken",
            "description": "Deliciously made Chicken.",
            "price": 150000,
            "imageUrl": "/Delicious Jollof Spaghetti 😋😋.jpg"
          },
          {
            "name": "Smoke Fish",
            "description": "Deliciously made Smoke Fish.",
            "price": 50000,
            "imageUrl": "/Delicious Jollof Spaghetti 😋😋.jpg"
          },
          {
            "name": "Hake Fish",
            "description": "Deliciously made Hake Fish.",
            "price": 100000,
            "imageUrl": "/hake fish.jfif"
          }
        ]
      }
    ]
  }
];

fs.writeFileSync(__dirname + '/seed-data.json', JSON.stringify(data, null, 2));
console.log('seed-data.json created!');
