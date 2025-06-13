const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();
const expressSession = require('express-session');
const { spawn } = require('child_process'); // For Python integration
const fs = require('fs');

const app = express();
const port = process.env.PORT

// MongoDB Connection - only if needed for user functionality
try {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.warn('MongoDB connection failed. User account features will be disabled.');
      console.warn('Error details:', err.message);
    });
} catch (err) {
  console.warn('MongoDB connection error. User account features will be disabled.');
}

// Add this to make sure server doesn't crash on DB errors
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

// Define User Schema with additional fields
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Test Result Schema
const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  scores: {
    Leadership: { type: Number, required: true },
    'Empathy & Social Skills': { type: Number, required: true },
    'Strategic Thinking & Problem-Solving': { type: Number, required: true },
    'Creativity & Innovation': { type: Number, required: true },
    'Resilience & Adaptability': { type: Number, required: true },
    'Overall Score': { type: Number, required: true }
  },
  jobRecommendation: {
    category: { type: String },
    roles: [{ type: String }],
    description: { type: String }
  },
  testDate: { type: Date, default: Date.now },
  timeTaken: { type: String },
  totalQuestions: { type: Number, default: 40 }
});

const TestResult = mongoose.model('TestResult', testResultSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files from the main folder

// Session middleware
app.use(expressSession({
  secret: 'yourSecretKey', // Use a secret key for your session
  resave: false,
  saveUninitialized: true
}));

// Handle POST request to /signup
app.post('/signup', async (req, res) => {
  const { username, email, password, dob, gender, location } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send('User with this email already exists.');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user with additional fields
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      dob,          // Date of Birth
      gender,       // Gender
      location      // Location
    });
    await newUser.save();

    res.status(200).send('Signup successful!');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Server error');
  }
});

// Handle POST request to /login using email and password
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Compare the provided password with the hashed password in the database
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send('Invalid email or password');
    }

    // Successful login, set session variable
    req.session.loggedIn = true;
    req.session.username = user.username; // Store username in session

    res.status(200).json({ name: user.username }); // Send username in response
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Handle GET request to fetch user data
app.get('/getUserData', async (req, res) => {
  const user = await User.findOne({ email: 'user@example.com' }); // Replace with actual user lookup
  res.json({
    username: user.username,
    email: user.email,
    dob: user.dob.toISOString(),
    gender: user.gender,
    location: user.location
  });
});

// Handle POST request to update user data
app.post('/updateUserData', async (req, res) => {
  const { username, dob, gender, location } = req.body;
  try {
    await User.updateOne(
      { email: 'user@example.com' }, // Replace with actual user lookup
      { username, dob, gender, location }
    );
    res.status(200).send('User information updated successfully');
  } catch (err) {
    console.error('Error updating user data:', err);
    res.status(500).send('Server error');
  }
});

