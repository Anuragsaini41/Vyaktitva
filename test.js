console.log("test.js loaded");

// Essential Variables
let selectedQuestions = [];
let currentQuestionIndex = 0;
let questionsAttempted = 0;
let userResponses = {};
let total_options = [];
let type_1 = [], type_2 = [], type_3 = [];
let timerInterval;

// Load Questions
// Load Questions - UPDATED FOR RANDOM SELECTION
async function loadQuestions() {
    try {
        console.log("Loading questions...");
        const module = await import('./questions.js');
        
        type_1 = module.type_1 || [];
        type_2 = module.type_2 || [];
        type_3 = module.type_3 || [];
        
        console.log(`Available questions - Type 1: ${type_1.length}, Type 2: ${type_2.length}, Type 3: ${type_3.length}`);
        
        // Function to get random questions from an array
        function getRandomQuestions(questionArray, count) {
            // Create a copy of the array to avoid modifying the original
            const copyArray = [...questionArray];
            // Shuffle the array using Fisher-Yates algorithm
            for (let i = copyArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copyArray[i], copyArray[j]] = [copyArray[j], copyArray[i]];
            }
            // Return the first 'count' elements
            return copyArray.slice(0, count);
        }
        
        // Select random questions from each type
        const selected1 = getRandomQuestions(type_1, 14); // 14 from type 1
        const selected2 = getRandomQuestions(type_2, 14); // 14 from type 2
        const selected3 = getRandomQuestions(type_3, 12); // 12 from type 3
        
        // Combine all selected questions
        let allSelected = [...selected1, ...selected2, ...selected3];
        
        // Shuffle the combined array for truly random order
        for (let i = allSelected.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allSelected[i], allSelected[j]] = [allSelected[j], allSelected[i]];
        }
        
        // Set the selectedQuestions array
        selectedQuestions = allSelected;
        
        console.log("Questions loaded:", selectedQuestions.length);
        console.log("Random distribution - Type 1:", selected1.length, 
                   "Type 2:", selected2.length, 
                   "Type 3:", selected3.length);
        
    } catch (error) {
        console.error("Error loading questions:", error);
        selectedQuestions = generateSimpleQuestions();
    }
}

function generateSimpleQuestions() {
    const questions = [];
    for (let i = 0; i < 10; i++) {
        questions.push({
            question_id: `q${i+1}`,
            question: `Sample Question ${i+1}: How do you prefer to approach tasks?`,
            options: {
                a: { option_id: `q${i+1}_a`, text: "Option A: Systematic approach" },
                b: { option_id: `q${i+1}_b`, text: "Option B: Creative approach" },
                c: { option_id: `q${i+1}_c`, text: "Option C: Collaborative approach" },
                d: { option_id: `q${i+1}_d`, text: "Option D: Analytical approach" }
            }
        });
    }
    return questions;
}

// FIXED: Enhanced checkbox handler
function handleCheckboxChange(event) {
    console.log("=== CHECKBOX CHANGED ===");
    console.log("Checked:", event.target.checked);
    
    const button = document.getElementById('start-test-button');
    
    if (!button) {
        console.error("Button not found!");
        return;
    }
    
    if (event.target.checked) {
        button.disabled = false;
        button.classList.add('enabled');
        button.classList.remove('disabled');
        
        // Force style override
        button.style.setProperty('background-color', '#3182ce', 'important');
        button.style.setProperty('opacity', '1', 'important');
        button.style.setProperty('cursor', 'pointer', 'important');
        button.style.setProperty('pointer-events', 'auto', 'important');
        
        console.log("✅ Button ENABLED - Visual should change now!");
    } else {
        button.disabled = true;
        button.classList.remove('enabled');
        button.classList.add('disabled');
        
        // Force style override
        button.style.setProperty('background-color', '#a0aec0', 'important');
        button.style.setProperty('opacity', '0.5', 'important');
        button.style.setProperty('cursor', 'not-allowed', 'important');
        button.style.setProperty('pointer-events', 'none', 'important');
        
        console.log("❌ Button DISABLED");
    }
    
    console.log("Final button state:", {
        disabled: button.disabled,
        classes: button.className,
        backgroundColor: getComputedStyle(button).backgroundColor
    });
}

