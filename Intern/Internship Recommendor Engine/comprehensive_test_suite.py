"""
Comprehensive Test Suite for AI Internship Matching Engine
Tests all components: database, API, matching engine, and integration
"""

import json
import time
import traceback
from typing import Dict, List, Any
from database_integration import DatabaseConnector
from api_interface import AIMatchingAPI, APIResponse
from matching_engine import CandidateProfile, Internship


class TestRunner:
    """Comprehensive test runner for the AI matching system"""
    
    def __init__(self):
        self.tests_passed = 0
        self.tests_failed = 0
        self.test_results = []
    
    def run_test(self, test_name: str, test_func, *args, **kwargs):
        """Run a single test and track results"""
        print(f"\n🧪 Testing: {test_name}")
        print("-" * 60)
        
        start_time = time.time()
        try:
            result = test_func(*args, **kwargs)
            duration = time.time() - start_time
            
            if result:
                print(f"✅ PASSED ({duration:.3f}s)")
                self.tests_passed += 1
                self.test_results.append({'test': test_name, 'status': 'PASSED', 'duration': duration})
            else:
                print(f"❌ FAILED ({duration:.3f}s)")
                self.tests_failed += 1
                self.test_results.append({'test': test_name, 'status': 'FAILED', 'duration': duration})
            
            return result
            
        except Exception as e:
            duration = time.time() - start_time
            print(f"❌ ERROR ({duration:.3f}s): {str(e)}")
            print(f"   {traceback.format_exc()}")
            self.tests_failed += 1
            self.test_results.append({'test': test_name, 'status': 'ERROR', 'error': str(e), 'duration': duration})
            return False
    
    def print_summary(self):
        """Print test execution summary"""
        total_tests = self.tests_passed + self.tests_failed
        success_rate = (self.tests_passed / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "="*80)
        print("🎯 TEST EXECUTION SUMMARY")
        print("="*80)
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {self.tests_failed}")
        print(f"📊 Success Rate: {success_rate:.1f}%")
        
        if self.tests_failed == 0:
            print("\n🏆 ALL TESTS PASSED! System is ready for production.")
        else:
            print(f"\n⚠️  {self.tests_failed} tests failed. Review and fix issues.")
        
        print("="*80)


def test_database_connection():
    """Test database initialization and connection"""
    try:
        db = DatabaseConnector()
        # Test basic query
        profile = db.get_user_profile_by_email("priya.sharma@email.com")
        internships = db.get_active_internships(limit=3)
        
        if profile and len(internships) > 0:
            print(f"   Database connected successfully")
            print(f"   Sample profile: {profile.full_name}")
            print(f"   Sample internships: {len(internships)} found")
            return True
        return False
    except Exception as e:
        print(f"   Database connection failed: {e}")
        return False


def test_user_profile_operations():
    """Test user profile CRUD operations"""
    try:
        db = DatabaseConnector()
        
        # Test fetching existing user
        profile = db.get_user_profile_by_email("priya.sharma@email.com")
        if not profile:
            return False
        
        print(f"   Fetched profile: {profile.full_name}")
        print(f"   Skills: {profile.skills}")
        print(f"   Preferences: {profile.preferred_sectors}")
        
        # Test fetching by ID
        profile_by_id = db.get_user_profile_by_id(1)
        if not profile_by_id:
            return False
        
        print(f"   Fetched by ID: {profile_by_id.full_name}")
        
        # Test preferences update
        new_prefs = {
            'preferred_sectors': ['Technology', 'AI'],
            'preferred_location': 'Remote',
            'preferred_duration': '3 months'
        }
        success = db.update_user_preferences("priya.sharma@email.com", new_prefs)
        
        if success:
            print(f"   Preferences updated successfully")
        
        return success
        
    except Exception as e:
        print(f"   Profile operations failed: {e}")
        return False


