try:
    import job_predictor
    print("Job predictor imported successfully")
    
    example_scores = {
        'Leadership': 70.0,
        'Empathy & Social Skills': 65.5,
        'Strategic Thinking & Problem-Solving': 80.0,
        'Creativity & Innovation': 75.0,
        'Resilience & Adaptability': 60.0
    }
    
    result = job_predictor.get_job_prediction(example_scores)
    print(f"Prediction result: {result}")
    
except Exception as e:
    print(f"Error: {e}")