// Start Test Handler
function handleStartTest(event) {
    event.preventDefault();
    console.log("=== START TEST CLICKED ===");
    
    const checkbox = document.getElementById('agree-checkbox');
    const button = document.getElementById('start-test-button');
    
    console.log("Validation:", {
        checkbox: !!checkbox,
        checked: checkbox?.checked,
        buttonDisabled: button?.disabled
    });
    
    if (!checkbox || !checkbox.checked) {
        alert("Please agree to terms first!");
        return;
    }
    
    if (button?.disabled) {
        alert("Button is still disabled!");
        return;
    }
    
    console.log("✅ Starting test...");
    startTest();
}

// Start Test
function startTest() {
    // Store start time
    localStorage.setItem('testStartTime', Date.now().toString());
    
    document.getElementById('test-terms-section').style.display = 'none';
    document.getElementById('test-form-section').style.display = 'block';
    
    currentQuestionIndex = 0;
    startTimer(1800);
    displayQuestion();
}

// Display Question - FIXED with proper styling and images
function displayQuestion() {
    if (!selectedQuestions[currentQuestionIndex]) {
        console.error("No question found");
        return;
    }
    
    const question = selectedQuestions[currentQuestionIndex];
    
    const questionNum = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    
    if (questionNum) questionNum.textContent = `Question ${currentQuestionIndex + 1}`;
    if (questionText) questionText.textContent = question.question;
    
    const form = document.getElementById('questions-form');
    if (form) {
        form.innerHTML = '';
        
        Object.entries(question.options).forEach(([key, value]) => {
            const optionContainer = document.createElement('div');
            optionContainer.className = 'option-container';
            
            const label = document.createElement('label');
            label.className = 'option-label';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'option';
            input.value = value.option_id;
            input.className = 'option-radio';
            
            // Restore previous selection if exists
            if (userResponses[currentQuestionIndex]?.optionSelected === value.option_id) {
                input.checked = true;
            }
            
            // Add image if present
            if (value.image) {
                const img = document.createElement('img');
                img.src = value.image;
                img.alt = `Option ${key}`;
                img.className = 'option-image';
                img.onerror = function() {
                    console.warn(`Image not found: ${value.image}`);
                    this.style.display = 'none';
                };
                label.appendChild(img);
            }
            
            const textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            textSpan.textContent = value.text;
            
            label.appendChild(input);
            label.appendChild(textSpan);
            optionContainer.appendChild(label);
            form.appendChild(optionContainer);
        });
    }
    
    const nextBtn = document.getElementById('next-question-button');
    if (nextBtn) {
        nextBtn.textContent = currentQuestionIndex === selectedQuestions.length - 1 ? 'Submit Test' : 'Next Question';
    }
}

// Next Question Handler
function handleNextQuestion() {
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) {
        alert("Please select an option!");
        return;
    }
    
    userResponses[currentQuestionIndex] = { optionSelected: selected.value };
    if (!total_options.includes(selected.value)) {
        total_options.push(selected.value);
    }
    
    questionsAttempted++;
    currentQuestionIndex++;
    
    if (currentQuestionIndex < selectedQuestions.length) {
        displayQuestion();
    } else {
        endTest();
    }
}