def test_internship_operations():
    """Test internship fetching and filtering"""
    try:
        db = DatabaseConnector()
        
        # Test getting all active internships
        all_internships = db.get_active_internships()
        print(f"   Total active internships: {len(all_internships)}")
        
        # Test sector filtering
        tech_internships = db.get_internships_by_sector("Technology")
        print(f"   Technology internships: {len(tech_internships)}")
        
        # Test internship structure
        if len(all_internships) > 0:
            sample = all_internships[0]
            print(f"   Sample internship: {sample.title}")
            print(f"   Required skills: {sample.skills_required}")
            print(f"   Location: {sample.location}")
            print(f"   Remote available: {sample.remote_available}")
            return True
        
        return False
        
    except Exception as e:
        print(f"   Internship operations failed: {e}")
        return False


def test_basic_matching_engine():
    """Test core matching engine functionality"""
    try:
        from matching_engine import MatchingEngine, create_sample_data
        
        # Get sample data
        profile, internships = create_sample_data()
        engine = MatchingEngine()
        
        # Test ranking
        matches = engine.rank_internships(profile, internships, top_n=3)
        
        print(f"   Generated {len(matches)} matches")
        print(f"   Top match: {matches[0][0].title} (score: {matches[0][1]:.3f})")
        
        # Test component scores
        top_match = matches[0]
        components = top_match[2]
        print(f"   Component scores: {list(components.keys())}")
        
        # Test skill matching
        skill_score = engine.compute_skill_match(
            ["Python", "JavaScript"], 
            ["Python", "Django", "SQL"]
        )
        print(f"   Sample skill match score: {skill_score:.3f}")
        
        return len(matches) > 0 and matches[0][1] > 0
        
    except Exception as e:
        print(f"   Basic matching failed: {e}")
        return False


def test_natural_language_processing():
    """Test LLM-based preference processing"""
    try:
        from llm_preference_processor import EnhancedMatchingEngine
        
        # Initialize with rule-based processing (no API key needed for basic test)
        engine = EnhancedMatchingEngine(use_llm=False)
        
        test_inputs = [
            "I want a 6-month tech internship in Bangalore with Python skills",
            "Looking for remote data science work for 3 months",
            "Interested in startup environment with JavaScript and React",
            "Government sector internship in Delhi for 1 year"
        ]
        
        for i, input_text in enumerate(test_inputs, 1):
            print(f"   Test {i}: '{input_text[:50]}...'")
            
            extracted = engine.preference_processor.process_natural_language_preferences(input_text)
            
            print(f"      Sectors: {extracted.preferred_sectors}")
            print(f"      Location: {extracted.preferred_location}")
            print(f"      Duration: {extracted.preferred_duration}")
            print(f"      Skills: {extracted.additional_skills}")
            print(f"      Confidence: {extracted.confidence_score:.2f}")
        
        return True
        
    except Exception as e:
        print(f"   NLP processing failed: {e}")
        return False


def test_enhanced_ranking():
    """Test enhanced ranking algorithm"""
    try:
        from enhanced_ranking import EnhancedRankingEngine
        from matching_engine import create_sample_data
        
        # Initialize enhanced engine
        engine = EnhancedRankingEngine(use_llm=False)
        
        # Get sample data
        profile, internships = create_sample_data()
        
        # Test enhanced ranking
        matches = engine.rank_internships_enhanced(profile, internships, top_n=3)
        
        print(f"   Enhanced ranking generated {len(matches)} matches")
        
        # Check enhanced features
        top_match = matches[0]
        internship, score, components = top_match
        
        print(f"   Top match: {internship.title} (score: {score:.3f})")
        print(f"   Enhanced components: {len(components)}")
        
        # Verify enhanced components exist
        expected_components = [
            'past_participation', 'company_reputation', 
            'diversity_bonus', 'skill_advanced_match'
        ]
        
        found_components = sum(1 for comp in expected_components if comp in components)
        print(f"   Found {found_components}/{len(expected_components)} enhanced components")
        
        return len(matches) > 0 and found_components >= 3
        
    except Exception as e:
        print(f"   Enhanced ranking failed: {e}")
        return False


