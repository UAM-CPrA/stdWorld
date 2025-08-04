// std::Learn All Meta Data
// This file contains all the meta information for the std::Learn sections

const stdLearnAllMeta = {
  // Main concepts meta
  "concepts": {
    "title": "Welcome to std::Learn!",
    "description": "Master the fundamental algorithms and advanced techniques of competitive programming through structured learning modules.",
    "type": "root",
    "sections": [
      {
        "id": "fundamentals",
        "title": "Fundamentals", 
        "icon": "🔢",
        "type": "folder",
        "path": "concepts/fundamentals",
        "url": "concepts/fundamentals.html",
        "description": "Core principles of problem-solving and basic programming techniques.",
        "children": [
          {
            "id": "time-complexity",
            "title": "Time & Space Complexity",
            "type": "page",
            "path": "concepts/fundamentals/complexity.html",
            "url": "concepts/fundamentals/complexity.html",
            "description": "Understanding algorithmic complexity analysis - the foundation of competitive programming optimization.",
            "level": "Beginner",
            "readingTime": 15,
            "tags": ["complexity", "big-o", "analysis"],
            "featured": ["math", "interactive"],
            "lastUpdated": "2025-08-02"
          }
        ]
      },
      {
        "id": "data-structures",
        "title": "Data Structures",
        "icon": "🏗️",
        "type": "folder",
        "path": "concepts/data-structures",
        "url": "concepts/data-structures.html",
        "description": "Advanced data structures for efficient problem solving."
      },
      {
        "id": "algorithms",
        "title": "Advanced Algorithms",
        "icon": "⚡",
        "type": "folder",
        "path": "concepts/algorithms",
        "url": "concepts/algorithms.html",
        "description": "Complex algorithms for competitive programming mastery."
      }
    ]
  },
  
  // Fundamentals meta
  "concepts/fundamentals": {
    "title": "Fundamentals",
    "description": "Core principles of problem-solving and basic programming techniques.",
    "type": "folder",
    "sections": [
      {
        "id": "time-complexity",
        "title": "Time & Space Complexity",
        "type": "page",
        "level": "Beginner",
        "readingTime": 15
      }
    ]
  },
  
  // Data structures meta
  "concepts/data-structures": {
    "title": "Data Structures",
    "description": "Advanced data structures for efficient problem solving.",
    "type": "folder",
    "sections": []
  },
  
  // Algorithms meta
  "concepts/algorithms": {
    "title": "Advanced Algorithms",
    "description": "Complex algorithms for competitive programming mastery.",
    "type": "folder",
    "sections": [
      {
        "id": "dynamic-programming",
        "title": "Dynamic Programming",
        "type": "folder",
        "level": "Intermediate"
      }
    ]
  },
  
  // Dynamic programming meta
  "concepts/algorithms/dynamic-programming": {
    "title": "Dynamic Programming",
    "description": "Master the art of dynamic programming with classic and advanced problems.",
    "type": "folder",
    "sections": []
  }
};

// Function to get meta data for a path
window.getStdLearnMeta = function(path) {
  // Normalize path (remove leading slash if present)
  const normalizedPath = path.replace(/^\//, '');
  return stdLearnAllMeta[normalizedPath] || null;
};

// Make main meta available globally (for backward compatibility)
window.stdLearnMeta = stdLearnAllMeta.concepts;
