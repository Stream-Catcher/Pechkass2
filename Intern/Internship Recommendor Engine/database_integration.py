"""
Database Integration Layer for AI Internship Matching Engine
Provides abstraction layer for fetching user profiles and opportunities from database
"""

import json
import sqlite3
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, asdict
from datetime import datetime
import logging
from matching_engine import CandidateProfile, Internship


class DatabaseConnector:
    """
    Abstract database connector that can be easily adapted to different databases
    (SQLite for testing, PostgreSQL/MySQL for production)
    """
    
    def __init__(self, db_path: str = "internship_matching.db", db_type: str = "sqlite"):
        self.db_path = db_path
        self.db_type = db_type
        self.logger = logging.getLogger(__name__)
        
        if db_type == "sqlite":
            self._init_sqlite()
    
    def _init_sqlite(self):
        """Initialize SQLite database with sample schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                education TEXT,
                contact_number TEXT,
                current_address TEXT,
                linkedin TEXT,
                gender TEXT,
                disability_status BOOLEAN DEFAULT FALSE,
                veteran BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create user_experience table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_experience (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                experience_text TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        
        # Create user_skills table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                skill_name TEXT NOT NULL,
                proficiency_level INTEGER DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        
        # Create user_preferences table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE,
                preferred_sectors TEXT, -- JSON array
                preferred_location TEXT,
                preferred_duration TEXT,
                preferred_company_type TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        
        # Create internships table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS internships (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                company_name TEXT NOT NULL,
                sector TEXT NOT NULL,
                location TEXT NOT NULL,
                duration TEXT NOT NULL,
                company_type TEXT NOT NULL,
                application_link TEXT NOT NULL,
                capacity INTEGER DEFAULT 1,
                remote_available BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP
            )
        """)
        
        # Create internship_skills table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS internship_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                internship_id INTEGER,
                skill_name TEXT NOT NULL,
                is_required BOOLEAN DEFAULT TRUE,
                FOREIGN KEY (internship_id) REFERENCES internships (id)
            )
        """)
        
        # Create applications table for tracking past participation
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                internship_id INTEGER,
                status TEXT DEFAULT 'applied', -- applied, accepted, rejected, completed, dropped
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                rating REAL,
                feedback TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (internship_id) REFERENCES internships (id)
            )
        """)
        
        conn.commit()
        conn.close()
        
        # Insert sample data
        self._insert_sample_data()
    
    def _insert_sample_data(self):
        """Insert sample data for testing"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Sample users
            sample_users = [
                (1, "priya.sharma@email.com", "Priya Sharma", "B.Tech Computer Science", 
                 "+91-9876543210", "Bangalore, Karnataka", "linkedin.com/in/priyasharma", 
                 "Female", False, False),
                (2, "arjun.kumar@email.com", "Arjun Kumar", "B.E. Electronics", 
                 "+91-9876543211", "Mumbai, Maharashtra", "linkedin.com/in/arjunkumar", 
                 "Male", False, True),
                (3, "sneha.patel@email.com", "Sneha Patel", "M.Sc Data Science", 
                 "+91-9876543212", "Pune, Maharashtra", "linkedin.com/in/snehapatel", 
                 "Female", True, False)
            ]
            
            cursor.executemany("""
                INSERT OR IGNORE INTO users 
                (id, email, full_name, education, contact_number, current_address, 
                 linkedin, gender, disability_status, veteran) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, sample_users)
            
            # Sample skills
            sample_skills = [
                (1, "Python", 4), (1, "JavaScript", 3), (1, "React", 3), (1, "SQL", 4), 
                (1, "Machine Learning", 2), (1, "Git", 4),
                (2, "Java", 4), (2, "Spring Boot", 3), (2, "MySQL", 4), (2, "Git", 3),
                (3, "Python", 5), (3, "R", 4), (3, "Machine Learning", 5), 
                (3, "Statistics", 5), (3, "SQL", 4)
            ]
            
            cursor.executemany("""
                INSERT OR IGNORE INTO user_skills (user_id, skill_name, proficiency_level) 
                VALUES (?, ?, ?)
            """, sample_skills)
            
            # Sample preferences
            sample_preferences = [
                (1, '["Technology", "Fintech"]', "Bangalore", "6 months", "Startup"),
                (2, '["Technology"]', "Mumbai", "3 months", "MNC"),
                (3, '["Technology", "Healthcare"]', "Remote", "6 months", "Startup")
            ]
            
            cursor.executemany("""
                INSERT OR IGNORE INTO user_preferences 
                (user_id, preferred_sectors, preferred_location, preferred_duration, preferred_company_type) 
                VALUES (?, ?, ?, ?, ?)
            """, sample_preferences)
            
            # Sample internships
            sample_internships = [
                (1, "Python Developer Intern", "TechCorp", "Technology", "Bangalore", 
                 "6 months", "Startup", "https://techcorp.com/internships/python", 5, True, True),
                (2, "Frontend Developer Intern", "WebCorp", "Technology", "Mumbai", 
                 "3 months", "MNC", "https://webcorp.com/careers/frontend", 8, False, True),
                (3, "Data Science Intern", "DataCorp", "Technology", "Bangalore", 
                 "6 months", "Startup", "https://datacorp.com/internships/datascience", 3, True, True),
                (4, "Full Stack Developer Intern", "StartupXYZ", "Technology", "Delhi", 
                 "4 months", "Startup", "https://startupxyz.com/careers", 6, True, True),
                (5, "AI/ML Research Intern", "AICorp", "Technology", "Bangalore", 
                 "8 months", "MNC", "https://aicorp.com/research-internships", 2, False, True)
            ]
            
            cursor.executemany("""
                INSERT OR IGNORE INTO internships 
                (id, title, company_name, sector, location, duration, company_type, 
                 application_link, capacity, remote_available, is_active) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, sample_internships)
            
            # Sample internship skills
            sample_internship_skills = [
                (1, "Python", True), (1, "Django", True), (1, "SQL", True), (1, "Git", True),
                (2, "JavaScript", True), (2, "React", True), (2, "HTML", True), (2, "CSS", True),
                (3, "Python", True), (3, "Machine Learning", True), (3, "SQL", True), (3, "Statistics", True),
                (4, "Python", True), (4, "JavaScript", True), (4, "React", True), (4, "Node.js", True),
                (5, "Python", True), (5, "Machine Learning", True), (5, "TensorFlow", True), (5, "Research", True)
            ]
            
            cursor.executemany("""
                INSERT OR IGNORE INTO internship_skills (internship_id, skill_name, is_required) 
                VALUES (?, ?, ?)
            """, sample_internship_skills)
            
            conn.commit()
            self.logger.info("Sample data inserted successfully")
            
        except Exception as e:
            self.logger.error(f"Error inserting sample data: {e}")
            conn.rollback()
        finally:
            conn.close()
    
    def get_user_profile_by_email(self, email: str) -> Optional[CandidateProfile]:
        """Fetch complete user profile by email"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Get basic user info
            cursor.execute("""
                SELECT u.*, up.preferred_sectors, up.preferred_location, 
                       up.preferred_duration, up.preferred_company_type
                FROM users u
                LEFT JOIN user_preferences up ON u.id = up.user_id
                WHERE u.email = ?
            """, (email,))
            
            user_row = cursor.fetchone()
            if not user_row:
                return None
            
            user_id = user_row[0]
            
            # Get user skills
            cursor.execute("""
                SELECT skill_name FROM user_skills WHERE user_id = ?
            """, (user_id,))
            skills = [row[0] for row in cursor.fetchall()]
            
            # Get user experience
            cursor.execute("""
                SELECT experience_text FROM user_experience WHERE user_id = ?
            """, (user_id,))
            experience = [row[0] for row in cursor.fetchall()]
            
            # Parse preferred sectors from JSON
            preferred_sectors = None
            if user_row[12]:  # preferred_sectors column
                try:
                    preferred_sectors = json.loads(user_row[12])
                except json.JSONDecodeError:
                    preferred_sectors = [user_row[12]]  # Fallback to single sector
            
            # Create CandidateProfile object
            profile = CandidateProfile(
                full_name=user_row[2],
                education=user_row[3] or "",
                contact_number=user_row[4] or "",
                current_address=user_row[5] or "",
                email=user_row[1],
                linkedin=user_row[6] or "",
                experience=experience,
                skills=skills,
                gender=user_row[7] or "",
                disability_status=bool(user_row[8]),
                veteran=bool(user_row[9]),
                preferred_sectors=preferred_sectors,
                preferred_location=user_row[13],
                preferred_duration=user_row[14],
                preferred_company_type=user_row[15]
            )
            
            return profile
            
        except Exception as e:
            self.logger.error(f"Error fetching user profile: {e}")
            return None
        finally:
            conn.close()
    
    def get_user_profile_by_id(self, user_id: int) -> Optional[CandidateProfile]:
        """Fetch complete user profile by user ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("SELECT email FROM users WHERE id = ?", (user_id,))
            result = cursor.fetchone()
            if result:
                return self.get_user_profile_by_email(result[0])
            return None
        except Exception as e:
            self.logger.error(f"Error fetching user by ID: {e}")
            return None
        finally:
            conn.close()
    
    def get_active_internships(self, limit: Optional[int] = None) -> List[Internship]:
        """Fetch all active internships"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            query = """
                SELECT i.*, GROUP_CONCAT(isk.skill_name) as skills
                FROM internships i
                LEFT JOIN internship_skills isk ON i.id = isk.internship_id
                WHERE i.is_active = TRUE
                GROUP BY i.id
                ORDER BY i.created_at DESC
            """
            
            if limit:
                query += f" LIMIT {limit}"
            
            cursor.execute(query)
            internship_rows = cursor.fetchall()
            
            internships = []
            for row in internship_rows:
                skills = row[12].split(',') if row[12] else []
                skills = [s.strip() for s in skills if s.strip()]
                
                internship = Internship(
                    title=row[1],
                    skills_required=skills,
                    sector=row[3],
                    location=row[4],
                    duration=row[5],
                    company_type=row[6],
                    link=row[7],
                    capacity=row[8] or 1,
                    remote_available=bool(row[9])
                )
                internships.append(internship)
            
            return internships
            
        except Exception as e:
            self.logger.error(f"Error fetching internships: {e}")
            return []
        finally:
            conn.close()
    
    def get_internships_by_sector(self, sector: str) -> List[Internship]:
        """Fetch internships filtered by sector"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT i.*, GROUP_CONCAT(isk.skill_name) as skills
                FROM internships i
                LEFT JOIN internship_skills isk ON i.id = isk.internship_id
                WHERE i.is_active = TRUE AND LOWER(i.sector) = LOWER(?)
                GROUP BY i.id
                ORDER BY i.created_at DESC
            """, (sector,))
            
            internship_rows = cursor.fetchall()
            
            internships = []
            for row in internship_rows:
                skills = row[12].split(',') if row[12] else []
                skills = [s.strip() for s in skills if s.strip()]
                
                internship = Internship(
                    title=row[1],
                    skills_required=skills,
                    sector=row[3],
                    location=row[4],
                    duration=row[5],
                    company_type=row[6],
                    link=row[7],
                    capacity=row[8] or 1,
                    remote_available=bool(row[9])
                )
                internships.append(internship)
            
            return internships
            
        except Exception as e:
            self.logger.error(f"Error fetching internships by sector: {e}")
            return []
        finally:
            conn.close()
    
    def get_user_applications(self, user_id: int) -> List[Dict[str, Any]]:
        """Get user's past applications for participation tracking"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT a.*, i.title, i.company_name, i.sector
                FROM applications a
                JOIN internships i ON a.internship_id = i.id
                WHERE a.user_id = ?
                ORDER BY a.applied_at DESC
            """, (user_id,))
            
            applications = []
            for row in cursor.fetchall():
                applications.append({
                    'application_id': row[0],
                    'status': row[3],
                    'applied_at': row[4],
                    'completed_at': row[5],
                    'rating': row[6],
                    'feedback': row[7],
                    'internship_title': row[8],
                    'company_name': row[9],
                    'sector': row[10]
                })
            
            return applications
            
        except Exception as e:
            self.logger.error(f"Error fetching user applications: {e}")
            return []
        finally:
            conn.close()
    
    def add_user_profile(self, profile: CandidateProfile) -> bool:
        """Add a new user profile to the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Insert user basic info
            cursor.execute("""
                INSERT INTO users (email, full_name, education, contact_number, 
                                 current_address, linkedin, gender, disability_status, veteran)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (profile.email, profile.full_name, profile.education, profile.contact_number,
                  profile.current_address, profile.linkedin, profile.gender,
                  profile.disability_status, profile.veteran))
            
            user_id = cursor.lastrowid
            
            # Insert skills
            if profile.skills:
                skill_data = [(user_id, skill, 3) for skill in profile.skills]  # Default proficiency
                cursor.executemany("""
                    INSERT INTO user_skills (user_id, skill_name, proficiency_level) 
                    VALUES (?, ?, ?)
                """, skill_data)
            
            # Insert experience
            if profile.experience:
                exp_data = [(user_id, exp) for exp in profile.experience]
                cursor.executemany("""
                    INSERT INTO user_experience (user_id, experience_text) 
                    VALUES (?, ?)
                """, exp_data)
            
            # Insert preferences
            preferred_sectors_json = json.dumps(profile.preferred_sectors) if profile.preferred_sectors else None
            cursor.execute("""
                INSERT INTO user_preferences 
                (user_id, preferred_sectors, preferred_location, preferred_duration, preferred_company_type)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, preferred_sectors_json, profile.preferred_location,
                  profile.preferred_duration, profile.preferred_company_type))
            
            conn.commit()
            return True
            
        except Exception as e:
            self.logger.error(f"Error adding user profile: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def update_user_preferences(self, email: str, preferences: Dict[str, Any]) -> bool:
        """Update user preferences"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Get user ID
            cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
            result = cursor.fetchone()
            if not result:
                return False
            
            user_id = result[0]
            
            # Prepare update data
            sectors_json = json.dumps(preferences.get('preferred_sectors')) if preferences.get('preferred_sectors') else None
            
            cursor.execute("""
                INSERT OR REPLACE INTO user_preferences 
                (user_id, preferred_sectors, preferred_location, preferred_duration, preferred_company_type)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, sectors_json, 
                  preferences.get('preferred_location'),
                  preferences.get('preferred_duration'),
                  preferences.get('preferred_company_type')))
            
            conn.commit()
            return True
            
        except Exception as e:
            self.logger.error(f"Error updating user preferences: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()


# Example usage and testing
def test_database_integration():
    """Test the database integration"""
    print("Testing Database Integration...")
    
    # Initialize database
    db = DatabaseConnector()
    
    # Test fetching user profile
    profile = db.get_user_profile_by_email("priya.sharma@email.com")
    if profile:
        print(f"✅ Fetched profile: {profile.full_name}")
        print(f"   Skills: {profile.skills}")
        print(f"   Preferred Sectors: {profile.preferred_sectors}")
    else:
        print("❌ Failed to fetch profile")
    
    # Test fetching internships
    internships = db.get_active_internships(limit=3)
    print(f"✅ Fetched {len(internships)} internships")
    for i, internship in enumerate(internships, 1):
        print(f"   {i}. {internship.title} ({internship.sector})")
    
    # Test sector-based filtering
    tech_internships = db.get_internships_by_sector("Technology")
    print(f"✅ Found {len(tech_internships)} technology internships")
    
    print("Database integration test completed!")


if __name__ == "__main__":
    test_database_integration()