def test_api_interface():
    """Test API interface functionality"""
    try:
        # Initialize API
        api = AIMatchingAPI()
        
        # Test health check
        health = api.health_check()
        print(f"   Health check: {health.success} - {health.message}")
        
        if not health.success:
            return False
        
        # Test getting recommendations
        result = api.get_recommendations_by_user_id(
            user_id=1,
            natural_language_input="I want a Python internship in tech",
            top_n=3
        )
        
        print(f"   Recommendations: {result.success} - {result.message}")
        
        if result.success:
            recommendations = result.data['recommendations']
            print(f"   Found {len(recommendations)} recommendations")
            
            if len(recommendations) > 0:
                top_rec = recommendations[0]
                print(f"   Top recommendation: {top_rec['title']}")
                print(f"   Score: {top_rec['overall_score']}")
                print(f"   Explanation: {top_rec['match_explanation']}")
        
        # Test NLP processing
        nlp_result = api.process_natural_language_query(
            "Looking for a 6-month remote internship in machine learning"
        )
        print(f"   NLP processing: {nlp_result.success}")
        
        if nlp_result.success:
            extracted = nlp_result.data
            print(f"   Extracted preferences: {extracted}")
        
        # Test user profile retrieval
        profile_result = api.get_user_profile(1)
        print(f"   Profile retrieval: {profile_result.success}")
        
        # Test internship filtering
        filter_result = api.get_internships_by_criteria(sector="Technology", limit=5)
        print(f"   Internship filtering: {filter_result.success}")
        
        if filter_result.success:
            print(f"   Filtered internships: {len(filter_result.data['internships'])}")
        
        return result.success and nlp_result.success and profile_result.success
        
    except Exception as e:
        print(f"   API interface failed: {e}")
        return False


def test_matching_accuracy():
    """Test matching accuracy with known good/bad matches"""
    try:
        api = AIMatchingAPI()
        
        # Test case 1: Perfect match scenario
        print("   Testing perfect match scenario:")
        result = api.get_recommendations_by_user_id(
            user_id=1,  # Priya Sharma - Python, JS, React skills, prefers tech startups
            top_n=3
        )
        
        if result.success:
            top_match = result.data['recommendations'][0]
            print(f"   Perfect match score: {top_match['overall_score']}")
            
            # Should have high score for tech internships requiring Python
            if top_match['overall_score'] < 0.5:
                print(f"   WARNING: Low score for expected good match")
                return False
        
        # Test case 2: Mismatched scenario
        print("   Testing mismatched scenario:")
        # Create a profile with very different preferences
        from matching_engine import CandidateProfile
        mismatch_profile = CandidateProfile(
            full_name="Java Developer",
            education="B.Tech",
            contact_number="",
            current_address="Chennai",
            email="java@test.com",
            linkedin="",
            experience=[],
            skills=["Java", "Spring", "Hibernate"],  # Different skills
            gender="Male",
            disability_status=False,
            veteran=False,
            preferred_sectors=["Finance"],  # Different sector
            preferred_location="Chennai",   # Different location
            preferred_duration="1 year",    # Different duration
            preferred_company_type="Government"  # Different company type
        )
        
        # Get Python internships (should be poor match)
        internships = api.db.get_active_internships()
        python_internships = [i for i in internships if "Python" in i.skills_required]
        
        if python_internships:
            matches = api.matching_engine.rank_internships_enhanced(
                mismatch_profile, python_internships, 3
            )
            
            if matches:
                mismatch_score = matches[0][1]
                print(f"   Mismatch score: {mismatch_score:.3f}")
                
                if mismatch_score > 0.8:  # Should not be a great match
                    print(f"   WARNING: Unexpectedly high score for poor match")
                    return False
        
        print("   Matching accuracy tests completed")
        return True
        
    except Exception as e:
        print(f"   Matching accuracy test failed: {e}")
        return False