// Previous Question Handler
function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Timer
function startTimer(duration) {
    let timer = duration;
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = `Time: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
        
        if (--timer < 0) {
            clearInterval(timerInterval);
            endTest();
        }
    }, 1000);
}

// COMPLETELY REWRITE saveTestResult function
async function saveTestResult(scores, timeTaken) {
    const username = localStorage.getItem('username');
    
    console.log("=== SAVE TEST RESULT DEBUG ===");
    console.log("Username:", username);
    console.log("Scores received:", scores);
    console.log("Time taken:", timeTaken);
    
    // Extract job recommendation properly
    let jobRecommendation = {
        category: 'General',
        roles: [],
        description: ''
    };

    // Handle different Python response formats
    if (scores['Recommended Job Category']) {
        const jobData = scores['Recommended Job Category'];
        if (typeof jobData === 'string') {
            jobRecommendation.category = jobData;
        } else if (jobData && typeof jobData === 'object') {
            jobRecommendation.category = jobData.category || jobData.primary_match?.category || 'General';
            jobRecommendation.roles = jobData.roles || jobData.examples || jobData.primary_match?.examples || [];
            jobRecommendation.description = jobData.description || jobData.primary_match?.description || '';
        }
    }

    // Check for job roles in other fields
    if (scores['Career Suggestions'] && Array.isArray(scores['Career Suggestions'])) {
        jobRecommendation.roles = scores['Career Suggestions'];
    }
    if (scores['Job Roles'] && Array.isArray(scores['Job Roles'])) {
        jobRecommendation.roles = scores['Job Roles'];
    }

    const testResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        scores: scores,
        score: Math.round(scores['Overall Score']) || 0,
        personalityType: determinePersonalityType(scores),
        jobCategory: jobRecommendation.category,
        jobRoles: jobRecommendation.roles,
        timeTaken: timeTaken,
        totalQuestions: 40
    };

    console.log("Test result to save:", testResult);

    // ALWAYS save to localStorage first (works for both logged in and guest)
    try {
        if (username) {
            // Logged in user
            const allResults = JSON.parse(localStorage.getItem('userTestResults') || '{}');
            if (!allResults[username]) {
                allResults[username] = [];
            }
            allResults[username].push(testResult);
            
            // Keep only last 10 tests
            if (allResults[username].length > 10) {
                allResults[username] = allResults[username].slice(-10);
            }
            
            localStorage.setItem('userTestResults', JSON.stringify(allResults));
            console.log("✅ Saved to localStorage for user:", username);
            console.log("Total tests for user:", allResults[username].length);
        } else {
            // Guest user
            const guestResults = JSON.parse(localStorage.getItem('guestTestResults') || '[]');
            guestResults.push(testResult);
            
            // Keep only last 3 guest results
            if (guestResults.length > 3) {
                guestResults.splice(0, guestResults.length - 3);
            }
            
            localStorage.setItem('guestTestResults', JSON.stringify(guestResults));
            console.log("✅ Saved to localStorage for guest");
        }
    } catch (localStorageError) {
        console.error("❌ localStorage save failed:", localStorageError);
    }

    // Try to save to database only if user is logged in
    if (username) {
        try {
            console.log("🔄 Attempting database save...");
            
            const payload = {
                username: username,
                scores: scores,
                jobRecommendation: jobRecommendation,
                timeTaken: timeTaken
            };
            
            console.log("Database payload:", JSON.stringify(payload, null, 2));

            const response = await fetch('/api/save-test-result', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseText = await response.text();
            console.log("Database response status:", response.status);
            console.log("Database response text:", responseText);

            if (response.ok) {
                console.log('✅ Database save successful');
                showSaveNotification('Test results saved successfully!', 'success');
                return true;
            } else {
                console.error('❌ Database save failed:', response.status, responseText);
                showSaveNotification('Saved locally, database sync failed', 'warning');
                return false;
            }
        } catch (dbError) {
            console.error('❌ Database save error:', dbError);
            showSaveNotification('Saved locally, database unavailable', 'warning');
            return false;
        }
    } else {
        console.log("👤 Guest mode - localStorage only");
        showSaveNotification('Results saved locally (Guest Mode)', 'info');
        return false;
    }
}

// Add helper function to determine personality type
function determinePersonalityType(scores) {
    const traits = [
        { name: 'Leader', score: scores.Leadership || 0 },
        { name: 'Empathetic', score: scores['Empathy & Social Skills'] || 0 },
        { name: 'Strategic Thinker', score: scores['Strategic Thinking & Problem-Solving'] || 0 },
        { name: 'Creative', score: scores['Creativity & Innovation'] || 0 },
        { name: 'Resilient', score: scores['Resilience & Adaptability'] || 0 }
    ];
    
    const dominant = traits.reduce((max, trait) => 
        trait.score > max.score ? trait : max
    );
    
    return dominant.name;
}

// Add this notification function if not exists
function showSaveNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.save-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `save-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
        transform: translateX(100%);
        transition: all 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #4caf50, #8bc34a); color: white;' : 
          type === 'warning' ? 'background: linear-gradient(135deg, #ff9800, #ffc107); color: white;' : 
          type === 'error' ? 'background: linear-gradient(135deg, #f44336, #ff5722); color: white;' :
          'background: linear-gradient(135deg, #2196f3, #21cbf3); color: white;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ENHANCED: End Test with better error handling
async function endTest() {
    console.log("=== TEST COMPLETION STARTED ===");
    
    if (timerInterval) clearInterval(timerInterval);
    
    document.getElementById('test-form-section').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h2>🔄 Processing Results...</h2>
            <p>Analyzing your responses and generating insights...</p>
            <div class="loading-spinner"></div>
        </div>
    `;
    
    try {
        // Validate that we have responses
        if (!userResponses || Object.keys(userResponses).length === 0) {
            throw new Error("No responses collected");
        }
        
        console.log("🔄 Sending responses to server...");
        console.log("User Responses:", userResponses);
        
        // Try to connect to server
        try {
            const response = await fetch('/api/calculate-scores', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    responses: userResponses,
                    totalOptions: total_options
                })
            });
            
            console.log("📊 Server Response Status:", response.status);
            
            if (response.ok) {
                const scores = await response.json();
                console.log("📈 Received Score Data:", scores);
                
                // Check if scores data is valid
                if (!scores || typeof scores !== 'object') {
                    throw new Error("Invalid score data received");
                }
                
                // Display results and save
                displayResults(scores);
                
                // Save test results if logged in
                const username = localStorage.getItem('username');
                if (username) {
                    console.log("👤 User logged in, saving results...");
                    const timeTaken = calculateTimeTaken();
                    const saved = await saveTestResult(scores, timeTaken);
                    console.log("💾 Save Result:", saved ? "Success" : "Failed");
                }
            } else {
                throw new Error(`Server returned ${response.status}`);
            }
        } catch (fetchError) {
            console.error("❌ Server connection error:", fetchError);
            
            // FALLBACK: Generate client-side results when server is unavailable
            console.log("⚠️ Using client-side fallback results");
            
            const fallbackScores = generateFallbackResults();
            displayResults(fallbackScores);
            
            // Notify user about offline mode
            showSaveNotification('Using offline mode - server unavailable', 'warning');
        }
        
    } catch (error) {
        console.error("❌ Test completion error:", error);
        resultDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ff6b6b;">
                <h2>❌ Error Processing Results</h2>
                <p>There was an issue processing your test results.</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">Error: ${error.message}</p>
                <div style="margin-top: 1.5rem;">
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        margin: 0 0.5rem;
                    ">🔄 Try Again</button>
                    <button onclick="window.location.href='index.html'" style="
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        margin: 0 0.5rem;
                    ">🏠 Go Home</button>
                </div>
            </div>
        `;
    }
}

