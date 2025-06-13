from job_predictor import get_job_prediction

# Test cases representing different personality profiles
test_cases = [
    # Original test cases
    {
        "name": "Creative Designer",
        "traits": {
            'Leadership': 65.0,
            'Empathy & Social Skills': 55.0,
            'Strategic Thinking & Problem-Solving': 85.0,
            'Creativity & Innovation': 95.0,
            'Resilience & Adaptability': 70.0
        },
        "expected_category": "Creation and Development"
    },
    {
        "name": "Project Manager",
        "traits": {
            'Leadership': 90.0,
            'Empathy & Social Skills': 75.0,
            'Strategic Thinking & Problem-Solving': 85.0,
            'Creativity & Innovation': 65.0,
            'Resilience & Adaptability': 80.0
        },
        "expected_category": "Planning and Administration"
    },
    {
        "name": "Sales Executive",
        "traits": {
            'Leadership': 75.0,
            'Empathy & Social Skills': 95.0,
            'Strategic Thinking & Problem-Solving': 70.0,
            'Creativity & Innovation': 80.0,
            'Resilience & Adaptability': 85.0
        },
        "expected_category": "Management and Sales"
    },
    # Additional test cases
    {
        "name": "Software Developer",
        "traits": {
            'Leadership': 60.0,
            'Empathy & Social Skills': 45.0,
            'Strategic Thinking & Problem-Solving': 95.0,
            'Creativity & Innovation': 90.0,
            'Resilience & Adaptability': 75.0
        }
    },
    {
        "name": "Team Leader",
        "traits": {
            'Leadership': 85.0,
            'Empathy & Social Skills': 80.0,
            'Strategic Thinking & Problem-Solving': 75.0,
            'Creativity & Innovation': 65.0,
            'Resilience & Adaptability': 90.0
        }
    },
    {
        "name": "Marketing Specialist",
        "traits": {
            'Leadership': 65.0,
            'Empathy & Social Skills': 90.0,
            'Strategic Thinking & Problem-Solving': 75.0,
            'Creativity & Innovation': 85.0,
            'Resilience & Adaptability': 80.0
        }
    },
    {
        "name": "Balanced Profile",
        "traits": {
            'Leadership': 75.0,
            'Empathy & Social Skills': 75.0,
            'Strategic Thinking & Problem-Solving': 75.0,
            'Creativity & Innovation': 75.0,
            'Resilience & Adaptability': 75.0
        }
    },
    {
        "name": "High All Traits",
        "traits": {
            'Leadership': 95.0,
            'Empathy & Social Skills': 95.0,
            'Strategic Thinking & Problem-Solving': 95.0,
            'Creativity & Innovation': 95.0,
            'Resilience & Adaptability': 95.0
        }
    },
    {
        "name": "Low All Traits",
        "traits": {
            'Leadership': 35.0,
            'Empathy & Social Skills': 35.0,
            'Strategic Thinking & Problem-Solving': 35.0,
            'Creativity & Innovation': 35.0,
            'Resilience & Adaptability': 35.0
        }
    }
]

print("===== VYAKTITVA JOB PREDICTION MODEL TEST =====\n")

# Test each profile
for test_case in test_cases:
    print(f"Testing profile: {test_case['name']}")
    print("Trait scores:")
    for trait, score in test_case['traits'].items():
        print(f"  {trait}: {score}")
    
    # Get prediction
    result = get_job_prediction(test_case['traits'])
    
    # Display results
    primary = result.get("primary_match", {})
    print(f"\nPredicted category: {primary.get('category', 'Unknown')}")
    print(f"Confidence: {primary.get('confidence', 0)*100:.1f}%")
    
    if "trait_job_alignment" in result:
        alignment = result["trait_job_alignment"]
        print(f"Job fit: {alignment.get('overall_match_percentage', 0):.1f}%")
    
    print("\n" + "-"*50 + "\n")

print("All test cases completed!")

# Your existing code that calculates trait scores
trait_scores = {
    'Leadership': 75.0,
    'Empathy & Social Skills': 60.0,
    'Strategic Thinking & Problem-Solving': 85.0,
    'Creativity & Innovation': 90.0,
    'Resilience & Adaptability': 70.0
}

# Get job prediction
prediction = get_job_prediction(trait_scores)

# Access the primary recommendation
recommended_job = prediction['primary_match']['category']
confidence = prediction['primary_match']['confidence']

print(f"Recommended job category: {recommended_job} (Confidence: {confidence:.2%})")