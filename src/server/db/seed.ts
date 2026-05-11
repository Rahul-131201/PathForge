/**
 * PathForge Database Seed Script
 * Inserts 3 sample public roadmaps with full phases, topics, and resources.
 *
 * Usage:
 *   pnpm db:seed
 *   npx tsx src/server/db/seed.ts
 *
 * The script is idempotent — it deletes existing seed roadmaps by ID before
 * re-inserting, so you can safely run it multiple times.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ── Load environment variables from .env.local / .env ────────────────────────

function loadEnvFile(filename: string) {
  try {
    const content = readFileSync(resolve(process.cwd(), filename), "utf-8");
    for (const raw of content.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      // Strip surrounding quotes
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      // Don't override variables already set in the shell
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // File not found — rely on existing process.env
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

// ── Imports (after env is loaded so DATABASE_URL is available) ────────────────

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
const { roadmaps, phases, topics, resources } = schema;

if (!process.env.DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set. Copy .env.example to .env.local and fill in your Neon connection string.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

// ── Seed Roadmap IDs (fixed so we can delete-then-reinsert idempotently) ──────

const SEED_IDS = {
  react: "seed-learn-react-beginner",
  python: "seed-python-data-science",
  fullstack: "seed-fullstack-web-dev",
  typescript: "seed-typescript-mastery",
  devops: "seed-devops-cloud-engineering",
  systemdesign: "seed-system-design-architecture",
  reactnative: "seed-react-native-mobile",
  aiengineering: "seed-ai-llm-engineering",
  dsa: "seed-cs-fundamentals-dsa",
  cybersecurity: "seed-cybersecurity-ethical-hacking",
  golang: "seed-backend-golang",
  deeplearning: "seed-deep-learning-pytorch",
  dataengineering: "seed-data-engineering",
};

// ── Data ──────────────────────────────────────────────────────────────────────

type ResourceInsert = {
  title: string;
  url: string;
  type: "video" | "article" | "course" | "documentation" | "book" | "interactive";
  isFree: boolean;
  platform: string | null;
  qualityScore: number;
};

type TopicInsert = {
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: "easy" | "medium" | "hard";
  prerequisites: string[];
  resources: ResourceInsert[];
};

type PhaseInsert = {
  title: string;
  description: string;
  estimatedHours: number;
  topics: TopicInsert[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 1: Learn React from Scratch
// ─────────────────────────────────────────────────────────────────────────────

const reactPhases: PhaseInsert[] = [
  {
    title: "JavaScript Foundations",
    description: "Build a solid JS base before jumping into React. You'll cover the language features React relies on heavily.",
    estimatedHours: 10,
    topics: [
      {
        title: "Variables, Types & Operators",
        description: "Understand var/let/const, primitive types, type coercion, and operators.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "JavaScript Basics – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
          { title: "JavaScript Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Functions, Scope & Closures",
        description: "Master function declarations, arrow functions, the call stack, and how closures capture their environment.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Variables, Types & Operators"],
        resources: [
          { title: "Closures – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
          { title: "JavaScript Functions – freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/write-reusable-javascript-with-functions", type: "interactive", isFree: true, platform: "freeCodeCamp", qualityScore: 8 },
        ],
      },
      {
        title: "Arrays, Objects & Destructuring",
        description: "Work with arrays and objects, master ES6 destructuring, spread, rest, and object shorthand.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Variables, Types & Operators"],
        resources: [
          { title: "Destructuring Assignment – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
          { title: "ES6 Tutorial – Net Ninja", url: "https://www.youtube.com/watch?v=NCwa_xi0Uuc", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Async JavaScript: Promises & async/await",
        description: "Understand the event loop, callbacks, Promises, and async/await for writing non-blocking code.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Functions, Scope & Closures"],
        resources: [
          { title: "Async JavaScript – javascript.info", url: "https://javascript.info/async", type: "article", isFree: true, platform: "javascript.info", qualityScore: 9 },
          { title: "Async Await – Fireship", url: "https://www.youtube.com/watch?v=vn3tm0quoqE", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "React Core Concepts",
    description: "Learn how React thinks: components, JSX, props, state, and event handling.",
    estimatedHours: 10,
    topics: [
      {
        title: "JSX & Component Basics",
        description: "Understand JSX syntax, how Babel transpiles it, and how to write your first function components.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: ["Variables, Types & Operators"],
        resources: [
          { title: "Describing the UI – React Docs", url: "https://react.dev/learn/describing-the-ui", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
          { title: "React in 100 Seconds – Fireship", url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Props & State with useState",
        description: "Pass data between components with props and add local interactivity with the useState hook.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["JSX & Component Basics"],
        resources: [
          { title: "Adding Interactivity – React Docs", url: "https://react.dev/learn/adding-interactivity", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
          { title: "React Props & State – Scrimba", url: "https://scrimba.com/learn-react-c0e", type: "interactive", isFree: true, platform: "Scrimba", qualityScore: 8 },
        ],
      },
      {
        title: "Lists, Keys & Conditional Rendering",
        description: "Render dynamic lists with .map(), use keys correctly, and conditionally show UI with ternary and &&.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: ["Props & State with useState"],
        resources: [
          { title: "Rendering Lists – React Docs", url: "https://react.dev/learn/rendering-lists", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
        ],
      },
      {
        title: "Event Handling & Forms",
        description: "Handle click, submit, and change events. Build controlled form components.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Props & State with useState"],
        resources: [
          { title: "Responding to Events – React Docs", url: "https://react.dev/learn/responding-to-events", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
          { title: "React Forms Tutorial – Net Ninja", url: "https://www.youtube.com/watch?v=IkMND33x0qQ", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
    ],
  },
  {
    title: "React Intermediate Patterns",
    description: "Level up with useEffect, context, and routing to build real applications.",
    estimatedHours: 12,
    topics: [
      {
        title: "useEffect & Side Effects",
        description: "Run code after renders, fetch data, set up subscriptions, and clean up properly.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Props & State with useState"],
        resources: [
          { title: "Synchronizing with Effects – React Docs", url: "https://react.dev/learn/synchronizing-with-effects", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
          { title: "useEffect Explained – Fireship", url: "https://www.youtube.com/watch?v=0ZJgIjIuY7U", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "useContext & Global State",
        description: "Share data across the component tree without prop drilling using React Context.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["useEffect & Side Effects"],
        resources: [
          { title: "Passing Data Deeply with Context – React Docs", url: "https://react.dev/learn/passing-data-deeply-with-context", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
        ],
      },
      {
        title: "React Router v6",
        description: "Add client-side routing with React Router — nested routes, URL params, and navigation.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["JSX & Component Basics"],
        resources: [
          { title: "React Router v6 Tutorial – Official Docs", url: "https://reactrouter.com/en/main/start/tutorial", type: "documentation", isFree: true, platform: "React Router", qualityScore: 9 },
          { title: "React Router 6 Crash Course", url: "https://www.youtube.com/watch?v=59IXY5IDrBA", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Custom Hooks",
        description: "Extract reusable stateful logic into custom hooks to keep components clean.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["useEffect & Side Effects", "useContext & Global State"],
        resources: [
          { title: "Reusing Logic with Custom Hooks – React Docs", url: "https://react.dev/learn/reusing-logic-with-custom-hooks", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
        ],
      },
    ],
  },
  {
    title: "Production React",
    description: "Optimize, test, and deploy your React applications professionally.",
    estimatedHours: 8,
    topics: [
      {
        title: "Performance: useMemo & useCallback",
        description: "Prevent unnecessary re-renders with memoization and understand when it helps vs. hurts.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Custom Hooks"],
        resources: [
          { title: "useMemo – React Docs", url: "https://react.dev/reference/react/useMemo", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
          { title: "React Performance – Web Dev Simplified", url: "https://www.youtube.com/watch?v=_AyFP5s69N4", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Testing with React Testing Library",
        description: "Write unit and integration tests for components using RTL and Vitest.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Custom Hooks"],
        resources: [
          { title: "Testing Library Docs", url: "https://testing-library.com/docs/react-testing-library/intro/", type: "documentation", isFree: true, platform: "Testing Library", qualityScore: 9 },
          { title: "React Testing Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=8Xwq35cPwYg", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Deploying React Apps to Vercel",
        description: "Push to GitHub and deploy to Vercel with environment variables and custom domains.",
        estimatedHours: 1,
        difficulty: "easy",
        prerequisites: ["JSX & Component Basics"],
        resources: [
          { title: "Deploy to Vercel – Official Guide", url: "https://vercel.com/docs/frameworks/react", type: "documentation", isFree: true, platform: "Vercel", qualityScore: 9 },
        ],
      },
      {
        title: "Capstone: Build a Full Todo App",
        description: "Build a complete CRUD todo app with routing, local storage persistence, and all hooks in practice.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["React Router v6", "useContext & Global State"],
        resources: [
          { title: "Build a React Todo App – freeCodeCamp", url: "https://www.freecodecamp.org/news/how-to-build-a-todo-app-with-react/", type: "article", isFree: true, platform: "freeCodeCamp", qualityScore: 8 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 2: Python for Data Science
// ─────────────────────────────────────────────────────────────────────────────

const pythonPhases: PhaseInsert[] = [
  {
    title: "Python Refresher",
    description: "Sharpen intermediate Python skills: data structures, comprehensions, error handling, and tooling.",
    estimatedHours: 8,
    topics: [
      {
        title: "Python Data Structures",
        description: "Deep dive into lists, tuples, dicts, sets, and when to use each. Focus on performance implications.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "Python Data Structures – Real Python", url: "https://realpython.com/python-data-structures/", type: "article", isFree: true, platform: "Real Python", qualityScore: 9 },
          { title: "Python Tutorial – Official Docs", url: "https://docs.python.org/3/tutorial/datastructures.html", type: "documentation", isFree: true, platform: "Python Docs", qualityScore: 9 },
        ],
      },
      {
        title: "List Comprehensions & Generators",
        description: "Write concise, Pythonic transformations with comprehensions, generator expressions, and yield.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Python Data Structures"],
        resources: [
          { title: "Comprehensions in Python – Real Python", url: "https://realpython.com/list-comprehension-python/", type: "article", isFree: true, platform: "Real Python", qualityScore: 9 },
          { title: "Python Generators – Corey Schafer", url: "https://www.youtube.com/watch?v=bD05uGo_sVI", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "File I/O & Error Handling",
        description: "Read and write CSV/JSON files and handle exceptions properly with try/except/finally.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Python Data Structures"],
        resources: [
          { title: "Reading & Writing Files – Real Python", url: "https://realpython.com/read-write-files-python/", type: "article", isFree: true, platform: "Real Python", qualityScore: 9 },
        ],
      },
      {
        title: "Virtual Environments & Package Management",
        description: "Isolate project dependencies with venv and pip, understand requirements.txt and pyproject.toml.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "Python Virtual Environments – Real Python", url: "https://realpython.com/python-virtual-environments-a-primer/", type: "article", isFree: true, platform: "Real Python", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Data Manipulation with NumPy & Pandas",
    description: "The workhorse of data science: array math with NumPy and table manipulation with Pandas.",
    estimatedHours: 14,
    topics: [
      {
        title: "NumPy Arrays & Vectorized Operations",
        description: "Create N-dimensional arrays, perform broadcasting, indexing, and use ufuncs for fast math.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Python Data Structures"],
        resources: [
          { title: "NumPy Quickstart – Official Docs", url: "https://numpy.org/doc/stable/user/quickstart.html", type: "documentation", isFree: true, platform: "NumPy Docs", qualityScore: 9 },
          { title: "NumPy Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Pandas DataFrames",
        description: "Load, inspect, filter, and transform tabular data with Series and DataFrames.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["NumPy Arrays & Vectorized Operations"],
        resources: [
          { title: "10 Minutes to Pandas – Official Docs", url: "https://pandas.pydata.org/docs/user_guide/10min.html", type: "documentation", isFree: true, platform: "Pandas Docs", qualityScore: 9 },
          { title: "Pandas Tutorial – Corey Schafer", url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Data Cleaning & Preprocessing",
        description: "Handle missing values, duplicates, type conversions, and outliers systematically.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Pandas DataFrames"],
        resources: [
          { title: "Data Cleaning with Pandas – Kaggle", url: "https://www.kaggle.com/learn/data-cleaning", type: "interactive", isFree: true, platform: "Kaggle", qualityScore: 9 },
        ],
      },
      {
        title: "Data Aggregation & GroupBy",
        description: "Summarize datasets with groupby, pivot tables, apply functions, and multi-index operations.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Data Cleaning & Preprocessing"],
        resources: [
          { title: "Pandas GroupBy – Real Python", url: "https://realpython.com/pandas-groupby/", type: "article", isFree: true, platform: "Real Python", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Data Visualization",
    description: "Communicate insights with beautiful, informative charts using Matplotlib, Seaborn, and Plotly.",
    estimatedHours: 10,
    topics: [
      {
        title: "Matplotlib Fundamentals",
        description: "Build line, bar, scatter, and histogram charts from scratch. Understand the Figure/Axes API.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: ["NumPy Arrays & Vectorized Operations"],
        resources: [
          { title: "Matplotlib Tutorial – Official Docs", url: "https://matplotlib.org/stable/tutorials/introductory/pyplot.html", type: "documentation", isFree: true, platform: "Matplotlib Docs", qualityScore: 9 },
          { title: "Matplotlib Crash Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=3Xc3CA655Y4", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Seaborn Statistical Plots",
        description: "Create heatmaps, pair plots, violin plots, and regression plots with one-liners.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Matplotlib Fundamentals"],
        resources: [
          { title: "Seaborn Tutorial – Official Docs", url: "https://seaborn.pydata.org/tutorial.html", type: "documentation", isFree: true, platform: "Seaborn Docs", qualityScore: 9 },
        ],
      },
      {
        title: "Plotly Interactive Charts",
        description: "Create interactive, publication-quality charts with Plotly Express and Graph Objects.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Matplotlib Fundamentals"],
        resources: [
          { title: "Plotly Express Tutorial – Official Docs", url: "https://plotly.com/python/plotly-express/", type: "documentation", isFree: true, platform: "Plotly Docs", qualityScore: 9 },
        ],
      },
      {
        title: "Dashboards with Streamlit",
        description: "Turn Python scripts into shareable web dashboards with zero frontend knowledge.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Plotly Interactive Charts"],
        resources: [
          { title: "Streamlit Get Started", url: "https://docs.streamlit.io/get-started", type: "documentation", isFree: true, platform: "Streamlit Docs", qualityScore: 9 },
          { title: "Build a Data App with Streamlit – freeCodeCamp", url: "https://www.youtube.com/watch?v=JwSS70SZdyM", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
    ],
  },
  {
    title: "Machine Learning with Scikit-learn",
    description: "Build, evaluate, and tune predictive models using the most popular ML library in Python.",
    estimatedHours: 16,
    topics: [
      {
        title: "Scikit-learn API & ML Workflow",
        description: "Understand the fit/predict API, train-test split, preprocessing pipelines, and cross-validation.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Data Cleaning & Preprocessing"],
        resources: [
          { title: "Getting Started – Scikit-learn Docs", url: "https://scikit-learn.org/stable/getting_started.html", type: "documentation", isFree: true, platform: "Scikit-learn Docs", qualityScore: 10 },
          { title: "Scikit-learn Tutorial – Kaggle", url: "https://www.kaggle.com/learn/intro-to-machine-learning", type: "interactive", isFree: true, platform: "Kaggle", qualityScore: 9 },
        ],
      },
      {
        title: "Regression Algorithms",
        description: "Implement Linear, Ridge, Lasso, and Polynomial regression. Interpret R² and RMSE.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Scikit-learn API & ML Workflow"],
        resources: [
          { title: "Linear Regression – Scikit-learn Docs", url: "https://scikit-learn.org/stable/modules/linear_model.html", type: "documentation", isFree: true, platform: "Scikit-learn Docs", qualityScore: 9 },
          { title: "Machine Learning for Everybody – freeCodeCamp", url: "https://www.youtube.com/watch?v=i_LwzRVP7bg", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Classification & Evaluation Metrics",
        description: "Train classifiers (Logistic Regression, Decision Trees, Random Forest) and evaluate with precision, recall, F1.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Regression Algorithms"],
        resources: [
          { title: "Classification – Scikit-learn User Guide", url: "https://scikit-learn.org/stable/supervised_learning.html", type: "documentation", isFree: true, platform: "Scikit-learn Docs", qualityScore: 9 },
          { title: "Intermediate ML – Kaggle", url: "https://www.kaggle.com/learn/intermediate-machine-learning", type: "interactive", isFree: true, platform: "Kaggle", qualityScore: 9 },
        ],
      },
      {
        title: "Model Tuning & Feature Engineering",
        description: "Improve model performance with GridSearchCV, hyperparameter tuning, and feature selection.",
        estimatedHours: 5,
        difficulty: "hard",
        prerequisites: ["Classification & Evaluation Metrics"],
        resources: [
          { title: "Hyperparameter Tuning – Scikit-learn", url: "https://scikit-learn.org/stable/modules/grid_search.html", type: "documentation", isFree: true, platform: "Scikit-learn Docs", qualityScore: 9 },
          { title: "Feature Engineering – Kaggle", url: "https://www.kaggle.com/learn/feature-engineering", type: "interactive", isFree: true, platform: "Kaggle", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Real-World Projects & Deployment",
    description: "Apply everything to end-to-end projects and deploy ML models to production.",
    estimatedHours: 12,
    topics: [
      {
        title: "Exploratory Data Analysis (EDA) Project",
        description: "Pick a public dataset and deliver a full EDA: statistics, visualizations, and written insights.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Dashboards with Streamlit", "Data Aggregation & GroupBy"],
        resources: [
          { title: "EDA Guide – Towards Data Science", url: "https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15", type: "article", isFree: true, platform: "Towards Data Science", qualityScore: 8 },
          { title: "Kaggle Datasets", url: "https://www.kaggle.com/datasets", type: "interactive", isFree: true, platform: "Kaggle", qualityScore: 9 },
        ],
      },
      {
        title: "Predictive Modeling Project",
        description: "Train, tune, and evaluate a regression or classification model on a real dataset end-to-end.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Model Tuning & Feature Engineering"],
        resources: [
          { title: "House Prices Competition – Kaggle", url: "https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques", type: "interactive", isFree: true, platform: "Kaggle", qualityScore: 9 },
        ],
      },
      {
        title: "Deploying ML Models with FastAPI",
        description: "Wrap a trained model in a REST API using FastAPI and serve predictions over HTTP.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Predictive Modeling Project"],
        resources: [
          { title: "Serving ML Models with FastAPI – Real Python", url: "https://realpython.com/fastapi-python-web-apis/", type: "article", isFree: true, platform: "Real Python", qualityScore: 8 },
          { title: "FastAPI Tutorial – tiangolo", url: "https://fastapi.tiangolo.com/tutorial/", type: "documentation", isFree: true, platform: "FastAPI Docs", qualityScore: 9 },
        ],
      },
      {
        title: "Capstone: End-to-End Data Pipeline",
        description: "Ingest raw data, clean it, train a model, visualize results, and expose predictions via API.",
        estimatedHours: 2,
        difficulty: "hard",
        prerequisites: ["Deploying ML Models with FastAPI", "Exploratory Data Analysis (EDA) Project"],
        resources: [
          { title: "Full ML Pipeline Tutorial – Towards Data Science", url: "https://towardsdatascience.com/end-to-end-machine-learning-project-with-python-nearly-for-free-f10154fd5bd1", type: "article", isFree: true, platform: "Towards Data Science", qualityScore: 8 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 3: Full-Stack Web Development
// ─────────────────────────────────────────────────────────────────────────────

const fullstackPhases: PhaseInsert[] = [
  {
    title: "HTML & CSS Foundations",
    description: "The bedrock of the web: semantic HTML and modern CSS layouts.",
    estimatedHours: 12,
    topics: [
      {
        title: "HTML Document Structure & Semantics",
        description: "Write well-structured HTML5 using semantic elements: header, main, nav, article, section, footer.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "HTML Basics – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
          { title: "HTML Full Course – freeCodeCamp", url: "https://www.freecodecamp.org/learn/responsive-web-design/", type: "interactive", isFree: true, platform: "freeCodeCamp", qualityScore: 9 },
        ],
      },
      {
        title: "CSS Selectors, Box Model & Typography",
        description: "Master CSS selectors, specificity, the box model, and text styling for professional layouts.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["HTML Document Structure & Semantics"],
        resources: [
          { title: "CSS Basics – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
        ],
      },
      {
        title: "Flexbox & CSS Grid",
        description: "Build complex layouts with Flexbox for 1D and CSS Grid for 2D. Covers alignment, gap, and spanning.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["CSS Selectors, Box Model & Typography"],
        resources: [
          { title: "A Complete Guide to Flexbox – CSS-Tricks", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", type: "article", isFree: true, platform: "CSS-Tricks", qualityScore: 9 },
          { title: "A Complete Guide to Grid – CSS-Tricks", url: "https://css-tricks.com/snippets/css/complete-guide-grid/", type: "article", isFree: true, platform: "CSS-Tricks", qualityScore: 9 },
          { title: "Flexbox Froggy", url: "https://flexboxfroggy.com/", type: "interactive", isFree: true, platform: "Flexbox Froggy", qualityScore: 8 },
        ],
      },
      {
        title: "Responsive Design & Media Queries",
        description: "Make sites look great on all screens with mobile-first design and responsive units.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Flexbox & CSS Grid"],
        resources: [
          { title: "Responsive Design – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
        ],
      },
      {
        title: "CSS Variables, Transitions & Animations",
        description: "Store design tokens in custom properties and add motion with transitions and @keyframes.",
        estimatedHours: 1,
        difficulty: "medium",
        prerequisites: ["Responsive Design & Media Queries"],
        resources: [
          { title: "Using CSS Custom Properties – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
          { title: "CSS Animations – Kevin Powell", url: "https://www.youtube.com/watch?v=YszONjKpgg4", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "JavaScript Fundamentals",
    description: "Write modern, maintainable JavaScript for both the browser and Node.js.",
    estimatedHours: 15,
    topics: [
      {
        title: "Variables, Types & Control Flow",
        description: "Understand let/const, primitives, type coercion, loops, and conditionals.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "JavaScript First Steps – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
          { title: "JavaScript Algorithms – freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", type: "interactive", isFree: true, platform: "freeCodeCamp", qualityScore: 9 },
        ],
      },
      {
        title: "Functions, Scope & Closures",
        description: "Master first-class functions, the call stack, closures, and the this keyword.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Variables, Types & Control Flow"],
        resources: [
          { title: "Functions Guide – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
          { title: "JavaScript: The Hard Parts – Frontend Masters (free trial)", url: "https://frontendmasters.com/courses/javascript-hard-parts-v2/", type: "course", isFree: false, platform: "Frontend Masters", qualityScore: 10 },
        ],
      },
      {
        title: "DOM Manipulation & Events",
        description: "Select, create, and modify DOM nodes. Attach event listeners and understand bubbling/delegation.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Variables, Types & Control Flow"],
        resources: [
          { title: "DOM Scripting – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
          { title: "JavaScript DOM Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=0ik6X4DJKCc", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Fetch API & Async JavaScript",
        description: "Make HTTP requests with fetch, handle Promises, and write clean async/await code.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Functions, Scope & Closures"],
        resources: [
          { title: "Fetching Data – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Network_requests", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
          { title: "Async Await – javascript.info", url: "https://javascript.info/async-await", type: "article", isFree: true, platform: "javascript.info", qualityScore: 9 },
        ],
      },
      {
        title: "ES6+ & Modern JavaScript",
        description: "Modules (import/export), destructuring, spread/rest, optional chaining, and nullish coalescing.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Functions, Scope & Closures"],
        resources: [
          { title: "ES6 Feature Overview – javascript.info", url: "https://javascript.info/", type: "article", isFree: true, platform: "javascript.info", qualityScore: 9 },
          { title: "JavaScript ES6+ – freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#es6", type: "interactive", isFree: true, platform: "freeCodeCamp", qualityScore: 8 },
        ],
      },
    ],
  },
  {
    title: "Backend with Node.js & Express",
    description: "Build RESTful APIs with Node.js, connect to a database, and add authentication.",
    estimatedHours: 18,
    topics: [
      {
        title: "Node.js Runtime & npm",
        description: "Understand the Node.js event loop, built-in modules (fs, path, http), and npm package management.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: ["ES6+ & Modern JavaScript"],
        resources: [
          { title: "Introduction to Node.js – Node.js Docs", url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs", type: "documentation", isFree: true, platform: "Node.js Docs", qualityScore: 9 },
          { title: "Node.js Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Express.js REST APIs",
        description: "Build CRUD REST endpoints with Express, use middleware, and structure routes properly.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Node.js Runtime & npm"],
        resources: [
          { title: "Express Getting Started", url: "https://expressjs.com/en/starter/installing.html", type: "documentation", isFree: true, platform: "Express Docs", qualityScore: 9 },
          { title: "REST API with Node & Express – freeCodeCamp", url: "https://www.youtube.com/watch?v=l8WPWK9mS5M", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Databases with PostgreSQL & Drizzle ORM",
        description: "Model relational data in PostgreSQL, write migrations with Drizzle, and run typed queries.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Express.js REST APIs"],
        resources: [
          { title: "Drizzle ORM Docs", url: "https://orm.drizzle.team/docs/get-started-postgresql", type: "documentation", isFree: true, platform: "Drizzle Docs", qualityScore: 9 },
          { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", type: "article", isFree: true, platform: "PostgreSQL Tutorial", qualityScore: 8 },
        ],
      },
      {
        title: "Authentication with JWT & Sessions",
        description: "Implement secure user registration, login, JWT access/refresh tokens, and protected routes.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Databases with PostgreSQL & Drizzle ORM"],
        resources: [
          { title: "JWT Introduction", url: "https://jwt.io/introduction", type: "documentation", isFree: true, platform: "JWT.io", qualityScore: 9 },
          { title: "Authentication Crash Course – Web Dev Simplified", url: "https://www.youtube.com/watch?v=7Q17ubqLfaM", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Middleware, Validation & Error Handling",
        description: "Use express-validator, rate limiting, CORS, helmet, and build global error-handling middleware.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Express.js REST APIs"],
        resources: [
          { title: "Express Middleware Guide", url: "https://expressjs.com/en/guide/using-middleware.html", type: "documentation", isFree: true, platform: "Express Docs", qualityScore: 9 },
          { title: "Node.js Security Best Practices – OWASP", url: "https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html", type: "documentation", isFree: true, platform: "OWASP", qualityScore: 10 },
        ],
      },
    ],
  },
  {
    title: "Frontend with React",
    description: "Build interactive, data-driven user interfaces with React, React Query, and form handling.",
    estimatedHours: 20,
    topics: [
      {
        title: "React Components, JSX & Hooks",
        description: "Function components, JSX, useState, useEffect, and the rules of hooks.",
        estimatedHours: 4,
        difficulty: "easy",
        prerequisites: ["ES6+ & Modern JavaScript"],
        resources: [
          { title: "Quick Start – React Docs", url: "https://react.dev/learn", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
          { title: "Full React Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "State Management: Context & useReducer",
        description: "Manage complex state with useReducer, share it with Context, and know when to reach for Zustand.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["React Components, JSX & Hooks"],
        resources: [
          { title: "Managing State – React Docs", url: "https://react.dev/learn/managing-state", type: "documentation", isFree: true, platform: "React Docs", qualityScore: 10 },
          { title: "Zustand Docs", url: "https://zustand.docs.pmnd.rs/getting-started/introduction", type: "documentation", isFree: true, platform: "Zustand", qualityScore: 9 },
        ],
      },
      {
        title: "React Router & Code Splitting",
        description: "Client-side routing with React Router v6, lazy loading routes, and nested layouts.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["React Components, JSX & Hooks"],
        resources: [
          { title: "React Router Tutorial", url: "https://reactrouter.com/en/main/start/tutorial", type: "documentation", isFree: true, platform: "React Router Docs", qualityScore: 9 },
        ],
      },
      {
        title: "Data Fetching with TanStack Query",
        description: "Server state management: queries, mutations, cache invalidation, loading, and error states.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["React Components, JSX & Hooks"],
        resources: [
          { title: "TanStack Query Quick Start", url: "https://tanstack.com/query/latest/docs/framework/react/quick-start", type: "documentation", isFree: true, platform: "TanStack Docs", qualityScore: 9 },
          { title: "React Query Tutorial – Web Dev Simplified", url: "https://www.youtube.com/watch?v=r8Dg0KVnfMA", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Forms with React Hook Form & Zod",
        description: "Build performant, accessible forms with React Hook Form and validate with Zod schemas.",
        estimatedHours: 5,
        difficulty: "medium",
        prerequisites: ["State Management: Context & useReducer"],
        resources: [
          { title: "React Hook Form Docs", url: "https://react-hook-form.com/get-started", type: "documentation", isFree: true, platform: "React Hook Form", qualityScore: 9 },
          { title: "Zod Docs", url: "https://zod.dev/", type: "documentation", isFree: true, platform: "Zod", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "DevOps & Deployment",
    description: "Version control, containerize your app, automate CI/CD, and deploy to the cloud.",
    estimatedHours: 15,
    topics: [
      {
        title: "Git & GitHub Workflows",
        description: "Branching strategies, pull requests, rebasing, stashing, and writing good commit messages.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "Pro Git Book – Free", url: "https://git-scm.com/book/en/v2", type: "book", isFree: true, platform: "git-scm.com", qualityScore: 9 },
          { title: "Git & GitHub Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=SWYqp7iY_Tc", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Docker & Containerization",
        description: "Write Dockerfiles, use docker-compose for local dev, and push images to a registry.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Node.js Runtime & npm"],
        resources: [
          { title: "Docker Getting Started", url: "https://docs.docker.com/get-started/", type: "documentation", isFree: true, platform: "Docker Docs", qualityScore: 9 },
          { title: "Docker Tutorial – TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "CI/CD with GitHub Actions",
        description: "Automate testing, linting, and deployments on every push using GitHub Actions workflows.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Git & GitHub Workflows", "Docker & Containerization"],
        resources: [
          { title: "GitHub Actions Quickstart", url: "https://docs.github.com/en/actions/quickstart", type: "documentation", isFree: true, platform: "GitHub Docs", qualityScore: 9 },
        ],
      },
      {
        title: "Deploying to Vercel & Neon",
        description: "Deploy a full-stack Next.js app to Vercel with a serverless Neon Postgres database.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["CI/CD with GitHub Actions"],
        resources: [
          { title: "Vercel Deployment Docs", url: "https://vercel.com/docs/deployments/overview", type: "documentation", isFree: true, platform: "Vercel", qualityScore: 9 },
          { title: "Neon Serverless Postgres", url: "https://neon.tech/docs/introduction", type: "documentation", isFree: true, platform: "Neon", qualityScore: 9 },
        ],
      },
      {
        title: "Environment Variables & Security Best Practices",
        description: "Never commit secrets. Use .env files, secret managers, and OWASP top-10 protections.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Express.js REST APIs"],
        resources: [
          { title: "OWASP Top Ten", url: "https://owasp.org/www-project-top-ten/", type: "documentation", isFree: true, platform: "OWASP", qualityScore: 10 },
          { title: "12-Factor App – Config", url: "https://12factor.net/config", type: "article", isFree: true, platform: "12factor.net", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Advanced Topics & Capstone",
    description: "TypeScript, testing, performance, real-time features, and a complete final project.",
    estimatedHours: 20,
    topics: [
      {
        title: "TypeScript Fundamentals",
        description: "Add type safety: interfaces, generics, utility types, and integrating TypeScript into a React/Node app.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["ES6+ & Modern JavaScript"],
        resources: [
          { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
          { title: "TypeScript Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=30LWjhZzg50", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Testing: Unit, Integration & E2E",
        description: "Write tests with Vitest and RTL for components, and end-to-end tests with Playwright.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["React Components, JSX & Hooks", "Express.js REST APIs"],
        resources: [
          { title: "Vitest Docs", url: "https://vitest.dev/guide/", type: "documentation", isFree: true, platform: "Vitest", qualityScore: 9 },
          { title: "Playwright Docs", url: "https://playwright.dev/docs/intro", type: "documentation", isFree: true, platform: "Playwright", qualityScore: 9 },
        ],
      },
      {
        title: "Performance & Core Web Vitals",
        description: "Measure LCP, INP, CLS. Optimize with code splitting, image optimization, and caching strategies.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["React Router & Code Splitting"],
        resources: [
          { title: "Core Web Vitals – web.dev", url: "https://web.dev/vitals/", type: "article", isFree: true, platform: "web.dev", qualityScore: 10 },
          { title: "Next.js Performance – Vercel", url: "https://nextjs.org/docs/app/building-your-application/optimizing", type: "documentation", isFree: true, platform: "Next.js Docs", qualityScore: 9 },
        ],
      },
      {
        title: "WebSockets & Real-time Features",
        description: "Add live updates with WebSockets using Socket.io. Build a real-time chat or notification system.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Express.js REST APIs", "React Components, JSX & Hooks"],
        resources: [
          { title: "Socket.io Get Started", url: "https://socket.io/get-started/chat", type: "documentation", isFree: true, platform: "Socket.io", qualityScore: 9 },
          { title: "Real-time Chat App – Traversy Media", url: "https://www.youtube.com/watch?v=jD7FnbI76Hg", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Capstone: Full-Stack Application",
        description: "Build, test, and deploy a complete full-stack app of your choice — be proud of it!",
        estimatedHours: 6,
        difficulty: "hard",
        prerequisites: ["TypeScript Fundamentals", "Testing: Unit, Integration & E2E", "Deploying to Vercel & Neon"],
        resources: [
          { title: "Project Ideas – Full-stack", url: "https://github.com/florinpop17/app-ideas", type: "article", isFree: true, platform: "GitHub", qualityScore: 8 },
          { title: "SaaS Starter with Next.js & Stripe – YouTube", url: "https://www.youtube.com/watch?v=2iJlrFPNUUo", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 4: TypeScript Mastery
// ─────────────────────────────────────────────────────────────────────────────

const typescriptPhases: PhaseInsert[] = [
  {
    title: "TypeScript Fundamentals",
    description: "Understand the type system, basic annotations, and how TS compiles to JavaScript.",
    estimatedHours: 8,
    topics: [
      {
        title: "Setting Up TypeScript",
        description: "Install TypeScript, configure tsconfig.json, and run your first typed program.",
        estimatedHours: 1,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "TypeScript in 5 Minutes – Official Docs", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
          { title: "TypeScript Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=BCg4U1FzODs", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Primitive Types & Type Annotations",
        description: "string, number, boolean, null, undefined, any, unknown, never, and void — when to use each.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: ["Setting Up TypeScript"],
        resources: [
          { title: "Everyday Types – TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
        ],
      },
      {
        title: "Interfaces & Type Aliases",
        description: "Define object shapes with interfaces, use type aliases, and know when to choose which.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: ["Primitive Types & Type Annotations"],
        resources: [
          { title: "Object Types – TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
          { title: "Interface vs Type – Matt Pocock", url: "https://www.youtube.com/watch?v=oiFo2z8ILNo", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Functions & Type Narrowing",
        description: "Type function parameters and return values, use type guards, and master narrowing patterns.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Interfaces & Type Aliases"],
        resources: [
          { title: "Narrowing – TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
          { title: "TypeScript Type Guards – Total TypeScript", url: "https://www.totaltypescript.com/tutorials/beginners-typescript", type: "interactive", isFree: true, platform: "Total TypeScript", qualityScore: 10 },
        ],
      },
    ],
  },
  {
    title: "Intermediate TypeScript",
    description: "Generics, utility types, and integrating TypeScript with real tools and libraries.",
    estimatedHours: 12,
    topics: [
      {
        title: "Generics",
        description: "Write reusable, type-safe functions and data structures with generic type parameters.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Interfaces & Type Aliases"],
        resources: [
          { title: "Generics – TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
          { title: "TypeScript Generics Tutorial – Net Ninja", url: "https://www.youtube.com/watch?v=IOzkOXSz9gE", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Utility Types",
        description: "Master Partial, Required, Pick, Omit, Record, Exclude, Extract, ReturnType, and more.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Generics"],
        resources: [
          { title: "Utility Types – TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
          { title: "TypeScript Utility Types – Matt Pocock", url: "https://www.totaltypescript.com/tips", type: "article", isFree: true, platform: "Total TypeScript", qualityScore: 10 },
        ],
      },
      {
        title: "TypeScript with React",
        description: "Type components, hooks, event handlers, refs, and context in a React application.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Generics"],
        resources: [
          { title: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/", type: "documentation", isFree: true, platform: "Community", qualityScore: 9 },
          { title: "Full React with TypeScript – freeCodeCamp", url: "https://www.youtube.com/watch?v=FJDVKeh7RJI", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "TypeScript with Node.js & Express",
        description: "Set up a fully typed Express server with typed route handlers, middleware, and request bodies.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Generics"],
        resources: [
          { title: "TypeScript with Node.js – Node.js Docs", url: "https://nodejs.org/en/learn/getting-started/nodejs-with-typescript", type: "documentation", isFree: true, platform: "Node.js Docs", qualityScore: 9 },
          { title: "REST API with TypeScript & Express", url: "https://www.youtube.com/watch?v=H91aqUHn8sE", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
    ],
  },
  {
    title: "Advanced TypeScript",
    description: "Conditional types, template literal types, mapped types, and declaration files.",
    estimatedHours: 14,
    topics: [
      {
        title: "Conditional Types",
        description: "Use T extends U ? X : Y to build complex type-level logic and inference.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Generics"],
        resources: [
          { title: "Conditional Types – TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
          { title: "Advanced TypeScript – Total TypeScript Pro", url: "https://www.totaltypescript.com/workshops/advanced-typescript-patterns", type: "course", isFree: false, platform: "Total TypeScript", qualityScore: 10 },
        ],
      },
      {
        title: "Mapped & Template Literal Types",
        description: "Transform object types with mapped types and create string union types at the type level.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Conditional Types"],
        resources: [
          { title: "Mapped Types – TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
          { title: "Template Literal Types – TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
        ],
      },
      {
        title: "Declaration Files & Module Augmentation",
        description: "Write .d.ts files, augment third-party types, and publish typed libraries.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Utility Types"],
        resources: [
          { title: "Declaration Files – TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html", type: "documentation", isFree: true, platform: "TypeScript Docs", qualityScore: 10 },
          { title: "DefinitelyTyped Guide", url: "https://definitelytyped.org/", type: "documentation", isFree: true, platform: "DefinitelyTyped", qualityScore: 9 },
        ],
      },
      {
        title: "Type-safe APIs with Zod & tRPC",
        description: "Use Zod for runtime validation and tRPC for fully type-safe client–server communication.",
        estimatedHours: 5,
        difficulty: "hard",
        prerequisites: ["TypeScript with React", "TypeScript with Node.js & Express"],
        resources: [
          { title: "Zod Documentation", url: "https://zod.dev/", type: "documentation", isFree: true, platform: "Zod", qualityScore: 9 },
          { title: "tRPC Documentation", url: "https://trpc.io/docs", type: "documentation", isFree: true, platform: "tRPC", qualityScore: 9 },
          { title: "tRPC Full Tutorial – Jack Herrington", url: "https://www.youtube.com/watch?v=2LYM8gf184U", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 5: DevOps & Cloud Engineering
// ─────────────────────────────────────────────────────────────────────────────

const devopsPhases: PhaseInsert[] = [
  {
    title: "Linux & Networking Essentials",
    description: "Every DevOps engineer starts here: command-line fluency and networking fundamentals.",
    estimatedHours: 10,
    topics: [
      {
        title: "Linux Command Line Basics",
        description: "Navigate the filesystem, manage files/permissions, write bash scripts, and use package managers.",
        estimatedHours: 4,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "Linux Command Line – William Shotts (Free Book)", url: "https://linuxcommand.org/tlcl.php", type: "book", isFree: true, platform: "linuxcommand.org", qualityScore: 9 },
          { title: "Linux Crash Course – NetworkChuck", url: "https://www.youtube.com/watch?v=ZtqBQ68cfJc", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Bash Scripting",
        description: "Automate repetitive tasks with shell scripts: variables, loops, conditionals, and functions.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Linux Command Line Basics"],
        resources: [
          { title: "Bash Scripting Tutorial – Ryan's Tutorials", url: "https://ryanstutorials.net/bash-scripting-tutorial/", type: "article", isFree: true, platform: "ryanstutorials.net", qualityScore: 8 },
          { title: "Shell Scripting – freeCodeCamp", url: "https://www.youtube.com/watch?v=v-F3YLd6oMw", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Networking Fundamentals",
        description: "TCP/IP, DNS, HTTP/HTTPS, ports, firewalls, load balancers, and how the internet actually works.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Linux Command Line Basics"],
        resources: [
          { title: "Computer Networking – Khan Academy", url: "https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:the-internet", type: "interactive", isFree: true, platform: "Khan Academy", qualityScore: 8 },
          { title: "Networking Fundamentals – TechWorld with Nana", url: "https://www.youtube.com/watch?v=IPvYjXCsTg8", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Containerization with Docker",
    description: "Package applications into portable containers with Docker and orchestrate them with Docker Compose.",
    estimatedHours: 12,
    topics: [
      {
        title: "Docker Fundamentals",
        description: "Images, containers, the Docker daemon, docker run, exec, logs, and managing container lifecycle.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Linux Command Line Basics"],
        resources: [
          { title: "Docker Getting Started", url: "https://docs.docker.com/get-started/", type: "documentation", isFree: true, platform: "Docker Docs", qualityScore: 10 },
          { title: "Docker Tutorial – TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Writing Dockerfiles",
        description: "Build optimized multi-stage Dockerfiles: layer caching, .dockerignore, non-root users, and best practices.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Docker Fundamentals"],
        resources: [
          { title: "Dockerfile Best Practices – Docker Docs", url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", type: "documentation", isFree: true, platform: "Docker Docs", qualityScore: 9 },
        ],
      },
      {
        title: "Docker Compose",
        description: "Define and run multi-container applications with docker-compose.yml: networks, volumes, and dependencies.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Writing Dockerfiles"],
        resources: [
          { title: "Docker Compose Overview", url: "https://docs.docker.com/compose/", type: "documentation", isFree: true, platform: "Docker Docs", qualityScore: 9 },
          { title: "Docker Compose Tutorial – TechWorld with Nana", url: "https://www.youtube.com/watch?v=SXwC9fSwct8", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Container Security",
        description: "Scan images for vulnerabilities with Trivy, use least-privilege containers, and manage secrets safely.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Writing Dockerfiles"],
        resources: [
          { title: "Docker Security Best Practices – Snyk", url: "https://snyk.io/learn/docker-security/", type: "article", isFree: true, platform: "Snyk", qualityScore: 9 },
          { title: "Trivy Vulnerability Scanner", url: "https://aquasecurity.github.io/trivy/", type: "documentation", isFree: true, platform: "Aqua Security", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "CI/CD Pipelines",
    description: "Automate your entire software delivery lifecycle from commit to production.",
    estimatedHours: 12,
    topics: [
      {
        title: "Git Workflows & Branching Strategies",
        description: "GitFlow vs trunk-based development, PRs, protected branches, and semantic commit messages.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "Atlassian Git Tutorials", url: "https://www.atlassian.com/git/tutorials/comparing-workflows", type: "article", isFree: true, platform: "Atlassian", qualityScore: 9 },
        ],
      },
      {
        title: "GitHub Actions",
        description: "Build CI/CD workflows with GitHub Actions: triggers, jobs, steps, matrix builds, secrets, and caching.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Git Workflows & Branching Strategies"],
        resources: [
          { title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
          { title: "GitHub Actions Full Course – TechWorld with Nana", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Artifact Management & Registries",
        description: "Push Docker images to Docker Hub / GitHub Container Registry and manage versioned artifacts.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["GitHub Actions", "Writing Dockerfiles"],
        resources: [
          { title: "GitHub Container Registry Docs", url: "https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
        ],
      },
      {
        title: "Testing in CI Pipelines",
        description: "Run unit, integration, and E2E tests automatically on PRs. Fail fast and report coverage.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["GitHub Actions"],
        resources: [
          { title: "Testing in CI/CD – Atlassian", url: "https://www.atlassian.com/continuous-delivery/software-testing/automated-testing", type: "article", isFree: true, platform: "Atlassian", qualityScore: 8 },
        ],
      },
    ],
  },
  {
    title: "Kubernetes",
    description: "Orchestrate containerized workloads at scale with the industry-standard container orchestrator.",
    estimatedHours: 20,
    topics: [
      {
        title: "Kubernetes Architecture",
        description: "Control plane (API server, etcd, scheduler, controller manager) and worker nodes (kubelet, kube-proxy).",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Docker Compose"],
        resources: [
          { title: "Kubernetes Components – Official Docs", url: "https://kubernetes.io/docs/concepts/overview/components/", type: "documentation", isFree: true, platform: "Kubernetes Docs", qualityScore: 10 },
          { title: "Kubernetes Explained – TechWorld with Nana", url: "https://www.youtube.com/watch?v=s_o8dwzRlu4", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Core Resources: Pods, Deployments & Services",
        description: "Create and manage Pods, Deployments with rolling updates, and Services for stable networking.",
        estimatedHours: 5,
        difficulty: "medium",
        prerequisites: ["Kubernetes Architecture"],
        resources: [
          { title: "Kubernetes Basics Tutorial – Official", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", type: "documentation", isFree: true, platform: "Kubernetes Docs", qualityScore: 10 },
          { title: "Kubernetes Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=X48VuDVv0do", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "ConfigMaps, Secrets & Volumes",
        description: "Externalize configuration with ConfigMaps, store secrets safely, and mount persistent storage.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Core Resources: Pods, Deployments & Services"],
        resources: [
          { title: "ConfigMaps – Kubernetes Docs", url: "https://kubernetes.io/docs/concepts/configuration/configmap/", type: "documentation", isFree: true, platform: "Kubernetes Docs", qualityScore: 10 },
          { title: "Kubernetes Secrets Best Practices – Bitnami", url: "https://docs.bitnami.com/kubernetes/faq/administration/understand-secrets/", type: "article", isFree: true, platform: "Bitnami", qualityScore: 8 },
        ],
      },
      {
        title: "Ingress, HPA & Namespaces",
        description: "Route external traffic with Ingress controllers, auto-scale workloads with HPA, and isolate environments with namespaces.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Core Resources: Pods, Deployments & Services"],
        resources: [
          { title: "Ingress – Kubernetes Docs", url: "https://kubernetes.io/docs/concepts/services-networking/ingress/", type: "documentation", isFree: true, platform: "Kubernetes Docs", qualityScore: 10 },
          { title: "Kubernetes Horizontal Pod Autoscaler", url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", type: "documentation", isFree: true, platform: "Kubernetes Docs", qualityScore: 10 },
        ],
      },
      {
        title: "Helm Package Manager",
        description: "Templatize K8s manifests with Helm charts and deploy from community registries.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Ingress, HPA & Namespaces"],
        resources: [
          { title: "Helm Getting Started", url: "https://helm.sh/docs/intro/quickstart/", type: "documentation", isFree: true, platform: "Helm Docs", qualityScore: 9 },
          { title: "Helm Tutorial – TechWorld with Nana", url: "https://www.youtube.com/watch?v=-ykwb1d0DXU", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Cloud Platforms & Infrastructure as Code",
    description: "Provision and manage cloud infrastructure on AWS/GCP/Azure using Terraform.",
    estimatedHours: 18,
    topics: [
      {
        title: "AWS Core Services",
        description: "EC2, S3, RDS, VPC, IAM, Lambda, and CloudFront — the building blocks of cloud architecture.",
        estimatedHours: 5,
        difficulty: "medium",
        prerequisites: ["Networking Fundamentals"],
        resources: [
          { title: "AWS Free Tier + Getting Started", url: "https://aws.amazon.com/getting-started/", type: "documentation", isFree: true, platform: "AWS", qualityScore: 9 },
          { title: "AWS Certified Cloud Practitioner – freeCodeCamp", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Terraform Fundamentals",
        description: "Write HCL, understand providers/resources/state, and manage cloud infrastructure as code.",
        estimatedHours: 5,
        difficulty: "medium",
        prerequisites: ["AWS Core Services"],
        resources: [
          { title: "Terraform Get Started – AWS", url: "https://developer.hashicorp.com/terraform/tutorials/aws-get-started", type: "documentation", isFree: true, platform: "HashiCorp", qualityScore: 9 },
          { title: "Terraform Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Monitoring & Observability",
        description: "Set up Prometheus + Grafana for metrics, ELK for logs, and distributed tracing with OpenTelemetry.",
        estimatedHours: 5,
        difficulty: "hard",
        prerequisites: ["Kubernetes Architecture"],
        resources: [
          { title: "Prometheus Getting Started", url: "https://prometheus.io/docs/prometheus/latest/getting_started/", type: "documentation", isFree: true, platform: "Prometheus", qualityScore: 9 },
          { title: "Grafana Fundamentals Tutorial", url: "https://grafana.com/tutorials/grafana-fundamentals/", type: "documentation", isFree: true, platform: "Grafana", qualityScore: 9 },
          { title: "OpenTelemetry Docs", url: "https://opentelemetry.io/docs/", type: "documentation", isFree: true, platform: "OpenTelemetry", qualityScore: 9 },
        ],
      },
      {
        title: "Site Reliability Engineering Practices",
        description: "SLOs/SLIs/SLAs, error budgets, chaos engineering with LitmusChaos, and post-mortems.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Monitoring & Observability"],
        resources: [
          { title: "Site Reliability Engineering – Google Free Book", url: "https://sre.google/sre-book/table-of-contents/", type: "book", isFree: true, platform: "Google SRE", qualityScore: 10 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 6: System Design & Architecture
// ─────────────────────────────────────────────────────────────────────────────

const systemdesignPhases: PhaseInsert[] = [
  {
    title: "Foundations of Distributed Systems",
    description: "Core concepts every engineer needs before designing large-scale systems.",
    estimatedHours: 10,
    topics: [
      {
        title: "How the Web Works",
        description: "DNS resolution, HTTP/1.1 vs HTTP/2 vs HTTP/3, CDNs, and TLS handshakes in depth.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "How DNS Works – Cloudflare Learning", url: "https://www.cloudflare.com/learning/dns/what-is-dns/", type: "article", isFree: true, platform: "Cloudflare", qualityScore: 9 },
          { title: "HTTP Caching – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching", type: "documentation", isFree: true, platform: "MDN", qualityScore: 9 },
        ],
      },
      {
        title: "CAP Theorem & Consistency Models",
        description: "Understand the trade-offs between Consistency, Availability, and Partition Tolerance in distributed systems.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["How the Web Works"],
        resources: [
          { title: "CAP Theorem Explained – Towards Data Science", url: "https://towardsdatascience.com/cap-theorem-and-distributed-database-management-systems-5c2be977950e", type: "article", isFree: true, platform: "Towards Data Science", qualityScore: 8 },
          { title: "Designing Data-Intensive Applications – Chapter 1", url: "https://dataintensive.net/", type: "book", isFree: false, platform: "O'Reilly", qualityScore: 10 },
        ],
      },
      {
        title: "Latency, Throughput & Bottlenecks",
        description: "Measure system performance, understand latency numbers every engineer should know, and identify bottlenecks.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["CAP Theorem & Consistency Models"],
        resources: [
          { title: "Latency Numbers – Colin Scott", url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html", type: "interactive", isFree: true, platform: "Community", qualityScore: 9 },
        ],
      },
      {
        title: "API Design: REST, GraphQL & gRPC",
        description: "Design intuitive REST APIs, use GraphQL for flexible queries, and gRPC for high-performance RPCs.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["How the Web Works"],
        resources: [
          { title: "REST API Design Best Practices – Microsoft", url: "https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design", type: "documentation", isFree: true, platform: "Microsoft", qualityScore: 9 },
          { title: "GraphQL Introduction", url: "https://graphql.org/learn/", type: "documentation", isFree: true, platform: "GraphQL", qualityScore: 9 },
          { title: "gRPC Core Concepts", url: "https://grpc.io/docs/what-is-grpc/core-concepts/", type: "documentation", isFree: true, platform: "gRPC", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Database Design & Scaling",
    description: "Choose the right database, model data correctly, and scale reads and writes.",
    estimatedHours: 14,
    topics: [
      {
        title: "Relational vs NoSQL Databases",
        description: "Compare RDBMS, document stores, key-value, column-family, and graph databases. Know when to use each.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["CAP Theorem & Consistency Models"],
        resources: [
          { title: "SQL vs NoSQL – MongoDB", url: "https://www.mongodb.com/nosql-explained/nosql-vs-sql", type: "article", isFree: true, platform: "MongoDB", qualityScore: 8 },
          { title: "Database Internals – Alex Petrov (Book)", url: "https://www.databass.dev/", type: "book", isFree: false, platform: "O'Reilly", qualityScore: 10 },
        ],
      },
      {
        title: "Database Indexing",
        description: "B-tree and hash indexes, composite indexes, covering indexes, and query explain plans.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Relational vs NoSQL Databases"],
        resources: [
          { title: "Indexing in PostgreSQL – Postgres Docs", url: "https://www.postgresql.org/docs/current/indexes.html", type: "documentation", isFree: true, platform: "PostgreSQL", qualityScore: 9 },
          { title: "How Database Indexes Work – Use The Index, Luke", url: "https://use-the-index-luke.com/", type: "article", isFree: true, platform: "Use The Index, Luke", qualityScore: 10 },
        ],
      },
      {
        title: "Database Replication & Sharding",
        description: "Leader-follower replication for read scaling, horizontal sharding for write scaling, and consistent hashing.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Database Indexing"],
        resources: [
          { title: "Designing Data-Intensive Applications – Replication", url: "https://dataintensive.net/", type: "book", isFree: false, platform: "O'Reilly", qualityScore: 10 },
          { title: "Database Sharding – PlanetScale", url: "https://planetscale.com/blog/how-does-database-sharding-work", type: "article", isFree: true, platform: "PlanetScale", qualityScore: 9 },
        ],
      },
      {
        title: "Caching Strategies",
        description: "Cache-aside, write-through, write-behind patterns; Redis data structures; cache invalidation challenges.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Latency, Throughput & Bottlenecks"],
        resources: [
          { title: "Caching Strategies – AWS", url: "https://aws.amazon.com/caching/best-practices/", type: "documentation", isFree: true, platform: "AWS", qualityScore: 9 },
          { title: "Redis Data Structures – Redis University", url: "https://university.redis.com/courses/ru101/", type: "course", isFree: true, platform: "Redis University", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Scalability & High Availability",
    description: "Design systems that handle millions of users and zero downtime.",
    estimatedHours: 14,
    topics: [
      {
        title: "Load Balancing",
        description: "Round-robin, least-connections, IP-hash; L4 vs L7 balancers; health checks and session affinity.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Database Replication & Sharding"],
        resources: [
          { title: "Load Balancing – NGINX Docs", url: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/", type: "documentation", isFree: true, platform: "NGINX", qualityScore: 9 },
          { title: "AWS Elastic Load Balancing", url: "https://aws.amazon.com/elasticloadbalancing/getting-started/", type: "documentation", isFree: true, platform: "AWS", qualityScore: 9 },
        ],
      },
      {
        title: "Message Queues & Event-Driven Architecture",
        description: "Decouple services with Kafka and RabbitMQ. Producer-consumer patterns, topics, partitions, and dead-letter queues.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["API Design: REST, GraphQL & gRPC"],
        resources: [
          { title: "Kafka Introduction", url: "https://kafka.apache.org/intro", type: "documentation", isFree: true, platform: "Apache Kafka", qualityScore: 9 },
          { title: "Event-Driven Architecture – Martin Fowler", url: "https://martinfowler.com/articles/201701-event-driven.html", type: "article", isFree: true, platform: "martinfowler.com", qualityScore: 10 },
        ],
      },
      {
        title: "Microservices vs Monolith",
        description: "Decompose monoliths into services: service mesh, inter-service communication, distributed tracing, and saga pattern.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Message Queues & Event-Driven Architecture"],
        resources: [
          { title: "Microservices – Martin Fowler", url: "https://martinfowler.com/articles/microservices.html", type: "article", isFree: true, platform: "martinfowler.com", qualityScore: 10 },
          { title: "Microservices with Node.js – freeCodeCamp", url: "https://www.youtube.com/watch?v=ELFORM9fmss", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "CDN, Rate Limiting & Circuit Breakers",
        description: "Serve assets from edge locations, protect APIs with rate limiting, and prevent cascading failures.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Load Balancing"],
        resources: [
          { title: "CDN Guide – Cloudflare", url: "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/", type: "article", isFree: true, platform: "Cloudflare", qualityScore: 9 },
          { title: "Circuit Breaker Pattern – Microsoft", url: "https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker", type: "documentation", isFree: true, platform: "Microsoft", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "System Design Interview Preparation",
    description: "Practice designing real-world systems end-to-end using a proven framework.",
    estimatedHours: 12,
    topics: [
      {
        title: "System Design Framework",
        description: "Requirements clarification → capacity estimation → high-level design → deep dive → bottlenecks.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["CDN, Rate Limiting & Circuit Breakers"],
        resources: [
          { title: "System Design Primer – GitHub", url: "https://github.com/donnemartin/system-design-primer", type: "article", isFree: true, platform: "GitHub", qualityScore: 10 },
          { title: "Grokking System Design – ByteByteGo", url: "https://www.youtube.com/@ByteByteGo", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Design: URL Shortener",
        description: "Build a TinyURL clone. Cover hash collisions, database choice, caching, and analytics tracking.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["System Design Framework"],
        resources: [
          { title: "URL Shortener – System Design Primer", url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/pastebin/README.md", type: "article", isFree: true, platform: "GitHub", qualityScore: 9 },
        ],
      },
      {
        title: "Design: Distributed Message Queue",
        description: "Design a Kafka-like system: producers, consumers, partitions, replication, and delivery guarantees.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Message Queues & Event-Driven Architecture"],
        resources: [
          { title: "Design a Message Queue – ByteByteGo", url: "https://www.youtube.com/watch?v=iJLL-KPqBpM", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Design: Notification System at Scale",
        description: "Multi-channel notifications (push, email, SMS) with fan-out, deduplication, and delivery tracking.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Message Queues & Event-Driven Architecture", "CDN, Rate Limiting & Circuit Breakers"],
        resources: [
          { title: "Design a Notification System – ByteByteGo", url: "https://www.youtube.com/watch?v=IT5-bZdQ27Q", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
          { title: "System Design Interview – Alex Xu (Book)", url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF", type: "book", isFree: false, platform: "Amazon", qualityScore: 10 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 7: React Native Mobile Development
// ─────────────────────────────────────────────────────────────────────────────

const reactnativePhases: PhaseInsert[] = [
  {
    title: "Environment Setup & React Native Basics",
    description: "Get your dev environment running and understand how React Native maps to native UI.",
    estimatedHours: 8,
    topics: [
      {
        title: "Setting Up React Native (Expo & CLI)",
        description: "Install Expo Go for quick start, configure React Native CLI for full control, run on iOS simulator and Android emulator.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "Expo Getting Started", url: "https://docs.expo.dev/get-started/introduction/", type: "documentation", isFree: true, platform: "Expo Docs", qualityScore: 9 },
          { title: "React Native Environment Setup", url: "https://reactnative.dev/docs/environment-setup", type: "documentation", isFree: true, platform: "React Native Docs", qualityScore: 9 },
        ],
      },
      {
        title: "Core Components & Layouts with Flexbox",
        description: "View, Text, Image, ScrollView, FlatList — and why Flexbox works differently on mobile.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Setting Up React Native (Expo & CLI)"],
        resources: [
          { title: "Core Components – React Native Docs", url: "https://reactnative.dev/docs/components-and-apis", type: "documentation", isFree: true, platform: "React Native Docs", qualityScore: 9 },
          { title: "React Native Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=Hf4MJH0jDb4", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Styling in React Native",
        description: "StyleSheet API, inline styles, NativeWind (Tailwind for RN), and platform-specific styles.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Core Components & Layouts with Flexbox"],
        resources: [
          { title: "Style – React Native Docs", url: "https://reactnative.dev/docs/style", type: "documentation", isFree: true, platform: "React Native Docs", qualityScore: 9 },
          { title: "NativeWind Docs", url: "https://www.nativewind.dev/", type: "documentation", isFree: true, platform: "NativeWind", qualityScore: 8 },
        ],
      },
    ],
  },
  {
    title: "Navigation & State Management",
    description: "Build multi-screen apps with React Navigation and manage state effectively.",
    estimatedHours: 10,
    topics: [
      {
        title: "React Navigation: Stack & Tab",
        description: "Set up a navigator, pass params between screens, use stack, tab, and drawer navigators.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Styling in React Native"],
        resources: [
          { title: "React Navigation Getting Started", url: "https://reactnavigation.org/docs/getting-started", type: "documentation", isFree: true, platform: "React Navigation Docs", qualityScore: 9 },
          { title: "React Navigation Tutorial – William Candillon", url: "https://www.youtube.com/watch?v=nQVCkqvU1uE", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Expo Router (File-Based Routing)",
        description: "Use Expo Router for file-system-based navigation — similar to Next.js but for mobile.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["React Navigation: Stack & Tab"],
        resources: [
          { title: "Expo Router Docs", url: "https://docs.expo.dev/router/introduction/", type: "documentation", isFree: true, platform: "Expo Docs", qualityScore: 9 },
        ],
      },
      {
        title: "State Management with Zustand & Context",
        description: "Manage global app state with Zustand for simplicity or Context + useReducer for complex flows.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Core Components & Layouts with Flexbox"],
        resources: [
          { title: "Zustand – React Native", url: "https://zustand.docs.pmnd.rs/getting-started/introduction", type: "documentation", isFree: true, platform: "Zustand", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Native Features & APIs",
    description: "Access the camera, location, storage, notifications, and sensors using Expo APIs.",
    estimatedHours: 12,
    topics: [
      {
        title: "Camera & Media Library",
        description: "Capture photos/videos, pick from gallery, and upload to storage using expo-image-picker.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Expo Router (File-Based Routing)"],
        resources: [
          { title: "expo-image-picker Docs", url: "https://docs.expo.dev/versions/latest/sdk/imagepicker/", type: "documentation", isFree: true, platform: "Expo Docs", qualityScore: 9 },
        ],
      },
      {
        title: "Location & Maps",
        description: "Get GPS coordinates with expo-location and render interactive maps with react-native-maps.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Setting Up React Native (Expo & CLI)"],
        resources: [
          { title: "expo-location Docs", url: "https://docs.expo.dev/versions/latest/sdk/location/", type: "documentation", isFree: true, platform: "Expo Docs", qualityScore: 9 },
          { title: "React Native Maps – GitHub", url: "https://github.com/react-native-maps/react-native-maps", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 8 },
        ],
      },
      {
        title: "Push Notifications",
        description: "Send push notifications with Expo Notifications, handle background and foreground messages.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Setting Up React Native (Expo & CLI)"],
        resources: [
          { title: "Expo Notifications Docs", url: "https://docs.expo.dev/push-notifications/overview/", type: "documentation", isFree: true, platform: "Expo Docs", qualityScore: 9 },
        ],
      },
      {
        title: "Offline Storage & AsyncStorage",
        description: "Persist data locally with AsyncStorage, SQLite (expo-sqlite), and MMKV for performance.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["State Management with Zustand & Context"],
        resources: [
          { title: "AsyncStorage Docs", url: "https://react-native-async-storage.github.io/async-storage/docs/usage/", type: "documentation", isFree: true, platform: "AsyncStorage", qualityScore: 8 },
          { title: "expo-sqlite Docs", url: "https://docs.expo.dev/versions/latest/sdk/sqlite/", type: "documentation", isFree: true, platform: "Expo Docs", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Performance, Testing & Publishing",
    description: "Optimize your app, write tests, and publish to the App Store and Google Play.",
    estimatedHours: 10,
    topics: [
      {
        title: "Performance Optimization",
        description: "Avoid FlatList pitfalls, use React.memo, useMemo, useCallback, and enable Hermes engine.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Core Components & Layouts with Flexbox"],
        resources: [
          { title: "Performance Overview – React Native Docs", url: "https://reactnative.dev/docs/performance", type: "documentation", isFree: true, platform: "React Native Docs", qualityScore: 9 },
          { title: "Flashlist – Shopify (Fast List)", url: "https://shopify.github.io/flash-list/docs/", type: "documentation", isFree: true, platform: "Shopify", qualityScore: 9 },
        ],
      },
      {
        title: "Testing React Native Apps",
        description: "Unit tests with Jest, component tests with RNTL, and E2E automation with Detox.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["State Management with Zustand & Context"],
        resources: [
          { title: "Testing – React Native Docs", url: "https://reactnative.dev/docs/testing-overview", type: "documentation", isFree: true, platform: "React Native Docs", qualityScore: 9 },
          { title: "Detox E2E Framework", url: "https://wix.github.io/Detox/docs/introduction/getting-started", type: "documentation", isFree: true, platform: "Detox", qualityScore: 8 },
        ],
      },
      {
        title: "Publishing to App Store & Google Play",
        description: "Use EAS Build to compile production binaries, sign them, and submit through EAS Submit.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Camera & Media Library"],
        resources: [
          { title: "EAS Build Docs", url: "https://docs.expo.dev/build/introduction/", type: "documentation", isFree: true, platform: "Expo Docs", qualityScore: 9 },
          { title: "Publish to App Store – Expo Tutorial", url: "https://docs.expo.dev/submit/ios/", type: "documentation", isFree: true, platform: "Expo Docs", qualityScore: 9 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 8: AI & LLM Engineering
// ─────────────────────────────────────────────────────────────────────────────

const aiengineeringPhases: PhaseInsert[] = [
  {
    title: "AI & LLM Foundations",
    description: "Understand transformer architecture, LLM concepts, and the modern AI stack.",
    estimatedHours: 10,
    topics: [
      {
        title: "How Large Language Models Work",
        description: "Transformer architecture, attention mechanism, tokenization, context windows, and temperature/top-p sampling.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: [],
        resources: [
          { title: "The Illustrated Transformer – Jay Alammar", url: "https://jalammar.github.io/illustrated-transformer/", type: "article", isFree: true, platform: "jalammar.github.io", qualityScore: 10 },
          { title: "3Blue1Brown – Neural Networks Series", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
        ],
      },
      {
        title: "Prompting Fundamentals",
        description: "Zero-shot, few-shot, chain-of-thought, and system prompts. Learn to write prompts that get consistent, structured output.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: ["How Large Language Models Work"],
        resources: [
          { title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", type: "documentation", isFree: true, platform: "DAIR.AI", qualityScore: 10 },
          { title: "ChatGPT Prompt Engineering – DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", type: "course", isFree: true, platform: "DeepLearning.AI", qualityScore: 10 },
        ],
      },
      {
        title: "LLM APIs: OpenAI, Anthropic & Groq",
        description: "Call GPT-4o, Claude, and Llama via API. Understand token pricing, rate limits, and response streaming.",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: ["Prompting Fundamentals"],
        resources: [
          { title: "OpenAI API Reference", url: "https://platform.openai.com/docs/api-reference", type: "documentation", isFree: true, platform: "OpenAI", qualityScore: 9 },
          { title: "Groq API Docs", url: "https://console.groq.com/docs/openai", type: "documentation", isFree: true, platform: "Groq", qualityScore: 9 },
        ],
      },
      {
        title: "The Vercel AI SDK",
        description: "Stream LLM responses in Next.js, use useChat/useCompletion hooks, and switch providers seamlessly.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["LLM APIs: OpenAI, Anthropic & Groq"],
        resources: [
          { title: "Vercel AI SDK Docs", url: "https://sdk.vercel.ai/docs", type: "documentation", isFree: true, platform: "Vercel", qualityScore: 9 },
          { title: "Build an AI Chatbot – Vercel Tutorial", url: "https://sdk.vercel.ai/docs/getting-started/nextjs-app-router", type: "documentation", isFree: true, platform: "Vercel", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Retrieval-Augmented Generation (RAG)",
    description: "Ground LLM responses in your own data using vector search and document retrieval.",
    estimatedHours: 14,
    topics: [
      {
        title: "Vector Embeddings",
        description: "Generate text embeddings with OpenAI/Cohere, understand cosine similarity, and choose the right embedding model.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["LLM APIs: OpenAI, Anthropic & Groq"],
        resources: [
          { title: "What are Embeddings – OpenAI", url: "https://platform.openai.com/docs/guides/embeddings", type: "documentation", isFree: true, platform: "OpenAI", qualityScore: 9 },
          { title: "Embeddings Explained – Weaviate", url: "https://weaviate.io/blog/vector-embeddings-explained", type: "article", isFree: true, platform: "Weaviate", qualityScore: 9 },
        ],
      },
      {
        title: "Vector Databases",
        description: "Store and search embeddings with pgvector (Postgres), Pinecone, or Chroma. ANN algorithms: HNSW and IVF.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Vector Embeddings"],
        resources: [
          { title: "pgvector – GitHub", url: "https://github.com/pgvector/pgvector", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
          { title: "Pinecone Learning Center", url: "https://www.pinecone.io/learn/", type: "article", isFree: true, platform: "Pinecone", qualityScore: 9 },
        ],
      },
      {
        title: "Building a RAG Pipeline",
        description: "Chunk documents, embed them, store in a vector DB, retrieve relevant chunks, and inject into the LLM prompt.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Vector Databases"],
        resources: [
          { title: "LangChain RAG Tutorial", url: "https://python.langchain.com/docs/tutorials/rag/", type: "documentation", isFree: true, platform: "LangChain", qualityScore: 9 },
          { title: "Build RAG with Vercel AI SDK + pgvector", url: "https://sdk.vercel.ai/docs/guides/rag-chatbot", type: "documentation", isFree: true, platform: "Vercel", qualityScore: 9 },
        ],
      },
      {
        title: "Advanced RAG: Reranking & Hybrid Search",
        description: "Improve retrieval quality with cross-encoder reranking, hybrid keyword+vector search, and HyDE.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Building a RAG Pipeline"],
        resources: [
          { title: "Advanced RAG Techniques – LlamaIndex", url: "https://docs.llamaindex.ai/en/stable/optimizing/advanced_retrieval/advanced_retrieval/", type: "documentation", isFree: true, platform: "LlamaIndex", qualityScore: 9 },
          { title: "RAG from Scratch – LangChain YouTube", url: "https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "AI Agents & Tool Use",
    description: "Build autonomous agents that can reason, plan, and use tools to complete complex tasks.",
    estimatedHours: 14,
    topics: [
      {
        title: "Function Calling & Structured Output",
        description: "Make LLMs call functions reliably, return JSON schemas, and use Zod/instructor for structured output.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["The Vercel AI SDK"],
        resources: [
          { title: "Function Calling – OpenAI Docs", url: "https://platform.openai.com/docs/guides/function-calling", type: "documentation", isFree: true, platform: "OpenAI", qualityScore: 9 },
          { title: "Instructor (Structured Output) – GitHub", url: "https://github.com/instructor-ai/instructor", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
        ],
      },
      {
        title: "Building AI Agents with LangGraph",
        description: "Define agent graphs with nodes and edges, implement ReAct loops, and manage agent memory.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Function Calling & Structured Output", "Building a RAG Pipeline"],
        resources: [
          { title: "LangGraph Quickstart", url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/", type: "documentation", isFree: true, platform: "LangChain", qualityScore: 9 },
          { title: "LangGraph Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=jGg_1h0qxhQ", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Multi-Agent Systems",
        description: "Orchestrate specialized agents (planner, executor, reviewer) using CrewAI or AutoGen.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Building AI Agents with LangGraph"],
        resources: [
          { title: "CrewAI Docs", url: "https://docs.crewai.com/introduction", type: "documentation", isFree: true, platform: "CrewAI", qualityScore: 8 },
          { title: "AutoGen – Microsoft", url: "https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/quickstart.html", type: "documentation", isFree: true, platform: "Microsoft", qualityScore: 9 },
        ],
      },
      {
        title: "AI Agent Memory & Persistence",
        description: "Short-term working memory, long-term semantic memory with vector stores, and episodic memory with databases.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Building AI Agents with LangGraph"],
        resources: [
          { title: "Memory in AI Agents – LangChain Conceptual Guide", url: "https://python.langchain.com/docs/concepts/memory/", type: "documentation", isFree: true, platform: "LangChain", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Fine-tuning, Evaluation & Production AI",
    description: "Customize models, evaluate output quality, and run AI systems reliably in production.",
    estimatedHours: 12,
    topics: [
      {
        title: "Fine-tuning LLMs",
        description: "LoRA/QLoRA fine-tuning with Unsloth, prepare instruction datasets, and push to Hugging Face Hub.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Advanced RAG: Reranking & Hybrid Search"],
        resources: [
          { title: "Fine-tuning LLMs – Hugging Face Course", url: "https://huggingface.co/learn/nlp-course/chapter3/1", type: "course", isFree: true, platform: "Hugging Face", qualityScore: 9 },
          { title: "Unsloth – Fast Fine-tuning", url: "https://github.com/unslothai/unsloth", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
        ],
      },
      {
        title: "LLM Evaluation Frameworks",
        description: "Evaluate faithfulness, answer relevancy, and hallucination rate with RAGAS, LangSmith, and Promptfoo.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Building a RAG Pipeline"],
        resources: [
          { title: "RAGAS Docs", url: "https://docs.ragas.io/en/stable/", type: "documentation", isFree: true, platform: "RAGAS", qualityScore: 9 },
          { title: "LangSmith Evaluation", url: "https://docs.smith.langchain.com/concepts/evaluation", type: "documentation", isFree: true, platform: "LangChain", qualityScore: 9 },
        ],
      },
      {
        title: "AI Guardrails & Safety",
        description: "Prevent prompt injection, jailbreaks, and toxic output using NeMo Guardrails and content moderation APIs.",
        estimatedHours: 2,
        difficulty: "hard",
        prerequisites: ["Function Calling & Structured Output"],
        resources: [
          { title: "NeMo Guardrails – NVIDIA", url: "https://github.com/NVIDIA/NeMo-Guardrails", type: "documentation", isFree: true, platform: "NVIDIA", qualityScore: 9 },
          { title: "Prompt Injection Attacks – OWASP LLM Top 10", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", type: "documentation", isFree: true, platform: "OWASP", qualityScore: 10 },
        ],
      },
      {
        title: "Deploying AI Applications to Production",
        description: "Cost optimization with caching and model routing, latency optimization with streaming, and monitoring with LangSmith.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["LLM Evaluation Frameworks", "AI Guardrails & Safety"],
        resources: [
          { title: "LLM Latency Optimization – Fireworks AI", url: "https://fireworks.ai/blog/llm-inference-optimization-guide", type: "article", isFree: true, platform: "Fireworks AI", qualityScore: 8 },
          { title: "LangSmith Tracing", url: "https://docs.smith.langchain.com/", type: "documentation", isFree: true, platform: "LangChain", qualityScore: 9 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 9: CS Fundamentals & Data Structures and Algorithms
// ─────────────────────────────────────────────────────────────────────────────

const dsaPhases: PhaseInsert[] = [
  {
    title: "Core Data Structures",
    description: "Master the fundamental data structures that underpin every algorithm and interview question.",
    estimatedHours: 16,
    topics: [
      {
        title: "Arrays & Strings",
        description: "In-place manipulation, two-pointer and sliding-window techniques, and string hashing.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "Arrays – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/array-and-string/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
          { title: "Arrays & Strings – CS50", url: "https://cs50.harvard.edu/x/2024/", type: "course", isFree: true, platform: "Harvard/edX", qualityScore: 10 },
        ],
      },
      {
        title: "Linked Lists",
        description: "Singly and doubly linked lists, fast-slow pointers, reversals, and cycle detection.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Arrays & Strings"],
        resources: [
          { title: "Linked Lists – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/linked-list/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
          { title: "Linked Lists – Visualgo", url: "https://visualgo.net/en/list", type: "interactive", isFree: true, platform: "Visualgo", qualityScore: 9 },
        ],
      },
      {
        title: "Stacks & Queues",
        description: "LIFO/FIFO semantics, monotonic stacks, deques, and priority queues (heaps).",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Linked Lists"],
        resources: [
          { title: "Stack – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/queue-stack/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
        ],
      },
      {
        title: "Hash Tables",
        description: "Hash functions, collision resolution, and using maps/sets to solve O(1) lookup problems.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Arrays & Strings"],
        resources: [
          { title: "Hash Tables – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/hash-table/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
          { title: "How HashMap Works – Baeldung", url: "https://www.baeldung.com/java-hashmap", type: "article", isFree: true, platform: "Baeldung", qualityScore: 8 },
        ],
      },
      {
        title: "Trees & Binary Search Trees",
        description: "Binary trees, BSTs, tree traversals (inorder/preorder/postorder/BFS), height, and balance.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Stacks & Queues"],
        resources: [
          { title: "Binary Trees – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/data-structure-tree/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
          { title: "Trees – Visualgo", url: "https://visualgo.net/en/bst", type: "interactive", isFree: true, platform: "Visualgo", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Advanced Data Structures",
    description: "Heaps, graphs, tries, and segment trees used in competitive programming and system design.",
    estimatedHours: 14,
    topics: [
      {
        title: "Heaps & Priority Queues",
        description: "Min/max heaps, heap operations, heapsort, and the top-K pattern.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Trees & Binary Search Trees"],
        resources: [
          { title: "Heap – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/heap/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
          { title: "Heap Data Structure – Visualgo", url: "https://visualgo.net/en/heap", type: "interactive", isFree: true, platform: "Visualgo", qualityScore: 9 },
        ],
      },
      {
        title: "Graphs",
        description: "Adjacency list/matrix, BFS, DFS, topological sort, union-find, Dijkstra, and Bellman-Ford.",
        estimatedHours: 5,
        difficulty: "hard",
        prerequisites: ["Stacks & Queues", "Hash Tables"],
        resources: [
          { title: "Graph – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/graph/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
          { title: "Graphs – William Fiset (YouTube)", url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
        ],
      },
      {
        title: "Tries (Prefix Trees)",
        description: "Insert, search, and startsWith operations. Use cases: autocomplete and spell-check.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Trees & Binary Search Trees"],
        resources: [
          { title: "Trie – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/trie/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
        ],
      },
      {
        title: "Segment Trees & Fenwick Trees",
        description: "Range query and point update problems in O(log n) with segment trees and BITs.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Heaps & Priority Queues"],
        resources: [
          { title: "Segment Tree – CP-Algorithms", url: "https://cp-algorithms.com/data_structures/segment_tree.html", type: "article", isFree: true, platform: "CP-Algorithms", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Algorithm Design Techniques",
    description: "Core algorithmic paradigms: recursion, divide-and-conquer, dynamic programming, and greedy.",
    estimatedHours: 18,
    topics: [
      {
        title: "Recursion & Backtracking",
        description: "Recursive thinking, call-stack visualization, and backtracking for permutations, combinations, and constraint problems.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Arrays & Strings"],
        resources: [
          { title: "Recursion – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/recursion-i/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
          { title: "Backtracking – NeetCode", url: "https://neetcode.io/roadmap", type: "interactive", isFree: true, platform: "NeetCode", qualityScore: 10 },
        ],
      },
      {
        title: "Sorting & Searching Algorithms",
        description: "Merge sort, quick sort, binary search and its variants, and the master theorem.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Recursion & Backtracking"],
        resources: [
          { title: "Sorting Algorithms – Visualgo", url: "https://visualgo.net/en/sorting", type: "interactive", isFree: true, platform: "Visualgo", qualityScore: 9 },
          { title: "Binary Search – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/binary-search/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
        ],
      },
      {
        title: "Dynamic Programming",
        description: "Memoization vs tabulation, classic patterns: Fibonacci, knapsack, LCS, coin change, and interval DP.",
        estimatedHours: 6,
        difficulty: "hard",
        prerequisites: ["Recursion & Backtracking"],
        resources: [
          { title: "Dynamic Programming – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/dynamic-programming/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
          { title: "DP for Beginners – freeCodeCamp", url: "https://www.youtube.com/watch?v=oBt53YbR9Kk", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
        ],
      },
      {
        title: "Greedy Algorithms",
        description: "Activity selection, interval scheduling, Huffman coding, and proving greedy correctness.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Sorting & Searching Algorithms"],
        resources: [
          { title: "Greedy Algorithms – GeeksForGeeks", url: "https://www.geeksforgeeks.org/greedy-algorithms/", type: "article", isFree: true, platform: "GeeksForGeeks", qualityScore: 8 },
          { title: "Introduction to Algorithms (CLRS) – Free MIT Lectures", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", type: "course", isFree: true, platform: "MIT OpenCourseWare", qualityScore: 10 },
        ],
      },
    ],
  },
  {
    title: "Coding Interview Mastery",
    description: "Systematic problem-solving patterns and interview strategies to crack FAANG-level interviews.",
    estimatedHours: 12,
    topics: [
      {
        title: "Pattern Recognition: Sliding Window & Two Pointers",
        description: "Identify and apply fixed/variable sliding window and two-pointer patterns across 20+ problems.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Sorting & Searching Algorithms"],
        resources: [
          { title: "NeetCode 150 Roadmap", url: "https://neetcode.io/roadmap", type: "interactive", isFree: true, platform: "NeetCode", qualityScore: 10 },
          { title: "Sliding Window – LeetCode Explore", url: "https://leetcode.com/explore/learn/card/array-and-string/205/array-two-pointer-technique/", type: "interactive", isFree: true, platform: "LeetCode", qualityScore: 9 },
        ],
      },
      {
        title: "Interview Problem Patterns (NeetCode 150)",
        description: "Work through all 14 NeetCode patterns: arrays, binary, intervals, math, matrix, and advanced graph.",
        estimatedHours: 6,
        difficulty: "hard",
        prerequisites: ["Dynamic Programming", "Graphs"],
        resources: [
          { title: "NeetCode 150", url: "https://neetcode.io/practice", type: "interactive", isFree: true, platform: "NeetCode", qualityScore: 10 },
          { title: "Grind 75 – Tech Interview Handbook", url: "https://www.techinterviewhandbook.org/grind75", type: "interactive", isFree: true, platform: "Tech Interview Handbook", qualityScore: 9 },
        ],
      },
      {
        title: "Big-O Analysis & Complexity",
        description: "Calculate time and space complexity for any algorithm. Amortized analysis and recurrence relations.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Recursion & Backtracking"],
        resources: [
          { title: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/", type: "article", isFree: true, platform: "bigocheatsheet.com", qualityScore: 9 },
          { title: "Algorithms – Abdul Bari (YouTube)", url: "https://www.youtube.com/c/AbdulBari", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 10: Cybersecurity & Ethical Hacking
// ─────────────────────────────────────────────────────────────────────────────

const cybersecurityPhases: PhaseInsert[] = [
  {
    title: "Security Foundations",
    description: "Understand the attacker mindset, networking, and the core security concepts every professional needs.",
    estimatedHours: 10,
    topics: [
      {
        title: "Networking for Security",
        description: "TCP/IP stack, Wireshark packet analysis, OSI model, common protocols (HTTP, DNS, FTP, SSH) and how they can be abused.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "Networking Fundamentals – Professor Messer", url: "https://www.professormesser.com/network-plus/n10-008/n10-008-video/n10-008-training-course/", type: "video", isFree: true, platform: "Professor Messer", qualityScore: 9 },
          { title: "Wireshark – Official Docs", url: "https://www.wireshark.org/docs/wsug_html_chunked/", type: "documentation", isFree: true, platform: "Wireshark", qualityScore: 9 },
        ],
      },
      {
        title: "Linux for Hackers",
        description: "Kali Linux setup, file permissions, bash scripting, process management, and networking tools (nmap, netcat, curl).",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Networking for Security"],
        resources: [
          { title: "Linux Basics for Hackers – Free Book", url: "https://www.hackers-arise.com/linux-basics", type: "book", isFree: true, platform: "Hackers-Arise", qualityScore: 8 },
          { title: "OverTheWire: Bandit", url: "https://overthewire.org/wargames/bandit/", type: "interactive", isFree: true, platform: "OverTheWire", qualityScore: 10 },
        ],
      },
      {
        title: "Cryptography Essentials",
        description: "Symmetric vs asymmetric encryption, hashing, digital signatures, TLS/SSL, and PKI infrastructure.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Networking for Security"],
        resources: [
          { title: "Cryptography I – Coursera (Stanford)", url: "https://www.coursera.org/learn/crypto", type: "course", isFree: false, platform: "Coursera", qualityScore: 10 },
          { title: "Crypto 101 – Free Book", url: "https://www.crypto101.io/", type: "book", isFree: true, platform: "crypto101.io", qualityScore: 9 },
        ],
      },
      {
        title: "Security Concepts: CIA Triad & Threat Modeling",
        description: "Confidentiality, Integrity, Availability, STRIDE threat modeling, and risk assessment frameworks (NIST, ISO 27001).",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: ["Cryptography Essentials"],
        resources: [
          { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework", type: "documentation", isFree: true, platform: "NIST", qualityScore: 9 },
          { title: "Threat Modeling – OWASP", url: "https://owasp.org/www-community/Threat_Modeling", type: "documentation", isFree: true, platform: "OWASP", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Web Application Security",
    description: "Find and exploit the most common web vulnerabilities from the OWASP Top 10.",
    estimatedHours: 14,
    topics: [
      {
        title: "OWASP Top 10 Vulnerabilities",
        description: "Injection, broken auth, XSS, IDOR, security misconfiguration, and cryptographic failures — understand and exploit each.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Security Concepts: CIA Triad & Threat Modeling"],
        resources: [
          { title: "OWASP Top Ten – Official", url: "https://owasp.org/www-project-top-ten/", type: "documentation", isFree: true, platform: "OWASP", qualityScore: 10 },
          { title: "Web Security Academy – PortSwigger", url: "https://portswigger.net/web-security", type: "interactive", isFree: true, platform: "PortSwigger", qualityScore: 10 },
        ],
      },
      {
        title: "SQL Injection",
        description: "Classic, blind, time-based, and out-of-band SQLi. Use sqlmap and manual payloads on labs.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["OWASP Top 10 Vulnerabilities"],
        resources: [
          { title: "SQL Injection Labs – PortSwigger", url: "https://portswigger.net/web-security/sql-injection", type: "interactive", isFree: true, platform: "PortSwigger", qualityScore: 10 },
          { title: "SQLI – OWASP Testing Guide", url: "https://owasp.org/www-project-web-security-testing-guide/", type: "documentation", isFree: true, platform: "OWASP", qualityScore: 9 },
        ],
      },
      {
        title: "XSS & CSRF",
        description: "Reflected, stored, and DOM-based XSS. CSRF token bypass, SameSite cookies, and Content Security Policy.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["OWASP Top 10 Vulnerabilities"],
        resources: [
          { title: "XSS Labs – PortSwigger", url: "https://portswigger.net/web-security/cross-site-scripting", type: "interactive", isFree: true, platform: "PortSwigger", qualityScore: 10 },
          { title: "CSRF – PortSwigger", url: "https://portswigger.net/web-security/csrf", type: "interactive", isFree: true, platform: "PortSwigger", qualityScore: 10 },
        ],
      },
      {
        title: "Burp Suite Professional Workflow",
        description: "Intercept requests, use Intruder for fuzzing, Repeater for manual testing, and Scanner for passive discovery.",
        estimatedHours: 5,
        difficulty: "hard",
        prerequisites: ["SQL Injection", "XSS & CSRF"],
        resources: [
          { title: "Burp Suite Community Edition – Docs", url: "https://portswigger.net/burp/documentation/desktop", type: "documentation", isFree: true, platform: "PortSwigger", qualityScore: 9 },
          { title: "Burp Suite Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=G3hpAeoZ4ek", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
    ],
  },
  {
    title: "Network Penetration Testing",
    description: "Perform reconnaissance, scanning, exploitation, and post-exploitation on network targets.",
    estimatedHours: 16,
    topics: [
      {
        title: "Reconnaissance & OSINT",
        description: "Passive recon with Shodan, theHarvester, Maltego, Google dorks, and Recon-ng.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Linux for Hackers"],
        resources: [
          { title: "OSINT Framework", url: "https://osintframework.com/", type: "interactive", isFree: true, platform: "OSINT Framework", qualityScore: 9 },
          { title: "Passive Reconnaissance – TCM Security", url: "https://www.youtube.com/watch?v=lb1eCrutH5Q", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Scanning & Enumeration",
        description: "Active scanning with Nmap (port, service, OS, script scans), Gobuster, Nikto, and banner grabbing.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Reconnaissance & OSINT"],
        resources: [
          { title: "Nmap Reference Guide", url: "https://nmap.org/book/man.html", type: "documentation", isFree: true, platform: "Nmap", qualityScore: 9 },
          { title: "Enumeration – TryHackMe", url: "https://tryhackme.com/room/furthernmap", type: "interactive", isFree: true, platform: "TryHackMe", qualityScore: 9 },
        ],
      },
      {
        title: "Exploitation with Metasploit",
        description: "Use Metasploit Framework: search exploits, configure payloads, gain shells, and manage sessions.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Scanning & Enumeration"],
        resources: [
          { title: "Metasploit Unleashed – Offensive Security", url: "https://www.offsec.com/metasploit-unleashed/", type: "course", isFree: true, platform: "Offensive Security", qualityScore: 10 },
        ],
      },
      {
        title: "Post-Exploitation & Privilege Escalation",
        description: "Maintain access, lateral movement, credential dumping, and Linux/Windows privilege escalation techniques.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Exploitation with Metasploit"],
        resources: [
          { title: "Linux Privilege Escalation – TCM Security", url: "https://www.youtube.com/watch?v=ZTdf1SD4S2I", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
          { title: "GTFOBins", url: "https://gtfobins.github.io/", type: "interactive", isFree: true, platform: "GTFOBins", qualityScore: 9 },
        ],
      },
      {
        title: "CTFs & Practice Labs",
        description: "Apply skills on HackTheBox and TryHackMe machines. Work through beginner to intermediate boxes.",
        estimatedHours: 2,
        difficulty: "hard",
        prerequisites: ["Post-Exploitation & Privilege Escalation"],
        resources: [
          { title: "HackTheBox – Starting Point", url: "https://www.hackthebox.com/hacker/startingpoint", type: "interactive", isFree: true, platform: "HackTheBox", qualityScore: 10 },
          { title: "TryHackMe – Complete Beginner Path", url: "https://tryhackme.com/path/outline/complete-beginner", type: "interactive", isFree: true, platform: "TryHackMe", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Bug Bounty & Certifications",
    description: "Earn money finding vulnerabilities and validate your skills with industry certifications.",
    estimatedHours: 10,
    topics: [
      {
        title: "Bug Bounty Methodology",
        description: "Scope reading, recon automation, chaining vulnerabilities, writing impactful reports, and triaging duplicates.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Burp Suite Professional Workflow", "CTFs & Practice Labs"],
        resources: [
          { title: "HackerOne Hacktivity", url: "https://hackerone.com/hacktivity", type: "interactive", isFree: true, platform: "HackerOne", qualityScore: 9 },
          { title: "Bug Bounty Bootcamp – Vickie Li (Book)", url: "https://www.amazon.com/Bug-Bounty-Bootcamp-Reporting-Vulnerabilities/dp/1718501544", type: "book", isFree: false, platform: "No Starch Press", qualityScore: 9 },
        ],
      },
      {
        title: "CEH / eJPT / OSCP Preparation",
        description: "Study guides and practice for the eJPT (beginner), CEH (intermediate), and OSCP (advanced) certifications.",
        estimatedHours: 6,
        difficulty: "hard",
        prerequisites: ["Post-Exploitation & Privilege Escalation"],
        resources: [
          { title: "eJPT Study Guide – INE", url: "https://my.ine.com/CyberSecurity/courses/30a0d212/penetration-testing-student", type: "course", isFree: true, platform: "INE", qualityScore: 9 },
          { title: "OSCP Preparation Guide – TJ Null", url: "https://www.netsecfocus.com/oscp/2021/05/06/The_Journey_to_Try_Harder-_TJnull_s_Preparation_Guide_for_PEN-200_PWK_OSCP_2.0.html", type: "article", isFree: true, platform: "NetSecFocus", qualityScore: 9 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 11: Backend Engineering with Go
// ─────────────────────────────────────────────────────────────────────────────

const golangPhases: PhaseInsert[] = [
  {
    title: "Go Fundamentals",
    description: "Learn Go from scratch: syntax, types, functions, and the features that make Go unique.",
    estimatedHours: 10,
    topics: [
      {
        title: "Go Syntax & Types",
        description: "Variables, constants, basic types, zero values, type inference, and the Go toolchain (go run, go build, go fmt).",
        estimatedHours: 2,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "A Tour of Go", url: "https://go.dev/tour/welcome/1", type: "interactive", isFree: true, platform: "go.dev", qualityScore: 10 },
          { title: "Go Programming Language – freeCodeCamp", url: "https://www.youtube.com/watch?v=un6ZyFkqFKo", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Structs, Methods & Interfaces",
        description: "Define types with structs, attach methods, implement implicit interfaces, and use embedding for composition.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Go Syntax & Types"],
        resources: [
          { title: "Structs – Go by Example", url: "https://gobyexample.com/structs", type: "article", isFree: true, platform: "Go by Example", qualityScore: 9 },
          { title: "Interfaces – Effective Go", url: "https://go.dev/doc/effective_go#interfaces", type: "documentation", isFree: true, platform: "go.dev", qualityScore: 10 },
        ],
      },
      {
        title: "Error Handling",
        description: "Idiomatic error handling with error values, errors.Is/As, wrapping, and custom error types.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Structs, Methods & Interfaces"],
        resources: [
          { title: "Errors – Go Blog", url: "https://go.dev/blog/error-handling-and-go", type: "article", isFree: true, platform: "go.dev", qualityScore: 10 },
          { title: "Working with Errors in Go 1.13 – Go Blog", url: "https://go.dev/blog/go1.13-errors", type: "article", isFree: true, platform: "go.dev", qualityScore: 9 },
        ],
      },
      {
        title: "Packages, Modules & The Standard Library",
        description: "Organize code with packages, manage dependencies with go.mod, and explore net/http, encoding/json, os, and fmt.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Go Syntax & Types"],
        resources: [
          { title: "How to Write Go Code – Official", url: "https://go.dev/doc/code", type: "documentation", isFree: true, platform: "go.dev", qualityScore: 10 },
          { title: "Go Standard Library – pkg.go.dev", url: "https://pkg.go.dev/std", type: "documentation", isFree: true, platform: "go.dev", qualityScore: 10 },
        ],
      },
    ],
  },
  {
    title: "Concurrency in Go",
    description: "Goroutines and channels are Go's superpower — master them and write safe concurrent programs.",
    estimatedHours: 12,
    topics: [
      {
        title: "Goroutines",
        description: "Launch goroutines, understand the Go scheduler (M:N threading), and manage goroutine lifecycles.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Packages, Modules & The Standard Library"],
        resources: [
          { title: "Goroutines – Go by Example", url: "https://gobyexample.com/goroutines", type: "article", isFree: true, platform: "Go by Example", qualityScore: 9 },
          { title: "Concurrency is not Parallelism – Rob Pike", url: "https://www.youtube.com/watch?v=oV9rvDllKEg", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
        ],
      },
      {
        title: "Channels & Select",
        description: "Buffered/unbuffered channels, directional channels, select for multiplexing, and channel-based pipelines.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Goroutines"],
        resources: [
          { title: "Channels – Go by Example", url: "https://gobyexample.com/channels", type: "article", isFree: true, platform: "Go by Example", qualityScore: 9 },
        ],
      },
      {
        title: "Sync Package: Mutex, WaitGroup & Once",
        description: "Protect shared state with sync.Mutex, coordinate goroutine completion with WaitGroup, and use sync.Once for singletons.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Channels & Select"],
        resources: [
          { title: "sync package – pkg.go.dev", url: "https://pkg.go.dev/sync", type: "documentation", isFree: true, platform: "go.dev", qualityScore: 9 },
          { title: "Go Concurrency Patterns – Google I/O", url: "https://www.youtube.com/watch?v=f6kdp27TYZs", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
        ],
      },
      {
        title: "Context Package",
        description: "Propagate cancellation, deadlines, and request-scoped values across goroutines and API boundaries.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Channels & Select"],
        resources: [
          { title: "The Go Blog: Contexts", url: "https://go.dev/blog/context", type: "article", isFree: true, platform: "go.dev", qualityScore: 10 },
        ],
      },
    ],
  },
  {
    title: "Building REST APIs with Go",
    description: "Build production-grade HTTP APIs with Chi or Gin, connect to PostgreSQL, and add auth.",
    estimatedHours: 16,
    topics: [
      {
        title: "HTTP Servers with net/http & Chi",
        description: "Build handlers, middleware chains, routing with Chi, request parsing, and JSON responses.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Error Handling"],
        resources: [
          { title: "Chi Router – GitHub", url: "https://github.com/go-chi/chi", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
          { title: "Building a REST API with Go – Alex Edwards", url: "https://www.alexedwards.net/blog/making-a-restful-json-api", type: "article", isFree: true, platform: "alexedwards.net", qualityScore: 9 },
        ],
      },
      {
        title: "Database Access with pgx & sqlc",
        description: "Query PostgreSQL with pgx, generate type-safe Go code from SQL with sqlc, and run migrations with goose.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["HTTP Servers with net/http & Chi"],
        resources: [
          { title: "sqlc Documentation", url: "https://docs.sqlc.dev/en/latest/", type: "documentation", isFree: true, platform: "sqlc", qualityScore: 9 },
          { title: "pgx – GitHub", url: "https://github.com/jackc/pgx", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
        ],
      },
      {
        title: "Authentication & JWT in Go",
        description: "Issue and verify JWT tokens with golang-jwt, bcrypt passwords, and build middleware for protected routes.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Database Access with pgx & sqlc"],
        resources: [
          { title: "golang-jwt – GitHub", url: "https://github.com/golang-jwt/jwt", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
          { title: "Building a REST API with Go – Boot.dev", url: "https://www.boot.dev/courses/build-a-blog-aggregator-golang", type: "course", isFree: false, platform: "Boot.dev", qualityScore: 9 },
        ],
      },
      {
        title: "Testing in Go",
        description: "Write table-driven unit tests with testing package, HTTP handler tests with httptest, and use testcontainers for integration tests.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["HTTP Servers with net/http & Chi"],
        resources: [
          { title: "Testing – Go Docs", url: "https://pkg.go.dev/testing", type: "documentation", isFree: true, platform: "go.dev", qualityScore: 10 },
          { title: "Testify – GitHub", url: "https://github.com/stretchr/testify", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Advanced Go & Production",
    description: "gRPC, performance profiling, CLI tools, and deploying Go services to production.",
    estimatedHours: 12,
    topics: [
      {
        title: "gRPC Services with Protocol Buffers",
        description: "Define services in .proto files, generate Go code with protoc, implement unary and streaming RPCs.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Context Package"],
        resources: [
          { title: "gRPC – Go Quickstart", url: "https://grpc.io/docs/languages/go/quickstart/", type: "documentation", isFree: true, platform: "gRPC", qualityScore: 9 },
          { title: "Protocol Buffers – Google Docs", url: "https://protobuf.dev/getting-started/gotutorial/", type: "documentation", isFree: true, platform: "Google", qualityScore: 9 },
        ],
      },
      {
        title: "Performance Profiling with pprof",
        description: "Profile CPU and memory usage, visualize flame graphs, and benchmark with the testing/benchmark API.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Testing in Go"],
        resources: [
          { title: "Profiling Go Programs – Go Blog", url: "https://go.dev/blog/pprof", type: "article", isFree: true, platform: "go.dev", qualityScore: 10 },
        ],
      },
      {
        title: "CLI Tools with Cobra",
        description: "Build powerful command-line tools with Cobra: subcommands, flags, completion, and manpage generation.",
        estimatedHours: 2,
        difficulty: "medium",
        prerequisites: ["Packages, Modules & The Standard Library"],
        resources: [
          { title: "Cobra – GitHub", url: "https://github.com/spf13/cobra", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
        ],
      },
      {
        title: "Containerizing & Deploying Go Services",
        description: "Build minimal scratch/alpine Docker images, set up health checks, and deploy to Kubernetes or Fly.io.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Testing in Go"],
        resources: [
          { title: "Deploying Go to Fly.io", url: "https://fly.io/docs/languages-and-frameworks/golang/", type: "documentation", isFree: true, platform: "Fly.io", qualityScore: 9 },
          { title: "Distroless Docker Images for Go", url: "https://github.com/GoogleContainerTools/distroless", type: "documentation", isFree: true, platform: "GitHub", qualityScore: 9 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 12: Deep Learning & Neural Networks with PyTorch
// ─────────────────────────────────────────────────────────────────────────────

const deeplearningPhases: PhaseInsert[] = [
  {
    title: "Math & Python Foundations",
    description: "The mathematical building blocks and Python tools you need before neural networks make sense.",
    estimatedHours: 12,
    topics: [
      {
        title: "Linear Algebra for Deep Learning",
        description: "Vectors, matrices, dot products, matrix multiplication, eigenvalues, and the intuition behind them.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: [],
        resources: [
          { title: "Essence of Linear Algebra – 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
          { title: "Linear Algebra – Khan Academy", url: "https://www.khanacademy.org/math/linear-algebra", type: "interactive", isFree: true, platform: "Khan Academy", qualityScore: 9 },
        ],
      },
      {
        title: "Calculus & Gradient Descent",
        description: "Derivatives, the chain rule, partial derivatives, gradients, and how backpropagation actually works.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Linear Algebra for Deep Learning"],
        resources: [
          { title: "Essence of Calculus – 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
          { title: "Gradient Descent – Explained", url: "https://www.youtube.com/watch?v=sDv4f4s2SB8", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Statistics & Probability for ML",
        description: "Probability distributions, Bayes theorem, MLE, bias-variance tradeoff, and statistical hypothesis testing.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Calculus & Gradient Descent"],
        resources: [
          { title: "Statistics and Probability – Khan Academy", url: "https://www.khanacademy.org/math/statistics-probability", type: "interactive", isFree: true, platform: "Khan Academy", qualityScore: 9 },
          { title: "Probability for ML – Andrej Karpathy", url: "https://www.youtube.com/watch?v=PaCmpygFfXo", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
        ],
      },
      {
        title: "NumPy & Python for Deep Learning",
        description: "Vectorized operations, broadcasting, matrix ops with NumPy, and Matplotlib for visualizing training dynamics.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: [],
        resources: [
          { title: "NumPy Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html", type: "documentation", isFree: true, platform: "NumPy", qualityScore: 9 },
          { title: "Python NumPy Tutorial – Stanford CS231n", url: "https://cs231n.github.io/python-numpy-tutorial/", type: "article", isFree: true, platform: "Stanford", qualityScore: 10 },
        ],
      },
    ],
  },
  {
    title: "Neural Networks with PyTorch",
    description: "Build, train, and debug neural networks from scratch using PyTorch.",
    estimatedHours: 16,
    topics: [
      {
        title: "PyTorch Tensors & Autograd",
        description: "Create and manipulate tensors, understand computation graphs, and use autograd for automatic differentiation.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["NumPy & Python for Deep Learning"],
        resources: [
          { title: "PyTorch Quickstart – Official Tutorial", url: "https://pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html", type: "documentation", isFree: true, platform: "PyTorch", qualityScore: 10 },
          { title: "PyTorch Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=V_xro1bcAuA", type: "video", isFree: true, platform: "YouTube", qualityScore: 9 },
        ],
      },
      {
        title: "Building Neural Networks with nn.Module",
        description: "Define layers with nn.Module, activation functions (ReLU, Sigmoid, Softmax), loss functions, and optimizers (Adam, SGD).",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["PyTorch Tensors & Autograd"],
        resources: [
          { title: "Build the Neural Network – PyTorch Tutorials", url: "https://pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html", type: "documentation", isFree: true, platform: "PyTorch", qualityScore: 10 },
          { title: "Andrej Karpathy: Neural Networks Zero to Hero", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
        ],
      },
      {
        title: "Training Loop & Regularization",
        description: "Write the train/eval loop, implement batch normalization, dropout, L2 regularization, and learning rate schedulers.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Building Neural Networks with nn.Module"],
        resources: [
          { title: "Training a Classifier – PyTorch Tutorial", url: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html", type: "documentation", isFree: true, platform: "PyTorch", qualityScore: 9 },
        ],
      },
      {
        title: "Debugging & Experiment Tracking with W&B",
        description: "Use Weights & Biases for loss curves, gradient visualization, hyperparameter sweeps, and model versioning.",
        estimatedHours: 5,
        difficulty: "medium",
        prerequisites: ["Training Loop & Regularization"],
        resources: [
          { title: "Weights & Biases Quickstart", url: "https://docs.wandb.ai/quickstart", type: "documentation", isFree: true, platform: "W&B", qualityScore: 9 },
          { title: "PyTorch W&B Integration Tutorial", url: "https://www.youtube.com/watch?v=G7GH0SeNBMA", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
    ],
  },
  {
    title: "Computer Vision",
    description: "Apply CNNs to image classification, object detection, and segmentation tasks.",
    estimatedHours: 14,
    topics: [
      {
        title: "Convolutional Neural Networks (CNNs)",
        description: "Convolution operation, pooling, receptive fields, and classic architectures: LeNet, AlexNet, VGG, ResNet.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Building Neural Networks with nn.Module"],
        resources: [
          { title: "CNN Explainer – Interactive", url: "https://poloclub.github.io/cnn-explainer/", type: "interactive", isFree: true, platform: "Polo Club", qualityScore: 9 },
          { title: "CS231n: CNNs for Visual Recognition – Stanford", url: "https://cs231n.github.io/", type: "course", isFree: true, platform: "Stanford", qualityScore: 10 },
        ],
      },
      {
        title: "Transfer Learning & Fine-tuning",
        description: "Use pretrained models (ResNet, EfficientNet, ViT) from torchvision and fine-tune on custom datasets.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Convolutional Neural Networks (CNNs)"],
        resources: [
          { title: "Transfer Learning – PyTorch Tutorial", url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html", type: "documentation", isFree: true, platform: "PyTorch", qualityScore: 9 },
        ],
      },
      {
        title: "Object Detection: YOLO & Faster R-CNN",
        description: "Understand anchor boxes, IoU, NMS, and train YOLOv8 on custom datasets with Ultralytics.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Transfer Learning & Fine-tuning"],
        resources: [
          { title: "YOLOv8 Documentation – Ultralytics", url: "https://docs.ultralytics.com/", type: "documentation", isFree: true, platform: "Ultralytics", qualityScore: 9 },
          { title: "Object Detection with YOLO – freeCodeCamp", url: "https://www.youtube.com/watch?v=ag3DLKsl2vk", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Image Segmentation",
        description: "Semantic segmentation with U-Net and instance segmentation with Mask R-CNN for medical and autonomous driving datasets.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Object Detection: YOLO & Faster R-CNN"],
        resources: [
          { title: "U-Net: Convolutional Networks for Biomedical Image Segmentation", url: "https://arxiv.org/abs/1505.04597", type: "article", isFree: true, platform: "arXiv", qualityScore: 10 },
        ],
      },
    ],
  },
  {
    title: "NLP, Transformers & MLOps",
    description: "Natural language processing with Hugging Face transformers and deploying models to production.",
    estimatedHours: 14,
    topics: [
      {
        title: "NLP Fundamentals & Tokenization",
        description: "Text preprocessing, BPE and WordPiece tokenization, embeddings (Word2Vec, GloVe), and sequence classification.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Training Loop & Regularization"],
        resources: [
          { title: "Hugging Face NLP Course – Chapter 1-4", url: "https://huggingface.co/learn/nlp-course/chapter1/1", type: "course", isFree: true, platform: "Hugging Face", qualityScore: 10 },
        ],
      },
      {
        title: "Transformers & BERT/GPT Architecture",
        description: "Self-attention, positional encoding, encoder-decoder architecture, and pre-training objectives (MLM, CLM).",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["NLP Fundamentals & Tokenization"],
        resources: [
          { title: "Illustrated BERT – Jay Alammar", url: "https://jalammar.github.io/illustrated-bert/", type: "article", isFree: true, platform: "jalammar.github.io", qualityScore: 10 },
          { title: "GPT from Scratch – Andrej Karpathy", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", type: "video", isFree: true, platform: "YouTube", qualityScore: 10 },
        ],
      },
      {
        title: "Fine-tuning with Hugging Face Trainer",
        description: "Fine-tune BERT/GPT-2 on classification, NER, and QA tasks using the Hugging Face Trainer API.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Transformers & BERT/GPT Architecture"],
        resources: [
          { title: "Fine-tune a Pretrained Model – Hugging Face", url: "https://huggingface.co/docs/transformers/training", type: "documentation", isFree: true, platform: "Hugging Face", qualityScore: 10 },
        ],
      },
      {
        title: "MLOps: Model Serving & Monitoring",
        description: "Serve PyTorch models with TorchServe or FastAPI, version with MLflow, monitor drift, and automate retraining.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Fine-tuning with Hugging Face Trainer"],
        resources: [
          { title: "MLflow Tracking – Official Docs", url: "https://mlflow.org/docs/latest/tracking.html", type: "documentation", isFree: true, platform: "MLflow", qualityScore: 9 },
          { title: "Serving ML Models with TorchServe", url: "https://pytorch.org/serve/", type: "documentation", isFree: true, platform: "PyTorch", qualityScore: 9 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap 13: Data Engineering
// ─────────────────────────────────────────────────────────────────────────────

const dataengineeringPhases: PhaseInsert[] = [
  {
    title: "SQL & Data Warehousing",
    description: "Master the analytical SQL and warehouse concepts that data engineers use every day.",
    estimatedHours: 12,
    topics: [
      {
        title: "Advanced SQL for Analytics",
        description: "Window functions (RANK, LAG, LEAD, NTILE), CTEs, recursive queries, and query optimization with EXPLAIN.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: [],
        resources: [
          { title: "Mode SQL Tutorial – Advanced", url: "https://mode.com/sql-tutorial/sql-window-functions/", type: "article", isFree: true, platform: "Mode Analytics", qualityScore: 9 },
          { title: "SQLZoo – Window Functions", url: "https://sqlzoo.net/wiki/Window_functions", type: "interactive", isFree: true, platform: "SQLZoo", qualityScore: 8 },
        ],
      },
      {
        title: "Data Warehouse Concepts",
        description: "Star vs snowflake schema, fact and dimension tables, slowly changing dimensions, OLTP vs OLAP.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Advanced SQL for Analytics"],
        resources: [
          { title: "Data Warehousing Concepts – AWS", url: "https://aws.amazon.com/what-is/data-warehouse/", type: "article", isFree: true, platform: "AWS", qualityScore: 8 },
          { title: "Fundamentals of Data Engineering – Joe Reis (Book)", url: "https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/", type: "book", isFree: false, platform: "O'Reilly", qualityScore: 10 },
        ],
      },
      {
        title: "BigQuery & Snowflake",
        description: "Run analytical queries on petabytes with BigQuery (free sandbox) and understand Snowflake virtual warehouses.",
        estimatedHours: 5,
        difficulty: "medium",
        prerequisites: ["Data Warehouse Concepts"],
        resources: [
          { title: "BigQuery Quickstart – Google Cloud", url: "https://cloud.google.com/bigquery/docs/quickstarts/query-public-dataset-console", type: "documentation", isFree: true, platform: "Google Cloud", qualityScore: 9 },
          { title: "Snowflake Free Trial", url: "https://docs.snowflake.com/en/user-guide/getting-started-tutorial", type: "documentation", isFree: true, platform: "Snowflake", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Data Transformation with dbt",
    description: "Transform data in your warehouse using SQL with dbt (data build tool) and software engineering best practices.",
    estimatedHours: 12,
    topics: [
      {
        title: "dbt Fundamentals",
        description: "Models, materializations, sources, seeds, and running your first dbt project locally.",
        estimatedHours: 3,
        difficulty: "easy",
        prerequisites: ["Advanced SQL for Analytics"],
        resources: [
          { title: "dbt Learn: Fundamentals – Official Free Course", url: "https://learn.getdbt.com/courses/dbt-fundamentals", type: "course", isFree: true, platform: "dbt Labs", qualityScore: 10 },
          { title: "dbt Documentation", url: "https://docs.getdbt.com/docs/introduction", type: "documentation", isFree: true, platform: "dbt Labs", qualityScore: 9 },
        ],
      },
      {
        title: "dbt Testing & Documentation",
        description: "Write schema tests (unique, not_null, accepted_values, relationships), generate docs, and use dbt-expectations.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["dbt Fundamentals"],
        resources: [
          { title: "Testing – dbt Docs", url: "https://docs.getdbt.com/docs/build/tests", type: "documentation", isFree: true, platform: "dbt Labs", qualityScore: 9 },
        ],
      },
      {
        title: "dbt Advanced: Macros, Hooks & Packages",
        description: "Write Jinja macros for DRY SQL, use hooks for pre/post operations, and install packages from dbt Hub.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["dbt Testing & Documentation"],
        resources: [
          { title: "Jinja in dbt – dbt Docs", url: "https://docs.getdbt.com/docs/build/jinja-macros", type: "documentation", isFree: true, platform: "dbt Labs", qualityScore: 9 },
          { title: "dbt Hub (Packages)", url: "https://hub.getdbt.com/", type: "documentation", isFree: true, platform: "dbt Labs", qualityScore: 9 },
        ],
      },
      {
        title: "Analytics Engineering Project",
        description: "Build an end-to-end analytics engineering project: ingest public data, model with dbt, and visualize in Metabase.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["BigQuery & Snowflake", "dbt Advanced: Macros, Hooks & Packages"],
        resources: [
          { title: "NYC Taxi Data Analytics Project – GitHub", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp", type: "interactive", isFree: true, platform: "GitHub", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Batch Processing with Apache Spark",
    description: "Process data at scale with Apache Spark using PySpark for distributed transformations.",
    estimatedHours: 14,
    topics: [
      {
        title: "Spark Architecture & RDDs",
        description: "Driver/executor model, DAG execution, RDDs, lazy evaluation, and actions vs transformations.",
        estimatedHours: 3,
        difficulty: "medium",
        prerequisites: ["Data Warehouse Concepts"],
        resources: [
          { title: "Spark Overview – Apache Docs", url: "https://spark.apache.org/docs/latest/index.html", type: "documentation", isFree: true, platform: "Apache Spark", qualityScore: 9 },
          { title: "Spark Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=_C8kWso4ne4", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "PySpark DataFrames & Spark SQL",
        description: "Read/write Parquet, CSV, and Delta files; run Spark SQL queries; use Window functions at scale.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["Spark Architecture & RDDs"],
        resources: [
          { title: "PySpark DataFrame Tutorial – Databricks", url: "https://docs.databricks.com/pyspark/index.html", type: "documentation", isFree: true, platform: "Databricks", qualityScore: 9 },
          { title: "PySpark Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=_C8kWso4ne4", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Delta Lake & Lakehouse Architecture",
        description: "ACID transactions on data lakes, time travel, schema evolution, and the medallion architecture (Bronze/Silver/Gold).",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["PySpark DataFrames & Spark SQL"],
        resources: [
          { title: "Delta Lake Documentation", url: "https://docs.delta.io/latest/index.html", type: "documentation", isFree: true, platform: "Delta Lake", qualityScore: 9 },
          { title: "Lakehouse Architecture – Databricks Blog", url: "https://www.databricks.com/blog/2020/01/30/what-is-a-data-lakehouse.html", type: "article", isFree: true, platform: "Databricks", qualityScore: 9 },
        ],
      },
      {
        title: "Spark Optimization",
        description: "Understand shuffles, broadcast joins, partitioning strategies, caching, and reading Spark UI for performance tuning.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Delta Lake & Lakehouse Architecture"],
        resources: [
          { title: "Optimizing Apache Spark – Databricks", url: "https://www.databricks.com/glossary/spark-optimization", type: "article", isFree: true, platform: "Databricks", qualityScore: 9 },
        ],
      },
    ],
  },
  {
    title: "Pipeline Orchestration & Streaming",
    description: "Schedule and monitor batch pipelines with Airflow and process real-time streams with Kafka.",
    estimatedHours: 14,
    topics: [
      {
        title: "Apache Airflow",
        description: "Define DAGs with Python operators, set up task dependencies, use sensors, XComs, and variables. Deploy with Docker.",
        estimatedHours: 4,
        difficulty: "medium",
        prerequisites: ["dbt Fundamentals"],
        resources: [
          { title: "Airflow Tutorial – Official Docs", url: "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html", type: "documentation", isFree: true, platform: "Apache Airflow", qualityScore: 9 },
          { title: "Apache Airflow Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=K9AnJ9_ZAXE", type: "video", isFree: true, platform: "YouTube", qualityScore: 8 },
        ],
      },
      {
        title: "Apache Kafka for Data Engineers",
        description: "Producer/consumer API, topics/partitions, consumer groups, Kafka Connect for CDC, and Schema Registry.",
        estimatedHours: 4,
        difficulty: "hard",
        prerequisites: ["Spark Architecture & RDDs"],
        resources: [
          { title: "Kafka Introduction", url: "https://kafka.apache.org/intro", type: "documentation", isFree: true, platform: "Apache Kafka", qualityScore: 9 },
          { title: "Apache Kafka Series – Udemy (Stephane Maarek)", url: "https://www.conduktor.io/kafka/kafka-fundamentals/", type: "course", isFree: true, platform: "Conduktor", qualityScore: 9 },
        ],
      },
      {
        title: "Streaming with Spark Structured Streaming",
        description: "Process Kafka streams with Spark Structured Streaming: triggers, watermarks, and output modes.",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Apache Kafka for Data Engineers", "PySpark DataFrames & Spark SQL"],
        resources: [
          { title: "Structured Streaming Programming Guide – Apache", url: "https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html", type: "documentation", isFree: true, platform: "Apache Spark", qualityScore: 10 },
        ],
      },
      {
        title: "Capstone: End-to-End Data Pipeline",
        description: "Ingest → transform (Spark/dbt) → warehouse (BigQuery) → orchestrate (Airflow) → visualize (Metabase/Grafana).",
        estimatedHours: 3,
        difficulty: "hard",
        prerequisites: ["Apache Airflow", "Streaming with Spark Structured Streaming", "Analytics Engineering Project"],
        resources: [
          { title: "Data Engineering Zoomcamp – DataTalks.Club", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp", type: "course", isFree: true, platform: "GitHub", qualityScore: 10 },
        ],
      },
    ],
  },
];

// ── Insert helper ─────────────────────────────────────────────────────────────

async function insertRoadmap(opts: {
  id: string;
  title: string;
  description: string;
  goal: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  hoursPerWeek: number;
  estimatedTotalHours: number;
  phaseData: PhaseInsert[];
}) {
  console.log(`\n  Inserting: ${opts.title}`);

  // Delete existing seed roadmap (cascades to phases → topics → resources)
  await db.delete(roadmaps).where(eq(roadmaps.id, opts.id));

  // Insert roadmap
  await db.insert(roadmaps).values({
    id: opts.id,
    userId: null,
    title: opts.title,
    description: opts.description,
    goal: opts.goal,
    skillLevel: opts.skillLevel,
    hoursPerWeek: opts.hoursPerWeek,
    estimatedTotalHours: opts.estimatedTotalHours,
    isPublic: true,
    isTemplate: true,
    metadata: { generatedAt: new Date().toISOString() },
  });

  for (let pi = 0; pi < opts.phaseData.length; pi++) {
    const p = opts.phaseData[pi];
    const phaseId = `${opts.id}-phase-${pi + 1}`;

    await db.insert(phases).values({
      id: phaseId,
      roadmapId: opts.id,
      title: p.title,
      description: p.description,
      orderIndex: pi,
      estimatedHours: p.estimatedHours,
    });

    console.log(`    Phase ${pi + 1}: ${p.title} (${p.topics.length} topics)`);

    for (let ti = 0; ti < p.topics.length; ti++) {
      const t = p.topics[ti];
      const topicId = `${phaseId}-topic-${ti + 1}`;

      await db.insert(topics).values({
        id: topicId,
        phaseId,
        title: t.title,
        description: t.description,
        orderIndex: ti,
        estimatedHours: t.estimatedHours,
        difficulty: t.difficulty,
        prerequisites: t.prerequisites,
      });

      for (const r of t.resources) {
        await db.insert(resources).values({
          topicId,
          title: r.title,
          url: r.url,
          type: r.type,
          isFree: r.isFree,
          platform: r.platform,
          qualityScore: r.qualityScore,
        });
      }
    }
  }

  const topicCount = opts.phaseData.reduce((s, p) => s + p.topics.length, 0);
  const resourceCount = opts.phaseData.reduce(
    (s, p) => s + p.topics.reduce((ts, t) => ts + t.resources.length, 0),
    0
  );
  console.log(`    ✓ ${opts.phaseData.length} phases, ${topicCount} topics, ${resourceCount} resources`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  PathForge Database Seed\n");

  await insertRoadmap({
    id: SEED_IDS.react,
    title: "Learn React from Scratch",
    description: "Go from zero JavaScript knowledge to building production-ready React applications. Covers core JS, all React hooks, routing, testing, and deployment.",
    goal: "Build production-ready React applications",
    skillLevel: "beginner",
    hoursPerWeek: 10,
    estimatedTotalHours: 40,
    phaseData: reactPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.python,
    title: "Python for Data Science",
    description: "A practical, project-driven path from Python fundamentals to deploying machine learning models. Covers NumPy, Pandas, Matplotlib, Scikit-learn, and FastAPI.",
    goal: "Become a data scientist who can build and deploy ML models",
    skillLevel: "intermediate",
    hoursPerWeek: 15,
    estimatedTotalHours: 60,
    phaseData: pythonPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.fullstack,
    title: "Full-Stack Web Development",
    description: "Everything you need to build and ship complete web applications: HTML/CSS, JavaScript, React, Node.js/Express, PostgreSQL, Docker, and CI/CD.",
    goal: "Build and deploy full-stack web applications independently",
    skillLevel: "beginner",
    hoursPerWeek: 20,
    estimatedTotalHours: 100,
    phaseData: fullstackPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.typescript,
    title: "TypeScript Mastery",
    description: "From basic type annotations to advanced generic patterns, conditional types, and type-safe APIs with Zod and tRPC. Ideal for JavaScript developers wanting type safety.",
    goal: "Write fully type-safe TypeScript applications and libraries",
    skillLevel: "intermediate",
    hoursPerWeek: 10,
    estimatedTotalHours: 34,
    phaseData: typescriptPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.devops,
    title: "DevOps & Cloud Engineering",
    description: "From Linux fundamentals to Kubernetes, CI/CD, Terraform, and cloud-native monitoring. A complete roadmap to becoming a DevOps/SRE engineer.",
    goal: "Design, automate, and operate production cloud infrastructure",
    skillLevel: "beginner",
    hoursPerWeek: 15,
    estimatedTotalHours: 72,
    phaseData: devopsPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.systemdesign,
    title: "System Design & Architecture",
    description: "Master the design of scalable distributed systems: databases, caching, message queues, microservices, and system design interview preparation.",
    goal: "Design distributed systems that handle millions of users",
    skillLevel: "intermediate",
    hoursPerWeek: 10,
    estimatedTotalHours: 50,
    phaseData: systemdesignPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.reactnative,
    title: "React Native Mobile Development",
    description: "Build cross-platform iOS and Android apps with React Native and Expo. Covers navigation, native APIs, performance, testing, and publishing to app stores.",
    goal: "Build and publish cross-platform mobile apps with React Native",
    skillLevel: "beginner",
    hoursPerWeek: 10,
    estimatedTotalHours: 40,
    phaseData: reactnativePhases,
  });

  await insertRoadmap({
    id: SEED_IDS.aiengineering,
    title: "AI & LLM Engineering",
    description: "Learn to build production AI applications: RAG pipelines, AI agents, fine-tuning, evaluation, and safety. From LLM fundamentals to deploying multi-agent systems.",
    goal: "Build production-ready AI applications powered by large language models",
    skillLevel: "intermediate",
    hoursPerWeek: 12,
    estimatedTotalHours: 50,
    phaseData: aiengineeringPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.dsa,
    title: "CS Fundamentals & Data Structures and Algorithms",
    description: "From arrays and linked lists to graphs and dynamic programming. A complete DSA roadmap to crack coding interviews at top tech companies.",
    goal: "Solve algorithmic problems confidently and pass technical coding interviews",
    skillLevel: "beginner",
    hoursPerWeek: 10,
    estimatedTotalHours: 60,
    phaseData: dsaPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.cybersecurity,
    title: "Cybersecurity & Ethical Hacking",
    description: "From networking fundamentals to penetration testing and bug bounty hunting. A hands-on path to becoming a professional ethical hacker.",
    goal: "Perform professional penetration tests and earn from bug bounty programs",
    skillLevel: "beginner",
    hoursPerWeek: 12,
    estimatedTotalHours: 50,
    phaseData: cybersecurityPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.golang,
    title: "Backend Engineering with Go",
    description: "Master Go from syntax to production: goroutines, REST APIs with Chi, PostgreSQL with sqlc, gRPC, and Docker deployment.",
    goal: "Build high-performance backend services and APIs with Go",
    skillLevel: "intermediate",
    hoursPerWeek: 10,
    estimatedTotalHours: 50,
    phaseData: golangPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.deeplearning,
    title: "Deep Learning & Neural Networks with PyTorch",
    description: "From math foundations through CNNs, transformers, and MLOps. Build, train, and deploy real computer vision and NLP models.",
    goal: "Build and deploy production deep learning models for vision and NLP",
    skillLevel: "intermediate",
    hoursPerWeek: 15,
    estimatedTotalHours: 56,
    phaseData: deeplearningPhases,
  });

  await insertRoadmap({
    id: SEED_IDS.dataengineering,
    title: "Data Engineering",
    description: "Design and build scalable data pipelines: SQL analytics, dbt, Apache Spark, Delta Lake, Kafka, and Airflow orchestration.",
    goal: "Design and operate production-grade data pipelines and lakehouse architectures",
    skillLevel: "intermediate",
    hoursPerWeek: 15,
    estimatedTotalHours: 52,
    phaseData: dataengineeringPhases,
  });

  console.log("\n✅  Seed complete! 13 public roadmaps are now in the database.");
  console.log("    Visit /explore to see them live.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