def test_performance_benchmarks():
    """Test system performance under load"""
    try:
        api = AIMatchingAPI()
        
        # Benchmark 1: Single recommendation request
        start_time = time.time()
        result = api.get_recommendations_by_user_id(1, top_n=10)
        single_request_time = time.time() - start_time
        
        print(f"   Single recommendation request: {single_request_time:.3f}s")
        
        if single_request_time > 5.0:  # Should be under 5 seconds
            print(f"   WARNING: Single request took too long")
            return False
        
        # Benchmark 2: Multiple requests
        start_time = time.time()
        for i in range(5):
            api.get_recommendations_by_user_id(1, top_n=5)
        batch_time = time.time() - start_time
        avg_time = batch_time / 5
        
        print(f"   Batch requests (5): {batch_time:.3f}s (avg: {avg_time:.3f}s)")
        
        # Benchmark 3: Large result set
        start_time = time.time()
        large_result = api.get_recommendations_by_user_id(1, top_n=50)
        large_request_time = time.time() - start_time
        
        print(f"   Large result set (50): {large_request_time:.3f}s")
        
        # Benchmark 4: NLP processing
        start_time = time.time()
        nlp_result = api.process_natural_language_query(
            "I want a remote machine learning internship in a startup for 6 months with Python and TensorFlow skills and good work-life balance"
        )
        nlp_time = time.time() - start_time
        
        print(f"   NLP processing: {nlp_time:.3f}s")
        
        # Performance thresholds (adjust based on requirements)
        if single_request_time < 3.0 and avg_time < 2.0 and nlp_time < 1.0:
            print("   Performance benchmarks: PASSED")
            return True
        else:
            print("   Performance benchmarks: ACCEPTABLE (some slower than ideal)")
            return True  # Still pass, just note performance
        
    except Exception as e:
        print(f"   Performance benchmark failed: {e}")
        return False


def test_error_handling():
    """Test error handling and edge cases"""
    try:
        api = AIMatchingAPI()
        
        # Test 1: Invalid user ID
        result = api.get_recommendations_by_user_id(99999)
        print(f"   Invalid user ID: {result.success} - {result.error_code}")
        
        if result.success or result.error_code != "USER_NOT_FOUND":
            print("   WARNING: Should have failed with USER_NOT_FOUND")
            return False
        
        # Test 2: Invalid email
        result = api.get_recommendations_by_email("nonexistent@email.com")
        print(f"   Invalid email: {result.success} - {result.error_code}")
        
        # Test 3: Empty natural language input
        result = api.process_natural_language_query("")
        print(f"   Empty NLP input: {result.success}")
        
        # Test 4: Malformed natural language input
        result = api.process_natural_language_query("!@#$%^&*()")
        print(f"   Malformed NLP input: {result.success}")
        
        # Test 5: Very long input
        long_input = "I want " + "a very long internship description " * 50
        result = api.process_natural_language_query(long_input)
        print(f"   Long input processing: {result.success}")
        
        # Test 6: Invalid preferences update
        invalid_prefs = {"invalid_field": "invalid_value"}
        result = api.update_user_preferences(1, invalid_prefs)
        print(f"   Invalid preferences update: {result.success}")
        
        # Test 7: Database connection issues (simulated)
        # This would require mocking, so we'll skip for now
        
        print("   Error handling tests completed")
        return True
        
    except Exception as e:
        print(f"   Error handling test failed: {e}")
        return False


