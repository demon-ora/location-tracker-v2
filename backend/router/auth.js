const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/mid');




require('../db/conn');
const User = require('../model/userSchema');
const Location = require('../model/locationSchema');
const Driver = require('../model/driverSchema');
router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/register', async (req, res) => {
  console.log(req.body);
    const { name, email, password, cpassword } = req.body;
    if (!name || !email || !password || !cpassword) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
  
    try {
      const response = await User.findOne({ email: email });
      if (response) {
        return res.status(422).json({ error: "Email already exists" });
      } else if (password != cpassword) {
        return res.status(422).json({ error: "Passwords are not matching" });
      } else {
        const user = new User({ name, email, password, cpassword });
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: false
        });
        return res.status(201).json({ message: "User registered successfully" ,  token : token   }); // Set the status code to 201 for successful registration
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" }); // Set the status code to 500 for server errors
    }
  });
  
router.post('/register-driver', async (req, res) => {
console.log(req.body);
  const { name, email,job, password, cpassword } = req.body;
  if (!name || !email || !job || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    const response = await Driver.findOne({ email: email });
    if (response) {
      return res.status(422).json({ error: "Email already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Passwords are not matching" });
    } else {
      let latitude = 27.6710754 ;
      let longitude = 85.3307457;
      const driver = new Driver({ name, email,job, password, cpassword , latitude , longitude });
      await driver.save();

      const user = new User({ name, email, password, cpassword });
      await user.save();

      const token = await driver.generateAuthToken();
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: false
      });
      return res.status(201).json({ message: "driver registered successfully" ,  token : token   }); // Set the status code to 201 for successful registration
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" }); // Set the status code to 500 for server errors
  }
});


  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
  
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
  
    try {
      const userLogin = await User.findOne({ email: email });
      console.log(userLogin);
      if (userLogin) {
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          return res.status(400).json({ error: "Invalid credentials" });
        }
  
        const token = await userLogin.generateAuthToken();
        console.log(token);
  
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: false
        });
  
        res.json({ message: "User signed in successfully", token: token });
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  router.post('/locations', authenticate, async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log("calling");
    
    try {
      // Check if a location entry for the user already exists
      const existingLocation = await Location.findOne({ user: req.userID });
      
      if (existingLocation) {
        // If an entry exists, update the location data
        existingLocation.latitude = latitude;
        existingLocation.longitude = longitude;
        await existingLocation.save();
        res.status(200).json({ message: 'Location updated' });
      } else {
        // If no entry exists, create a new entry with the user reference
        const location = new Location({
          user: req.userID, // Set the user reference to the user's ID
          latitude,
          longitude,
        });
        await location.save();
        res.status(201).json({ message: 'Location saved' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error saving/updating location' });
    }
  });
  

router.get('/locations', async (req, res) => {
  try {
    // Fetch all user locations from the database
    const locations = await Driver.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching locations' });
  }
});


router.get('/users', async (req, res) => {
  try {
    // Fetch all user locations from the database
    const locations = await User.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching locations' });
  }
});



router.get('/logout', (req, res) => {
  console.log("hello");

  res.clearCookie ('jwtoken'); // Clear the cookie you set during login

  // Optionally, you can also destroy the session if you're using sessions
  // req.session.destroy();

  

  res.status(200).json({ message: 'Logged out successfully' });
});


module.exports = router;




