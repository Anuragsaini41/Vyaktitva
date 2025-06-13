#!/usr/bin/env python3
import os
import json
import sys
import pandas as pd
import numpy as np
from datetime import datetime
from job_predictor import JobPredictor

def process_feedback(feedback_data):
    """
    Process model feedback and use it for continuous learning
    """
    try:
        # Extract trait scores and feedback
        trait_scores = feedback_data.get('traitScores', {})
        predicted_category = feedback_data.get('predictedCategory', {})
        user_feedback = feedback_data.get('userFeedback', {})
        
        print("Processing feedback from user:", feedback_data.get('username', 'anonymous'))
        print("Trait scores:", trait_scores)
        print("User feedback type:", user_feedback.get('type'))
        
        if not trait_scores or len(trait_scores) < 5:
            print("Error: Missing or incomplete trait scores in feedback")
            return False
            
        # Initialize predictor
        predictor = JobPredictor()
        
        # Process based on feedback type
        feedback_type = user_feedback.get('type')
        
        if feedback_type == 'correct':
            # User confirms prediction was correct - use it for training
            category = predicted_category.get('category') if isinstance(predicted_category, dict) else predicted_category
            print(f"Adding confirmed training data for category: {category}")
            predictor.add_training_data(trait_scores, job_category=category, 
                                       feedback={'accurate': True})
            
        elif feedback_type == 'incorrect':
            # User says prediction was wrong - if they provided correct category, use that
            actual_category = user_feedback.get('actualCategory')
            if actual_category:
                print(f"Adding corrected training data. Actual category: {actual_category}")
                predictor.add_training_data(trait_scores, job_category=actual_category,
                                          feedback={'accurate': False, 'actual_category': actual_category})
                
        elif feedback_type == 'suggestion':
            # User has suggestions - save these for review
            suggestion_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'user_suggestions')
            os.makedirs(suggestion_dir, exist_ok=True)
            
            with open(os.path.join(suggestion_dir, 'suggestions.txt'), 'a') as f:
                f.write(f"Suggestion from {feedback_data.get('username', 'anonymous')}:\n")
                f.write(f"Traits: {json.dumps(trait_scores)}\n")
                f.write(f"Prediction: {predicted_category}\n")
                f.write(f"Suggestion: {user_feedback.get('text', '')}\n")
                f.write("-" * 40 + "\n")
            
            print(f"Saved user suggestion for review")
        
        return True
                
    except Exception as e:
        print(f"Error processing feedback: {str(e)}")
        traceback.print_exc()
        return False

def process_user_feedback(username, trait_scores, recommended_category, user_feedback):
    """Process user feedback for model improvement."""
    try:
        feedback_file = "user_feedback.json"
        feedback_data = {
            "username": username,
            "timestamp": str(datetime.now()),
            "trait_scores": trait_scores,
            "recommended_category": recommended_category,
            "user_feedback": user_feedback
        }
        
        # सेव फीडबैक डेटा
        if os.path.exists(feedback_file):
            with open(feedback_file, 'r') as f:
                try:
                    existing_data = json.load(f)
                except json.JSONDecodeError:
                    existing_data = []
            
            if not isinstance(existing_data, list):
                existing_data = []
                
            existing_data.append(feedback_data)
            with open(feedback_file, 'w') as f:
                json.dump(existing_data, f, indent=2)
        else:
            with open(feedback_file, 'w') as f:
                json.dump([feedback_data], f, indent=2)
        
        print(f"Feedback from {username} processed successfully")
        
        # फीडबैक से लर्निंग डेटा बनाएं
        if user_feedback.get("accuracy_rating", 0) >= 4:  # अच्छा फीडबैक
            create_training_data_from_feedback(trait_scores, recommended_category)
            
        return True
    
    except Exception as e:
        print(f"Error processing feedback: {e}")
        return False

def create_training_data_from_feedback(trait_scores, recommended_category):
    """Create training data from accurate feedback."""
    try:
        data_path = "dataset.csv"
        primary_category = recommended_category.get("primary_category", "")
        
        # अगर कोई कैटेगरी नहीं है तो एग्जिट करें
        if not primary_category:
            return False
            
        # नया डेटा बनाएं
        new_data = {
            'Leadership': trait_scores.get('Leadership', 0),
            'Empathy': trait_scores.get('Empathy & Social Skills', 0),
            'Strategic': trait_scores.get('Strategic Thinking & Problem-Solving', 0),
            'Creativity': trait_scores.get('Creativity & Innovation', 0),
            'Resilience': trait_scores.get('Resilience & Adaptability', 0),
            'job_category': primary_category
        }
        
        # डेटासेट में जोड़ें
        if os.path.exists(data_path):
            df = pd.read_csv(data_path)
            df = pd.concat([df, pd.DataFrame([new_data])], ignore_index=True)
        else:
            df = pd.DataFrame([new_data])
        
        # सेव डेटा
        df.to_csv(data_path, index=False)
        
        print(f"Added feedback data to training dataset for category: {primary_category}")
        return True
        
    except Exception as e:
        print(f"Error creating training data from feedback: {e}")
        return False

def analyze_feedback():
    """Analyze collected user feedback."""
    feedback_file = "user_feedback.json"
    
    if not os.path.exists(feedback_file):
        print("No feedback data available for analysis")
        return
    
    try:
        with open(feedback_file, 'r') as f:
            try:
                feedback_data = json.load(f)
            except json.JSONDecodeError:
                feedback_data = []
        
        if not feedback_data:
            print("Feedback file exists but contains no valid data")
            return
            
        # फीडबैक का विश्लेषण करें
        total_feedback = len(feedback_data)
        ratings = [f.get('user_feedback', {}).get('accuracy_rating', 0) for f in feedback_data]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        positive_feedback = len([r for r in ratings if r >= 4])
        negative_feedback = len([r for r in ratings if r <= 2])
        
        satisfaction = (positive_feedback / total_feedback) * 100 if total_feedback > 0 else 0
        
        print("\n=== FEEDBACK ANALYSIS ===")
        print(f"Total feedback entries: {total_feedback}")
        print(f"Average rating: {avg_rating:.2f}/5.0")
        print(f"Positive feedback: {positive_feedback} ({satisfaction:.1f}%)")
        print(f"Negative feedback: {negative_feedback} ({100-satisfaction:.1f}%)")
        
        # अगर एक्यूरेसी कम है, तो रीट्रेनिंग सजेस्ट करें
        if satisfaction < 70 and total_feedback >= 10:
            print("\n⚠️ Recommendation: Model retraining suggested due to low user satisfaction")
            
    except Exception as e:
        print(f"Error analyzing feedback: {e}")

if __name__ == "__main__":
    print("=== FEEDBACK PROCESSOR ===")
    
    # कमांड लाइन आर्ग्यूमेंट्स से फीडबैक प्रोसेस करें
    if len(sys.argv) > 1:
        try:
            feedback_data = json.loads(sys.argv[1])
            username = feedback_data.get('username', 'unknown_user')
            trait_scores = feedback_data.get('trait_scores', {})
            recommended_category = feedback_data.get('recommended_category', {})
            user_feedback = feedback_data.get('feedback', {})
            
            process_user_feedback(username, trait_scores, recommended_category, user_feedback)
        except Exception as e:
            print(f"Error processing command line feedback: {e}")
    
    # फीडबैक का विश्लेषण करें
    analyze_feedback()