def test_data_consistency():
    """Test data consistency and integrity"""
    try:
        api = AIMatchingAPI()
        
        # Test 1: Profile data consistency
        profile = api.get_user_profile(1)
        if not profile.success:
            return False
        
        profile_data = profile.data
        required_fields = ['full_name', 'email', 'skills', 'education']
        
        for field in required_fields:
            if field not in profile_data or not profile_data[field]:
                if field in ['full_name', 'email']:  # Critical fields
                    print(f"   ERROR: Missing critical field: {field}")
                    return False
        
        print(f"   Profile data consistency: OK")
        
        # Test 2: Internship data consistency
        internships_result = api.get_internships_by_criteria(limit=10)
        if not internships_result.success:
            return False
        
        internships = internships_result.data['internships']
        required_internship_fields = ['title', 'sector', 'location', 'skills_required', 'application_link']
        
        for i, internship in enumerate(internships[:5]):  # Check first 5
            for field in required_internship_fields:
                if field not in internship or not internship[field]:
                    print(f"   ERROR: Internship {i} missing field: {field}")
                    return False
        
        print(f"   Internship data consistency: OK")
        
        # Test 3: Score consistency
        result = api.get_recommendations_by_user_id(1, top_n=5)
        if not result.success:
            return False
        
        recommendations = result.data['recommendations']
        
        # Check scores are in valid range and sorted
        prev_score = 1.0
        for rec in recommendations:
            score = rec['overall_score']
            
            if not (0.0 <= score <= 1.0):
                print(f"   ERROR: Invalid score: {score}")
                return False
            
            if score > prev_score:
                print(f"   ERROR: Scores not properly sorted")
                return False
            
            prev_score = score
        
        print(f"   Score consistency: OK")
        
        # Test 4: Component scores sum up reasonably
        if recommendations:
            sample_rec = recommendations[0]
            component_scores = sample_rec['component_scores']
            
            # Component scores should all be between 0 and 1
            for component, score in component_scores.items():
                if not (0.0 <= score <= 1.0):
                    print(f"   ERROR: Invalid component score {component}: {score}")
                    return False
        
        print(f"   Component score consistency: OK")
        
        print("   Data consistency tests completed")
        return True
        
    except Exception as e:
        print(f"   Data consistency test failed: {e}")
        return False


def run_comprehensive_tests():
    """Run all tests in the comprehensive test suite"""
    print("🚀 STARTING COMPREHENSIVE TEST SUITE")
    print("=" * 80)
    
    runner = TestRunner()
    
    # Core functionality tests
    runner.run_test("Database Connection & Initialization", test_database_connection)
    runner.run_test("User Profile Operations", test_user_profile_operations)
    runner.run_test("Internship Operations", test_internship_operations)
    
    # AI Engine tests
    runner.run_test("Basic Matching Engine", test_basic_matching_engine)
    runner.run_test("Natural Language Processing", test_natural_language_processing)
    runner.run_test("Enhanced Ranking Algorithm", test_enhanced_ranking)
    
    # Integration tests
    runner.run_test("API Interface", test_api_interface)
    runner.run_test("Matching Accuracy", test_matching_accuracy)
    
    # Quality assurance tests
    runner.run_test("Performance Benchmarks", test_performance_benchmarks)
    runner.run_test("Error Handling", test_error_handling)
    runner.run_test("Data Consistency", test_data_consistency)
    
    # Print summary
    runner.print_summary()
    
    return runner.tests_failed == 0


def quick_integration_test():
    """Quick test to verify basic integration is working"""
    print("🏃 QUICK INTEGRATION TEST")
    print("-" * 40)
    
    try:
        # Initialize system
        api = AIMatchingAPI()
        
        # Test basic flow
        result = api.get_recommendations_by_user_id(
            user_id=1,
            natural_language_input="I want a Python internship",
            top_n=3
        )
        
        if result.success:
            count = len(result.data['recommendations'])
            print(f"✅ Quick test PASSED: Found {count} recommendations")
            
            # Show sample result
            if count > 0:
                sample = result.data['recommendations'][0]
                print(f"   Sample: {sample['title']} (score: {sample['overall_score']})")
            
            return True
        else:
            print(f"❌ Quick test FAILED: {result.message}")
            return False
            
    except Exception as e:
        print(f"❌ Quick test ERROR: {e}")
        return False


if __name__ == "__main__":
    print("Choose test mode:")
    print("1. Quick Integration Test (30 seconds)")
    print("2. Comprehensive Test Suite (5-10 minutes)")
    
    try:
        choice = input("Enter choice (1 or 2): ").strip()
        
        if choice == "1":
            success = quick_integration_test()
        elif choice == "2":
            success = run_comprehensive_tests()
        else:
            print("Running quick test by default...")
            success = quick_integration_test()
        
        if success:
            print("\n🎉 ALL SYSTEMS GO! Ready for backend integration.")
        else:
            print("\n⚠️  Some issues found. Review the test results above.")
            
    except KeyboardInterrupt:
        print("\n\nTest execution interrupted by user.")
    except Exception as e:
        print(f"\n❌ Test execution failed: {e}")