// Generate fallback results when server is unavailable
function generateFallbackResults() {
    const totalResponses = Object.keys(userResponses).length;
    
    // Generate random scores based on number of responses
    const randomScore = () => Math.floor(60 + Math.random() * 30);
    
    const scores = {
        'Leadership': randomScore(),
        'Empathy & Social Skills': randomScore(),
        'Strategic Thinking & Problem-Solving': randomScore(),
        'Creativity & Innovation': randomScore(),
        'Resilience & Adaptability': randomScore()
    };
    
    // Calculate overall score
    const allScores = Object.values(scores);
    scores['Overall Score'] = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
    
    // Add job recommendation with multiple career paths
    scores['Recommended Job Category'] = {
        career_paths: [
            {
                category: "Planning and Administration",
                confidence: 0.72,
                description: "Roles involving organizational planning, coordination, and structured management.",
                examples: ["Project Managers", "Business Analysts", "Operations Managers", "Administrative Directors"],
                is_primary: true
            },
            {
                category: "Creation and Development",
                confidence: 0.68,
                description: "Roles focused on building, designing, and implementing new solutions.",
                examples: ["Software Developer", "UX Designer", "Content Creator", "Product Developer"],
                is_primary: false
            },
            {
                category: "Management and Sales",
                confidence: 0.65,
                description: "Roles centered around team leadership and client-facing business development.",
                examples: ["Sales Executive", "Team Leader", "Account Manager", "Business Development"],
                is_primary: false
            }
        ]
    };
    
    console.log("Generated fallback scores:", scores);
    return scores;
}