// Endpoint to calculate scores using Python script
app.post('/api/calculate-scores', (req, res) => {
  try {
    console.log("🔍 Calculate scores request received:", req.body);
    
    const { responses, totalOptions } = req.body;
    
    // Validate required data
    if (!responses || Object.keys(responses).length === 0) {
      console.error("❌ Missing responses in request");
      return res.status(400).json({ error: "Missing required data: responses" });
    }
    
    // Extract trait scores from responses
    const traitScores = {
      'Leadership': 0,
      'Empathy & Social Skills': 0,
      'Strategic Thinking & Problem-Solving': 0,
      'Creativity & Innovation': 0,
      'Resilience & Adaptability': 0
    };
    
    // Process responses - बेहतर स्कोरिंग लॉजिक
    try {
      // Count responses by prefix to determine trait scores
      let leadershipPoints = 0, leadershipCount = 0;
      let strategyPoints = 0, strategyCount = 0;
      let creativityPoints = 0, creativityCount = 0;
      
      Object.keys(responses).forEach(questionIndex => {
        const response = responses[questionIndex];
        const optionId = response.optionSelected;
        
        // Map option endings to points (a=5, b=4, c=3, d=2)
        const getPoints = (option) => {
          if (option.endsWith('a')) return 5;
          if (option.endsWith('b')) return 4;
          if (option.endsWith('c')) return 3;
          return 2;
        };
        
        // Score based on question prefix
        if (optionId.startsWith('1_')) {
          leadershipPoints += getPoints(optionId);
          leadershipCount++;
        } else if (optionId.startsWith('2_')) {
          strategyPoints += getPoints(optionId);
          strategyCount++;
        } else if (optionId.startsWith('3_')) {
          creativityPoints += getPoints(optionId);
          creativityCount++;
        }
      });
      
      // Calculate percentages
      if (leadershipCount > 0)
        traitScores['Leadership'] = Math.round((leadershipPoints / (leadershipCount * 5)) * 100);
      if (strategyCount > 0)
        traitScores['Strategic Thinking & Problem-Solving'] = Math.round((strategyPoints / (strategyCount * 5)) * 100);
      if (creativityCount > 0)
        traitScores['Creativity & Innovation'] = Math.round((creativityPoints / (creativityCount * 5)) * 100);
      
      // Generate derived scores for remaining traits based on existing scores
      const baseScore = (traitScores['Leadership'] + 
                         traitScores['Strategic Thinking & Problem-Solving'] + 
                         traitScores['Creativity & Innovation']) / 3;
      
      traitScores['Empathy & Social Skills'] = Math.max(40, Math.min(95, 
                                               Math.round(baseScore + (Math.random() * 20 - 10))));
      traitScores['Resilience & Adaptability'] = Math.max(40, Math.min(95, 
                                                Math.round(baseScore + (Math.random() * 20 - 10))));
      
      // Calculate overall score
      const allScores = Object.values(traitScores);
      traitScores['Overall Score'] = Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length * 10) / 10;
      
    } catch (scoringError) {
      console.error("Error processing responses:", scoringError);
    }
    
    console.log("📊 Sending trait scores to Python:", traitScores);
    
    const scriptPath = path.join(__dirname, 'job_predictor.py');
    const pyProcess = spawn('python', [scriptPath, JSON.stringify(traitScores)]);
    
    let jobData = '';
    let errorData = '';
    
    pyProcess.stdout.on('data', (data) => {
      jobData += data.toString();
    });
    
    pyProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error("Python error:", data.toString());
    });
    
    pyProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      
      let result = { ...traitScores };
      
      try {
        if (jobData && code === 0) {
          const parsedData = JSON.parse(jobData.trim());
          if (parsedData.career_paths && parsedData.career_paths.length > 0) {
            // Python model के परिणाम का उपयोग करें
            result['Recommended Job Category'] = parsedData;
            console.log("✅ Using ML model prediction");
          } else {
            throw new Error("Invalid career paths data from Python");
          }
        } else {
          throw new Error("Python model failed");
        }
      } catch (e) {
        console.error("Falling back to JavaScript recommendations:", e);
        
        // फॉलबैक सिस्टम
        const traits = Object.entries(traitScores)
          .filter(([key]) => key !== 'Overall Score')
          .sort((a, b) => b[1] - a[1]);
        
        const topTraits = traits.slice(0, 2);
        
        // ट्रेट-कैटेगरी मैपिंग
        const traitToCareer = {
          'Leadership': {
            category: "Executive Leadership",
            description: "Roles focused on organizational direction and team leadership.",
            examples: ["CEO", "Department Director", "Team Lead", "Project Manager"],
            confidence: 0.78
          },
          'Empathy & Social Skills': {
            category: "Human Relations & Support",
            description: "Roles centered around understanding people, providing guidance, and facilitating connections.",
            examples: ["HR Specialist", "Counselor", "Customer Success Manager", "Community Coordinator"],
            confidence: 0.76
          },
          'Strategic Thinking & Problem-Solving': {
            category: "Analysis & Strategy",
            description: "Roles requiring analytical thinking, planning, and developing strategic solutions.",
            examples: ["Business Analyst", "Strategy Consultant", "Research Specialist", "Operations Analyst"],
            confidence: 0.74
          },
          'Creativity & Innovation': {
            category: "Creative Design & Development",
            description: "Roles involving creative thinking, design principles, and innovative solutions.",
            examples: ["UX Designer", "Creative Director", "Product Developer", "Content Strategist"],
            confidence: 0.71
          },
          'Resilience & Adaptability': {
            category: "Change Management & Operations",
            description: "Roles requiring adaptability to changing conditions and resilience under pressure.",
            examples: ["Change Manager", "Agile Coach", "Crisis Coordinator", "Operations Specialist"],
            confidence: 0.69
          }
        };
        
        // कैरियर पाथ बनाएं
        const careerPaths = topTraits.map(([trait, score], index) => {
          const careerInfo = traitToCareer[trait];
          
          // Add random variation based on timestamp
          const timestamp = new Date().getTime();
          const randomFactor = timestamp % 10; // 0-9 random factor
          
          // Adjust confidence with random factor
          let adjustedConfidence = careerInfo.confidence - (index * 0.05);
          if (randomFactor > 5) {
            adjustedConfidence += 0.05; // Slight boost for some results
          }
          
          return {
            category: careerInfo.category,
            confidence: parseFloat(adjustedConfidence.toFixed(2)),
            description: careerInfo.description,
            examples: careerInfo.examples,
            is_primary: index === 0
          };
        });
        
        // अतिरिक्त पाथ जोड़ें
        const thirdTraitIndex = 2 % traits.length;
        const thirdTrait = traits[thirdTraitIndex][0];
        
        if (traitToCareer[thirdTrait]) {
          careerPaths.push({
            category: traitToCareer[thirdTrait].category,
            confidence: parseFloat((traitToCareer[thirdTrait].confidence - 0.15).toFixed(2)),
            description: traitToCareer[thirdTrait].description,
            examples: traitToCareer[thirdTrait].examples,
            is_primary: false
          });
        }
        
        result['Recommended Job Category'] = {
          career_paths: careerPaths
        };
      }
      
      // लॉग करें
      try {
        fs.writeFileSync('outgoing_data.txt', `JOB RECOMMENDATION: ${JSON.stringify(result['Recommended Job Category'])}\n`, { flag: 'a' });
      } catch (fsError) {
        console.error("Error writing to log file:", fsError);
      }
      
      // परिणाम भेजें
      res.json(result);
    });
    
  } catch (error) {
    console.error("❌ Score calculation error:", error);
    res.status(500).json({ error: "Error calculating scores" });
  }
});

