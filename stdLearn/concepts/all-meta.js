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
          },
          {
            "id": "basic-data-structures",
            "title": "Basic Data Structures",
            "type": "page",
            "path": "concepts/fundamentals/basic-ds.html",
            "url": "concepts/fundamentals/basic-ds.html",
            "description": "Arrays, vectors, sets, maps, and other fundamental data structures every competitive programmer needs.",
            "level": "Beginner",
            "readingTime": 20,
            "tags": ["data-structures", "arrays", "maps"],
            "featured": ["code", "interactive"],
            "lastUpdated": "2025-08-02"
          },
          {
            "id": "sorting-searching",
            "title": "Sorting & Searching",
            "type": "page",
            "path": "concepts/fundamentals/sort-search.html",
            "url": "concepts/fundamentals/sort-search.html",
            "description": "Essential sorting algorithms and binary search techniques with practical applications.",
            "level": "Beginner",
            "readingTime": 18,
            "tags": ["sorting", "binary-search", "algorithms"],
            "featured": ["code", "examples"],
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
        "description": "Advanced data structures for efficient problem solving.",
        "children": [
          {
            "id": "segment-trees",
            "title": "Segment Trees",
            "type": "page",
            "path": "concepts/data-structures/segment-trees.html",
            "url": "concepts/data-structures/segment-trees.html",
            "description": "Master segment trees for range queries and updates in logarithmic time.",
            "level": "Intermediate",
            "readingTime": 30,
            "tags": ["segment-tree", "range-queries", "tree"],
            "featured": ["math", "interactive"],
            "lastUpdated": "2025-08-02"
          },
          {
            "id": "union-find",
            "title": "Union Find (DSU)",
            "type": "page",
            "path": "concepts/data-structures/union-find.html",
            "url": "concepts/data-structures/union-find.html",
            "description": "Disjoint Set Union for efficiently handling connectivity queries.",
            "level": "Intermediate",
            "readingTime": 25,
            "tags": ["dsu", "union-find", "connectivity"],
            "featured": ["math", "code"],
            "lastUpdated": "2025-08-02"
          }
        ]
      },
      {
        "id": "algorithms",
        "title": "Advanced Algorithms",
        "icon": "⚡",
        "type": "folder",
        "path": "concepts/algorithms",
        "url": "concepts/algorithms.html",
        "description": "Complex algorithms for competitive programming mastery.",
        "children": [
          {
            "id": "dynamic-programming",
            "title": "Dynamic Programming",
            "type": "folder",
            "path": "concepts/algorithms/dynamic-programming",
            "url": "concepts/algorithms/dynamic-programming.html",
            "description": "Master the art of dynamic programming with classic and advanced problems.",
            "level": "Intermediate",
            "tags": ["dp", "memoization", "optimization"],
            "featured": ["math", "code", "interactive"],
            "lastUpdated": "2025-08-02"
          },
          {
            "id": "graph-algorithms",
            "title": "Graph Algorithms",
            "type": "page",
            "path": "concepts/algorithms/graph-algorithms.html",
            "url": "concepts/algorithms/graph-algorithms.html",
            "description": "Essential graph algorithms including DFS, BFS, shortest paths, and minimum spanning trees.",
            "level": "Intermediate",
            "readingTime": 45,
            "tags": ["graphs", "dfs", "bfs", "dijkstra"],
            "featured": ["math", "code"],
            "lastUpdated": "2025-08-02"
          },
          {
            "id": "string-algorithms",
            "title": "String Algorithms",
            "type": "page",
            "path": "concepts/algorithms/string-algorithms.html",
            "url": "concepts/algorithms/string-algorithms.html",
            "description": "String processing algorithms including KMP, Z-algorithm, and suffix arrays.",
            "level": "Advanced",
            "readingTime": 40,
            "tags": ["strings", "kmp", "suffix-array"],
            "featured": ["code", "examples"],
            "lastUpdated": "2025-08-02"
          }
        ]
      }
    ]
  },
  
  // Fundamentals meta
  "concepts/fundamentals": {
    "title": "Fundamentals",
    "description": "Core principles of problem-solving and basic programming techniques.",
    "type": "folder",
    "items": [
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
      },
      {
        "id": "basic-data-structures",
        "title": "Basic Data Structures",
        "type": "page",
        "path": "concepts/fundamentals/basic-ds.html",
        "url": "concepts/fundamentals/basic-ds.html",
        "description": "Arrays, vectors, sets, maps, and other fundamental data structures every competitive programmer needs.",
        "level": "Beginner",
        "readingTime": 20,
        "tags": ["data-structures", "arrays", "maps"],
        "featured": ["code", "interactive"],
        "lastUpdated": "2025-08-02"
      },
      {
        "id": "sorting-searching",
        "title": "Sorting & Searching",
        "type": "page",
        "path": "concepts/fundamentals/sort-search.html",
        "url": "concepts/fundamentals/sort-search.html",
        "description": "Essential sorting algorithms and binary search techniques with practical applications.",
        "level": "Beginner",
        "readingTime": 18,
        "tags": ["sorting", "binary-search", "algorithms"],
        "featured": ["code", "examples"],
        "lastUpdated": "2025-08-02"
      }
    ]
  },
  
  // Data structures meta
  "concepts/data-structures": {
    "title": "Data Structures",
    "description": "Advanced data structures for efficient problem solving.",
    "type": "folder",
    "items": [
      {
        "id": "segment-trees",
        "title": "Segment Trees",
        "type": "page",
        "path": "concepts/data-structures/segment-trees.html",
        "url": "concepts/data-structures/segment-trees.html",
        "description": "Master segment trees for range queries and updates in logarithmic time.",
        "level": "Intermediate",
        "readingTime": 30,
        "tags": ["segment-tree", "range-queries", "tree"],
        "featured": ["math", "interactive"],
        "lastUpdated": "2025-08-02"
      },
      {
        "id": "union-find",
        "title": "Union Find (DSU)",
        "type": "page",
        "path": "concepts/data-structures/union-find.html",
        "url": "concepts/data-structures/union-find.html",
        "description": "Disjoint Set Union for efficiently handling connectivity queries.",
        "level": "Intermediate",
        "readingTime": 25,
        "tags": ["dsu", "union-find", "connectivity"],
        "featured": ["math", "code"],
        "lastUpdated": "2025-08-02"
      }
    ]
  },
  
  // Algorithms meta
  "concepts/algorithms": {
    "title": "Advanced Algorithms",
    "description": "Complex algorithms for competitive programming mastery.",
    "type": "folder",
    "items": [
      {
        "id": "dynamic-programming",
        "title": "Dynamic Programming",
        "type": "folder",
        "path": "concepts/algorithms/dynamic-programming",
        "url": "concepts/algorithms/dynamic-programming.html",
        "description": "Master the art of dynamic programming with classic and advanced problems.",
        "level": "Intermediate",
        "readingTime": 60,
        "tags": ["dp", "memoization", "optimization", "recursion"],
        "featured": ["math", "code", "interactive"],
        "lastUpdated": "2025-08-02"
      },
      {
        "id": "graph-algorithms",
        "title": "Graph Algorithms",
        "type": "page",
        "path": "concepts/algorithms/graph-algorithms.html",
        "url": "concepts/algorithms/graph-algorithms.html",
        "description": "Essential graph algorithms including DFS, BFS, shortest paths, MST, and topological sorting.",
        "level": "Intermediate",
        "readingTime": 45,
        "tags": ["graphs", "dfs", "bfs", "dijkstra", "mst"],
        "featured": ["math", "code"],
        "lastUpdated": "2025-08-02"
      },
      {
        "id": "string-algorithms",
        "title": "String Algorithms",
        "type": "page",
        "path": "concepts/algorithms/string-algorithms.html",
        "url": "concepts/algorithms/string-algorithms.html",
        "description": "Advanced string processing algorithms including KMP, Z-algorithm, suffix arrays, and string hashing.",
        "level": "Advanced",
        "readingTime": 40,
        "tags": ["strings", "kmp", "suffix-array", "hashing"],
        "featured": ["code", "examples"],
        "lastUpdated": "2025-08-02"
      }
    ]
  },
  
  // Dynamic programming meta
  "concepts/algorithms/dynamic-programming": {
    "title": "Dynamic Programming",
    "description": "Master the art of dynamic programming with classic and advanced problems.",
    "type": "folder",
    "items": []
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
