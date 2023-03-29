const mongoose = require("mongoose");
const campground = require("../models/campground");
const Campground = require("../models/campground");

const cities = require("./cities");
const { places, descriptors } = require("./seedhelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 150; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      //your user id
      author: "636be107eada2c11b39a306a",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus dolores, vel aliquid praesentium voluptatum quisquam ipsam debitis officia distinctio commodi cumque assumenda vitae ab nam! Incidunt architecto reiciendis omnis ipsam.",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dac95ck1j/image/upload/v1668542658/YELPCAMP/ro10rgfipszxws1xj8gx.jpg",
          filename: "YELPCAMP/ro10rgfipszxws1xj8gx",
        },
        {
          url: "https://res.cloudinary.com/dac95ck1j/image/upload/v1668542658/YELPCAMP/mio7rndu1ztiwm71istt.jpg",
          filename: "YELPCAMP/mio7rndu1ztiwm71istt",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