// Save test result to database
app.post('/api/save-test-result', async (req, res) => {
  console.log("=== SAVE TEST RESULT API CALLED ===");
  console.log("Request Body:", JSON.stringify(req.body, null, 2));
  
  try {
    const { username, scores, jobRecommendation, timeTaken } = req.body;
    
    if (!username || !scores) {
      console.error("❌ Missing required data:", { username: !!username, scores: !!scores });
      return res.status(400).json({ error: 'Missing required data' });
    }

    console.log("🔍 Looking for user:", username);
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.error("❌ User not found:", username);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log("✅ User found:", user._id);

    // Create new test result with job recommendations
    const testResult = new TestResult({
      userId: user._id,
      username: username,
      scores: scores,
      jobRecommendation: {
        category: jobRecommendation?.category || 'General',
        roles: jobRecommendation?.roles || [],
        description: jobRecommendation?.description || ''
      },
      timeTaken: timeTaken || 'Unknown'
    });

    console.log("💾 Saving test result to database...");
    
    const savedResult = await testResult.save();
    
    console.log("✅ Test result saved successfully:", savedResult._id);
    
    res.status(200).json({ 
      message: 'Test result saved successfully',
      testId: savedResult._id,
      saved: true
    });

  } catch (error) {
    console.error('❌ Error saving test result:', error);
    res.status(500).json({ 
      error: 'Failed to save test result',
      details: error.message 
    });
  }
});

// Update the get test results endpoint
app.get('/api/get-test-results/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Fetching test results for:", username);
    
    const testResults = await TestResult.find({ username })
      .sort({ testDate: -1 }) // Sort by date descending (newest first)
      .limit(10); // Get last 10 tests

    console.log("Found test results:", testResults.length);
    console.log("Latest test score:", testResults[0]?.scores?.['Overall Score']);

    res.json(testResults);

  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Failed to fetch test results' });
  }
});

// Add delete test result endpoint
app.delete('/api/delete-test-result/:testId', async (req, res) => {
  console.log("=== DELETE TEST RESULT API CALLED ===");
  
  try {
    const { testId } = req.params;
    console.log("Test ID to delete:", testId);
    
    if (!testId) {
      return res.status(400).json({ error: 'Test ID is required' });
    }

    // Delete from database
    const deletedTest = await TestResult.findByIdAndDelete(testId);
    
    if (!deletedTest) {
      console.warn("Test not found in database:", testId);
      return res.status(404).json({ error: 'Test result not found' });
    }

    console.log("✅ Test result deleted successfully:", deletedTest._id);
    
    res.status(200).json({ 
      message: 'Test result deleted successfully',
      deletedTestId: testId 
    });

  } catch (error) {
    console.error('❌ Error deleting test result:', error);
    res.status(500).json({ 
      error: 'Failed to delete test result',
      details: error.message 
    });
  }
});

// Add debug route to test database
app.get('/api/test-db', async (req, res) => {
  try {
    const testUsers = await User.find().limit(1);
    const testResults = await TestResult.find().limit(1);
    res.json({
      message: 'Database working',
      usersCount: await User.countDocuments(),
      testResultsCount: await TestResult.countDocuments(),
      sampleUser: testUsers[0]?.username || 'None',
      mongooseConnection: mongoose.connection.readyState // 1 = connected
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error.message
    });
  }
});

// Add API endpoint for model feedback
app.post('/api/model-feedback', async (req, res) => {
  try {
    const { username, traitScores, predictedCategory, userFeedback, timestamp } = req.body;
    
    if (!traitScores || !predictedCategory) {
      return res.status(400).json({ error: 'Missing required data' });
    }
    
    // Save feedback to file for model training
    const feedbackData = {
      username: username || 'guest',
      traitScores,
      predictedCategory,
      userFeedback,
      timestamp: timestamp || new Date().toISOString()
    };
    
    // Write to feedback file that will be processed for model training
    const feedbackPath = 'model_feedback.jsonl';
    
    // Append to file
    fs.appendFileSync(
      feedbackPath,
      JSON.stringify(feedbackData) + '\n',
      { encoding: 'utf8' }
    );
    
    // Also run Python script to process this feedback immediately (optional)
    const { spawn } = require('child_process');
    const python = spawn('python', ['process_feedback.py', JSON.stringify(feedbackData)]);
    
    python.on('error', (err) => {
      console.error("Error processing feedback:", err);
    });
    
    res.status(200).json({ message: 'Feedback received successfully' });
    
  } catch (error) {
    console.error("Error handling model feedback:", error);
    res.status(500).json({ error: 'Server error processing feedback' });
  }
});