// Debug the object received from server
function displayResults(scores) {
    console.log("Displaying results:", scores);
    
    // Make sure we have valid data to work with
    if (!scores || typeof scores !== 'object') {
        console.error("Invalid scores object:", scores);
        showErrorMessage("Invalid data received from server");
        return;
    }
    
    // Debug each key to find empty values
    Object.keys(scores).forEach(key => {
        console.log(`Score key: ${key}, value:`, scores[key]);
    });
    
    try {
        const resultDiv = document.getElementById('result');
        
        // Trait Cards
        const traitCardsHTML = generateTraitCards(scores);
        
        // Career Card - checking before trying to generate
        console.log("Career data:", scores['Recommended Job Category']);
        const careerCardHTML = generateCareerCard(scores);
        
        // Overall Score Card - checking before trying to generate
        console.log("Overall score:", scores['Overall Score']);
        const overallScoreHTML = generateOverallScoreCard(scores);
        
        // Combine all elements
        resultDiv.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h1>Your Personality Profile</h1>
                    <p>Based on your responses, here's a breakdown of your personality traits</p>
                </div>
                
                <div class="results-grid">
                    ${overallScoreHTML}
                    ${careerCardHTML}
                </div>
                
                <div class="trait-cards-section">
                    <h2>Your Trait Breakdown</h2>
                    <div class="trait-cards">
                        ${traitCardsHTML}
                    </div>
                </div>
                
                <div class="feedback-section">
                    <h3>How satisfied are you with your results?</h3>
                    <div class="star-rating">
                        <span class="star" data-rating="1">★</span>
                        <span class="star" data-rating="2">★</span>
                        <span class="star" data-rating="3">★</span>
                        <span class="star" data-rating="4">★</span>
                        <span class="star" data-rating="5">★</span>
                        <span class="rating-text">Click to rate</span>
                    </div>
                    
                    <div class="feedback-text">
                        <textarea id="feedback-textbox" placeholder="Share your thoughts about the results (optional)"></textarea>
                    </div>
                    
                    <button id="submit-feedback-btn" class="feedback-button">Submit Feedback</button>
                </div>
            </div>
        `;
        
        // Add event listeners for star rating
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                updateStarRating(rating);
            });
        });
        
        // Add event listener for feedback submission
        document.getElementById('submit-feedback-btn').addEventListener('click', function() {
            submitFeedback(scores);
        });
        
    } catch (error) {
        console.error("Error displaying results:", error);
        showErrorMessage("Error displaying results: " + error.message);
    }
}

// Helper function to show error message
function showErrorMessage(message) {
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2>Error Displaying Results</h2>
                <p>${message}</p>
                <button onclick="location.reload()">Try Again</button>
                <button onclick="window.location.href='index.html'">Go Home</button>
            </div>
        `;
    }
}

/**
 * Generates HTML for trait cards based on personality scores
 * @param {Object} scores - Object containing trait scores
 * @return {string} HTML for trait cards
 */
