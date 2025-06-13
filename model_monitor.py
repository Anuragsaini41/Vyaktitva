import sys  # This was missing but used in the code
import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
import time
import matplotlib.pyplot as plt
from job_predictor import JobPredictor, load_model
from collections import defaultdict

try:
    import schedule
    scheduling_available = True
except ImportError:
    scheduling_available = False
    print("Warning: Scheduling package not installed. Install schedule for automatic monitoring.")

def validate_model():
    """Comprehensive model validation with detailed analysis"""
    try:
        # Load test cases
        from test_model import test_cases
        
        # Update test cases with expected categories if missing
        updated_test_cases = []
        for case in test_cases:
            if "expected_category" not in case:
                # Add expected categories based on profile names
                if "Project Manager" in case["name"]:
                    case["expected_category"] = "Planning and Administration"
                elif "Designer" in case["name"] or "Developer" in case["name"]:
                    case["expected_category"] = "Creation and Development"
                elif "Sales" in case["name"] or "Marketing" in case["name"]:
                    case["expected_category"] = "Management and Sales"
            
            updated_test_cases.append(case)
            
        # Initialize predictor
        predictor = JobPredictor()
        
        # Track performance
        correct_predictions = 0
        total_predictions = 0
        confidence_sum = 0
        results = []
        
        # Track performance by category
        category_metrics = defaultdict(lambda: {"correct": 0, "total": 0})
        
        # Track trait-based performance
        trait_correlations = {trait: [] for trait in predictor.feature_names}
        
        # Test each case
        for test_case in updated_test_cases:
            expected_category = test_case.get("expected_category", "")
            name = test_case.get("name", "Unnamed")
            
            # Get prediction
            result = predictor.predict(test_case["traits"])
            
            # Record results
            predicted = result.get("primary_match", {}).get("category", "Unknown")
            confidence = result.get("primary_match", {}).get("confidence", 0)
            
            is_correct = (expected_category and predicted == expected_category)
            if is_correct:
                correct_predictions += 1
                
            if expected_category:
                category_metrics[expected_category]["total"] += 1
                if is_correct:
                    category_metrics[expected_category]["correct"] += 1
            
            total_predictions += 1
            confidence_sum += confidence
            
            # Record trait data for correlation analysis
            for trait, score in test_case["traits"].items():
                # Record whether high/low values of this trait correlate with correct prediction
                trait_correlations[trait].append((score, is_correct))
            
            results.append({
                "name": name,
                "expected": expected_category,
                "predicted": predicted,
                "confidence": confidence,
                "is_correct": is_correct,
                "traits": test_case["traits"]
            })
        
        # Calculate overall metrics
        valid_predictions = sum(1 for case in updated_test_cases if "expected_category" in case)
        accuracy = correct_predictions / valid_predictions if valid_predictions > 0 else 0
        avg_confidence = confidence_sum / total_predictions if total_predictions > 0 else 0
        
        # Calculate per-category metrics
        category_accuracy = {}
        for category, metrics in category_metrics.items():
            if metrics["total"] > 0:
                category_accuracy[category] = metrics["correct"] / metrics["total"]
            else:
                category_accuracy[category] = 0
        
        # Calculate trait correlations
        trait_insights = {}
        for trait, data in trait_correlations.items():
            if data:
                # Find correlation between trait score and correct prediction
                scores = [x[0] for x in data]
                correctness = [1 if x[1] else 0 for x in data]
                
                # Check if we have variation in the data
                if len(set(scores)) > 1 and len(set(correctness)) > 1:
                    correlation = np.corrcoef(scores, correctness)[0, 1]
                    trait_insights[trait] = {
                        "correlation": correlation,
                        "strength": abs(correlation),
                        "direction": "positive" if correlation > 0 else "negative"
                    }
        
        # Log detailed results
        print(f"\nModel Validation Results:")
        print(f"Overall Accuracy: {accuracy:.2%}")
        print(f"Average Confidence: {avg_confidence:.2%}")
        
        print("\nAccuracy by Category:")
        for category, acc in category_accuracy.items():
            total = category_metrics[category]["total"]
            correct = category_metrics[category]["correct"]
            print(f"  {category}: {acc:.2%} ({correct}/{total})")
        
        print("\nTrait Importance for Prediction Accuracy:")
        sorted_traits = sorted(
            [(trait, insights["strength"]) for trait, insights in trait_insights.items()],
            key=lambda x: x[1],
            reverse=True
        )
        for trait, strength in sorted_traits:
            direction = trait_insights[trait]["direction"]
            print(f"  {trait}: {strength:.3f} ({direction} correlation)")
        
        # Save validation results
        validation_result = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "accuracy": accuracy,
            "confidence": avg_confidence,
            "results": results,
            "category_accuracy": category_accuracy,
            "trait_insights": trait_insights
        }
        
        # Append to history
        history_path = "model_validation_history.json"
        if os.path.exists(history_path):
            with open(history_path, 'r') as f:
                history = json.load(f)
        else:
            history = []
            
        history.append(validation_result)
        
        with open(history_path, 'w') as f:
            json.dump(history, f, indent=2)
        
        # Generate validation visualization
        create_validation_visualization(validation_result)
        
        # Return validation result
        return validation_result
            
    except Exception as e:
        print(f"Error validating model: {str(e)}")
        return None