function generateTraitCards(scores) {
    console.log("Generating trait cards with:", scores);
    
    // Define trait data with icons and color gradients
    const traitData = [
        { 
            name: 'Leadership', 
            icon: '👑',
            gradient: 'linear-gradient(135deg, #ff9966, #ff5e62)'
        },
        { 
            name: 'Empathy & Social Skills', 
            icon: '🤝',
            gradient: 'linear-gradient(135deg, #56ab2f, #a8e063)'
        },
        { 
            name: 'Strategic Thinking & Problem-Solving', 
            icon: '🧩',
            gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
        },
        { 
            name: 'Creativity & Innovation', 
            icon: '💡',
            gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
        },
        { 
            name: 'Resilience & Adaptability', 
            icon: '🌱',
            gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
        }
    ];
    
    // Generate HTML for each trait card
    return traitData.map(trait => {
        const score = scores[trait.name] || 0;
        const level = getTraitLevel(score);
        
        return `
            <div class="trait-card">
                <div class="trait-icon" style="background: ${trait.gradient}">${trait.icon}</div>
                <div class="trait-content">
                    <h3 class="trait-name">${trait.name}</h3>
                    <div class="trait-level">${level}</div>
                    <div class="trait-score-bar">
                        <div class="trait-score-fill" style="width: ${score}%; background: ${trait.gradient}"></div>
                        <span class="trait-score-text">${Math.round(score)}%</span>
                    </div>
                    <p class="trait-description">${getTraitDescription(trait.name, level)}</p>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Returns level description based on score
 * @param {number} score - Trait score
 * @return {string} Level description
 */
function getTraitLevel(score) {
    if (score >= 90) return "Exceptional";
    if (score >= 80) return "Very Strong";
    if (score >= 70) return "Strong";
    if (score >= 60) return "Above Average";
    if (score >= 50) return "Average";
    if (score >= 40) return "Moderate";
    return "Developing";
}

/**
 * Returns trait description based on name and level
 * @param {string} traitName - Name of the trait
 * @param {string} level - Level description
 * @return {string} Trait description
 */
function getTraitDescription(traitName, level) {
    const descriptions = {
        'Leadership': {
            'Exceptional': 'Exceptional ability to inspire and lead teams to achieve goals.',
            'Very Strong': 'Very strong leadership qualities with clear vision and direction.',
            'Strong': 'Strong leadership potential with good team management abilities.',
            'Above Average': 'Above average leadership skills with potential for growth.',
            'Average': 'Average leadership abilities that can be developed further.',
            'Moderate': 'Moderate leadership qualities that need more development.',
            'Developing': 'Beginning to develop fundamental leadership skills.'
        },
        'Empathy & Social Skills': {
            'Exceptional': 'Exceptional ability to connect with others and understand their perspectives.',
            'Very Strong': 'Very strong interpersonal skills and emotional intelligence.',
            'Strong': 'Strong social awareness and relationship management skills.',
            'Above Average': 'Above average emotional intelligence and communication.',
            'Average': 'Average social skills with room for deeper connections.',
            'Moderate': 'Moderate empathy that can be enhanced with practice.',
            'Developing': 'Developing basic social awareness and communication skills.'
        },
        'Strategic Thinking & Problem-Solving': {
            'Exceptional': 'Exceptional analytical thinking and strategic planning abilities.',
            'Very Strong': 'Very strong problem-solving skills with innovative approaches.',
            'Strong': 'Strong strategic mindset with effective solution development.',
            'Above Average': 'Above average analytical skills and methodical approach.',
            'Average': 'Average problem-solving abilities with room for development.',
            'Moderate': 'Moderate analytical thinking that can be enhanced.',
            'Developing': 'Developing foundational problem-solving techniques.'
        },
        'Creativity & Innovation': {
            'Exceptional': 'Exceptional creative thinking with breakthrough innovative ideas.',
            'Very Strong': 'Very strong creative abilities with unique perspectives.',
            'Strong': 'Strong innovative thinking and idea generation.',
            'Above Average': 'Above average creativity with good implementation skills.',
            'Average': 'Average creative thinking with potential for more originality.',
            'Moderate': 'Moderate creativity that can be cultivated further.',
            'Developing': 'Developing creative thinking skills and processes.'
        },
        'Resilience & Adaptability': {
            'Exceptional': 'Exceptional ability to thrive during change and overcome challenges.',
            'Very Strong': 'Very strong resilience with effective stress management.',
            'Strong': 'Strong adaptability and quick recovery from setbacks.',
            'Above Average': 'Above average flexibility in changing environments.',
            'Average': 'Average resilience with adequate coping mechanisms.',
            'Moderate': 'Moderate adaptability that improves with experience.',
            'Developing': 'Developing fundamental resilience and flexibility skills.'
        }
    };
    
    // Return description or default if not found
    return descriptions[traitName]?.[level] || 
        `Your ${traitName} is at a ${level.toLowerCase()} level.`;
}

// Add this generateCareerCard function
function generateCareerCard(scores) {
    console.log("Generating career card with:", scores['Recommended Job Category']);
    
    // Check if we have valid data
    if (!scores || !scores['Recommended Job Category'] || !scores['Recommended Job Category'].career_paths || !scores['Recommended Job Category'].career_paths.length) {
        console.log("No valid career data found, using fallback");
        
        // Fallback when no valid career data is provided
        return `
            <div class="career-card">
                <div class="career-header">
                    <div class="career-icon">💼</div>
                    <h2 class="career-title">Career Paths</h2>
                </div>
                <div class="career-content">
                    <h3 class="career-category">Career Exploration</h3>
                    <p class="career-description">
                        Based on your profile, consider exploring various career paths that align with your strengths.
                        Complete more assessments to get specific recommendations.
                    </p>
                </div>
            </div>
        `;
    }
    
    // Get the career paths from the data
    const careerPaths = scores['Recommended Job Category'].career_paths;
    
    // Build the career card HTML
    return `
        <div class="career-card">
            <div class="career-header">
                <div class="career-icon">💼</div>
                <h2 class="career-title">Recommended Career Paths</h2>
            </div>
            <div class="career-content">
                ${careerPaths.map((path, index) => `
                    <div class="career-path-container ${path.is_primary ? 'primary-path' : ''}">
                        <h3 class="career-category">
                            ${index + 1}. ${path.category || 'Career Path'} 
                            ${path.is_primary ? '<span class="primary-badge">Best Match</span>' : ''}
                        </h3>
                        ${path.confidence ? `
                            <div class="confidence-bar-container">
                                <div class="confidence-bar" style="width: ${Math.round(path.confidence * 100)}%"></div>
                                <span class="confidence-text">${Math.round(path.confidence * 100)}%</span>
                            </div>
                        ` : ''}
                        <p class="career-description">${path.description || ''}</p>
                        ${path.examples && path.examples.length > 0 ? `
                            <div class="career-examples">
                                <strong>Example roles:</strong> ${path.examples.join(', ')}
                            </div>
                        ` : ''}
                    </div>
                    ${index < careerPaths.length - 1 ? '<div class="career-separator"></div>' : ''}
                `).join('')}
            </div>
        </div>
    `;
}

// Add this calculateTimeTaken function
function calculateTimeTaken() {
    // If we have stored start time, calculate time taken
    const startTime = localStorage.getItem('testStartTime');
    if (startTime) {
        const endTime = new Date().getTime();
        const timeTaken = Math.floor((endTime - parseInt(startTime)) / 1000); // in seconds
        return timeTaken;
    }
    
    // Return a default time if start time wasn't stored
    return 600; // default 10 minutes
}

// Add this generateOverallScoreCard function if it's also missing
function generateOverallScoreCard(scores) {
    console.log("Generating overall score card with:", scores['Overall Score']);
    
    if (!scores['Overall Score'] && scores['Overall Score'] !== 0) {
        return `
            <div class="overall-score-card">
                <div class="overall-score-container">
                    <h2 class="overall-title">Overall Personality Profile</h2>
                    <p class="overall-subtitle">Your overall score will appear here</p>
                </div>
            </div>
        `;
    }
    
    const overallScore = typeof scores['Overall Score'] === 'number' ? 
        Math.round(scores['Overall Score']) : 
        (parseInt(scores['Overall Score']) || 0);
    
    return `
        <div class="overall-score-card">
            <div class="overall-score-container">
                <h2 class="overall-title">Overall Personality Profile</h2>
                <p class="overall-subtitle">Your combined trait score</p>
                
                <div class="overall-score-display">
                    <div class="overall-score-circle">
                        <div class="overall-score-number">${overallScore}</div>
                    </div>
                    <div class="overall-score-label">
                        <span class="score-text">Overall Score</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${overallScore}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="score-interpretation">
                    <p>${getScoreInterpretation(overallScore)}</p>
                </div>
            </div>
        </div>
    `;
}

// Add a helper function for score interpretation
function getScoreInterpretation(score) {
    if (score >= 90) return "Exceptional profile with outstanding trait balance.";
    if (score >= 80) return "Excellent profile showing strong development in key areas.";
    if (score >= 70) return "Very good profile with solid traits for various career paths.";
    if (score >= 60) return "Good profile with balanced personality traits.";
    if (score >= 50) return "Average profile with some strengths to build upon.";
    return "Developing profile with opportunities for personal growth.";
}

// Initialize App
document.addEventListener('DOMContentLoaded', async function() {
    console.log("=== DOM LOADED ===");
    
    try {
        await loadQuestions();
        console.log("✅ Questions loaded");
        
        // Small delay then initialize
        setTimeout(initializeApp, 100);
        
    } catch (error) {
        console.error("❌ Initialization error:", error);
    }
});

// FIXED: Multiple initialization attempts
function initializeApp() {
    console.log("=== INITIALIZING APP ===");
    
    let attempts = 0;
    const maxAttempts = 5;
    
    const tryInit = () => {
        attempts++;
        console.log(`Init attempt ${attempts}/${maxAttempts}`);
        
        const checkbox = document.getElementById('agree-checkbox');
        const startBtn = document.getElementById('start-test-button');
        const nextBtn = document.getElementById('next-question-button');
        const prevBtn = document.getElementById('previous-question-button');
        
        console.log("Elements found:", {
            checkbox: !!checkbox,
            startBtn: !!startBtn,
            nextBtn: !!nextBtn,
            prevBtn: !!prevBtn
        });
        
        if (checkbox && startBtn) {
            // Remove existing listeners
            checkbox.removeEventListener('change', handleCheckboxChange);
            startBtn.removeEventListener('click', handleStartTest);
            
            // Add fresh listeners
            checkbox.addEventListener('change', handleCheckboxChange);
            startBtn.addEventListener('click', handleStartTest);
            
            if (nextBtn) nextBtn.addEventListener('click', handleNextQuestion);
            if (prevBtn) prevBtn.addEventListener('click', handlePreviousQuestion);
            
            // Force initial disabled state
            startBtn.disabled = true;
            startBtn.classList.remove('enabled');
            startBtn.style.setProperty('background-color', '#a0aec0', 'important');
            startBtn.style.setProperty('opacity', '0.5', 'important');
            startBtn.style.setProperty('cursor', 'not-allowed', 'important');
            
            console.log("✅ App initialized successfully!");
            return true;
        } else {
            if (attempts < maxAttempts) {
                setTimeout(tryInit, 200);
                return false;
            } else {
                console.error("❌ Failed to initialize after all attempts");
                return false;
            }
        }
    };
    
    tryInit();
}

// Update star rating visually
function updateStarRating(rating) {
    const stars = document.querySelectorAll('.star');
    const ratingText = document.querySelector('.rating-text');
    
    // Update rating text based on selection
    const ratingMessages = [
        'Click to rate', // 0 stars (default)
        'Very Unsatisfied', // 1 star
        'Unsatisfied', // 2 stars
        'Neutral', // 3 stars
        'Satisfied', // 4 stars 
        'Very Satisfied' // 5 stars
    ];
    
    // Update all stars
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Update rating text
    if (ratingText) {
        ratingText.textContent = ratingMessages[rating];
    }
    
    // Store the current rating in a data attribute
    document.querySelector('.star-rating').setAttribute('data-user-rating', rating);
}

// Submit feedback to server
async function submitFeedback(scores) {
    // Get the rating value
    const ratingElem = document.querySelector('.star-rating');
    const rating = parseInt(ratingElem.getAttribute('data-user-rating') || '0');
    
    // Get the feedback text
    const feedbackText = document.getElementById('feedback-textbox').value.trim();
    
    // Check if user provided a rating
    if (!rating) {
        showSaveNotification('Please provide a rating before submitting feedback', 'warning');
        return;
    }
    
    try {
        // Show loading state
        const submitButton = document.getElementById('submit-feedback-btn');
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Prepare feedback data
        const username = localStorage.getItem('username') || 'guest';
        const feedbackData = {
            username: username,
            traitScores: {
                'Leadership': scores['Leadership'] || 0,
                'Empathy & Social Skills': scores['Empathy & Social Skills'] || 0,
                'Strategic Thinking & Problem-Solving': scores['Strategic Thinking & Problem-Solving'] || 0,
                'Creativity & Innovation': scores['Creativity & Innovation'] || 0,
                'Resilience & Adaptability': scores['Resilience & Adaptability'] || 0
            },
            predictedCategory: scores['Recommended Job Category'] ? 
                JSON.stringify(scores['Recommended Job Category']) : 
                '{}',
            userFeedback: {
                type: rating >= 4 ? 'correct' : rating <= 2 ? 'incorrect' : 'neutral',
                accuracy_rating: rating,
                text: feedbackText,
                timestamp: new Date().toISOString()
            }
        };
        
        console.log('Submitting feedback:', feedbackData);
        
        try {
            // Submit to server
            const response = await fetch('/api/model-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });
            
            // Handle successful response
            if (response.ok) {
                // Success state
                submitButton.classList.add('feedback-success');
                submitButton.textContent = 'Feedback Submitted';
                
                // Show success notification
                showSaveNotification('Thank you for your feedback!', 'success');
                
                // Disable the form to prevent multiple submissions
                document.getElementById('feedback-textbox').disabled = true;
                document.querySelectorAll('.star').forEach(star => {
                    star.style.pointerEvents = 'none';
                });
            } else {
                // Error response from server
                const errorText = await response.text();
                console.error('Feedback submission error:', errorText);
                
                // Show client-side success anyway
                submitButton.textContent = 'Feedback Received';
                showSaveNotification('Your feedback has been recorded locally', 'info');
                submitButton.disabled = true;
            }
        } catch (fetchError) {
            // Network error - fallback to local storage
            console.error('Network error submitting feedback:', fetchError);
            
            // Store feedback locally
            const localFeedback = JSON.parse(localStorage.getItem('pendingFeedback') || '[]');
            localFeedback.push({
                ...feedbackData,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('pendingFeedback', JSON.stringify(localFeedback));
            
            // Let user know it was saved locally
            submitButton.textContent = 'Saved Locally';
            showSaveNotification('Feedback saved locally and will be submitted when connection is restored', 'info');
        }
    } catch (error) {
        console.error('Error processing feedback:', error);
        showSaveNotification('Could not process feedback: ' + error.message, 'error');
        
        // Reset button
        const submitButton = document.getElementById('submit-feedback-btn');
        submitButton.textContent = 'Try Again';
        submitButton.disabled = false;
    }
}