def check_model_performance():
    """Check current model performance metrics."""
    try:
        # मॉडल लोड करें
        model_data = load_model(rebuild=False)
        
        # फीचर इम्पोर्टेंस देखें
        if 'feature_importance' in model_data:
            print("\n=== FEATURE IMPORTANCE ===")
            for feature, importance in sorted(model_data['feature_importance'].items(), 
                                             key=lambda x: x[1], reverse=True):
                print(f"{feature}: {importance:.4f}")
        
        # लास्ट अपडेट देखें
        if 'last_updated' in model_data:
            print(f"\nModel last updated: {model_data['last_updated']}")
        
        return True
    except Exception as e:
        print(f"Error checking model performance: {e}")
        return False

def check_and_retrain():
    """Check if model needs retraining based on new data."""
    data_path = "accumulated_dataset.csv"
    
    if not os.path.exists(data_path):
        print("No accumulated data found. Model retraining skipped.")
        return False
    
    try:
        # डेटा लोड करें
        df = pd.read_csv(data_path)
        
        # कितने रेकॉर्ड्स हैं
        record_count = len(df)
        print(f"Found {record_count} records in accumulated dataset")
        
        # चेक करें कि क्या रीट्रेन करना चाहिए
        if record_count >= 20:  # 20 या अधिक रेकॉर्ड्स पर रीट्रेन
            print("Sufficient new data found. Initiating model retraining...")
            
            # रीट्रेन करें
            load_model(rebuild=True)
            
            # बैकअप और क्लियर
            backup_file = f"accumulated_dataset_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            df.to_csv(backup_file, index=False)
            print(f"Data backed up to {backup_file}")
            
            # नया फाइल बनाएं (ऑप्शनल)
            # open(data_path, 'w').close()  # क्लियर फाइल
            
            print("Model retraining completed")
            return True
        
        print("Insufficient new data for retraining")
        return False
    
    except Exception as e:
        print(f"Error in check_and_retrain: {e}")
        return False

def create_performance_trend():
    """Create visualization of model performance over time"""
    try:
        # Load validation history
        history_path = "model_validation_history.json"
        if not os.path.exists(history_path):
            print("No validation history found")
            return
            
        with open(history_path, 'r') as f:
            history = json.load(f)
            
        # Extract metrics
        timestamps = [entry["timestamp"] for entry in history]
        accuracies = [entry["accuracy"] for entry in history]
        confidences = [entry["confidence"] for entry in history]
        
        # Create plot
        plt.figure(figsize=(10, 6))
        plt.plot(timestamps, accuracies, 'o-', label='Accuracy')
        plt.plot(timestamps, confidences, 's--', label='Confidence')
        plt.xlabel('Time')
        plt.ylabel('Score')
        plt.title('Model Performance Over Time')
        plt.xticks(rotation=45)
        plt.legend()
        plt.tight_layout()
        plt.grid(True, linestyle='--', alpha=0.7)
        plt.savefig('model_performance_trend.png')
        plt.close()
        
        print("Created model performance trend visualization")
        
    except Exception as e:
        print(f"Error creating performance trend: {str(e)}")

def create_validation_visualization(validation_result):
    """Create visual reports of model performance"""
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        
        # Create accuracy by category chart
        plt.figure(figsize=(10, 6))
        categories = list(validation_result["category_accuracy"].keys())
        accuracies = [validation_result["category_accuracy"][cat] for cat in categories]
        
        plt.bar(categories, accuracies, color='skyblue')
        plt.axhline(y=validation_result["accuracy"], color='red', linestyle='--', 
                   label=f'Overall Accuracy: {validation_result["accuracy"]:.2%}')
        
        plt.title('Model Accuracy by Job Category')
        plt.xlabel('Job Category')
        plt.ylabel('Accuracy')
        plt.ylim(0, 1.0)
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        plt.legend()
        plt.grid(axis='y', alpha=0.3)
        
        # Save figure
        plt.savefig(f'category_accuracy_{timestamp}.png')
        plt.close()
        
        # Create trait correlation chart if we have insights
        if validation_result.get("trait_insights"):
            plt.figure(figsize=(10, 6))
            traits = []
            correlations = []
            
            for trait, data in validation_result["trait_insights"].items():
                traits.append(trait)
                correlations.append(data["correlation"])
            
            colors = ['green' if c > 0 else 'red' for c in correlations]
            plt.bar(traits, correlations, color=colors)
            
            plt.title('Trait Correlation with Prediction Accuracy')
            plt.xlabel('Personality Trait')
            plt.ylabel('Correlation Coefficient')
            plt.axhline(y=0, color='black', linestyle='-', alpha=0.3)
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            plt.grid(axis='y', alpha=0.3)
            
            # Save figure
            plt.savefig(f'trait_correlation_{timestamp}.png')
            plt.close()
        
        print(f"Validation visualizations saved with timestamp {timestamp}")
        
    except Exception as e:
        print(f"Error creating validation visualization: {str(e)}")

def run_scheduled_tasks():
    """Run all model monitoring tasks on schedule"""
    print(f"=== Model monitoring started at {datetime.now()} ===")
    
    # Run validation
    validation_result = validate_model()
    
    # Check if retraining is needed
    check_and_retrain()
    
    # Create trend visualization
    create_performance_trend()
    
    print(f"=== Model monitoring completed at {datetime.now()} ===")

def start_scheduler():
    """Start the scheduler for regular model monitoring"""
    print("Starting model monitoring scheduler...")
    
    # Daily at midnight
    schedule.every().day.at("00:00").do(run_scheduled_tasks)
    
    # Also run immediately on startup
    run_scheduled_tasks()
    
    print("Scheduler started. Press Ctrl+C to exit.")
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)
    except KeyboardInterrupt:
        print("Scheduler stopped by user")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "schedule":
        start_scheduler()
    else:
        # Run once
        run_scheduled_tasks()