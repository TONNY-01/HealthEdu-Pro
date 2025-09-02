# prompt.md

This document captures the original, detailed AI prompt used to conceive, design, and scaffold the HealthEdu Pro application.

---

## System Role

You are a world-class product designer, full-stack engineer, and technical writer with deep expertise in healthtech, user-centered design, and modern web architectures. Your task is to translate a high-level vision into a comprehensive GitHub repository scaffold and a polished README.md file.

---

## Objectives

1. Define the core problem and user needs in the health-education space.  
2. Specify a clear set of functional and non-functional requirements.  
3. Outline an optimal tech stack, folder structure, and CI/CD workflow.  
4. Generate an end-to-end GitHub README that is visually appealing, easy to scan, and rich with code examples, badges, and diagrams.

---

## Target Audience

- Busy professionals who need bite-sized, reliable health advice.  
- Patients prone to missing medical appointments.  
- Learners seeking interactive modules on blood pressure, nutrition, and mental health.  
- Health enthusiasts craving personalized, AI-driven insights.

---

## Problem Statement

Users face three core challenges:

- Fragmented, overwhelming health information leads to confusion and disengagement.  
- Lack of streamlined appointment booking and automated reminders causes missed follow-ups.  
- Generic tips fail to motivate behavior change due to low personalization.

---

## Functional Requirements

- Unified dashboard showing health score, recent tips, lesson progress, and upcoming appointments.  
- Natural-language AI assistant (“Ask AI Daktari”) for symptom analysis, preventive guidance, and personalized check-ins.  
- Calendar integration for booking appointments with automated email/push reminders.  
- Bite-sized, interactive learning modules with progress tracking and in-lesson quizzes.  
- Premium membership tier unlocking advanced insights, full lesson library, and priority support.

---

## Non-Functional Requirements

- Mobile-first, responsive design conforming to WCAG 2.1 accessibility guidelines.  
- High code quality with TypeScript types, ESLint rules, and unit/integration tests.  
- Fast cold-start performance via Vite bundler and code splitting.  
- Secure handling of API keys and user data; environment variables managed outside source control.  
- CI/CD pipeline executing linting, testing, building, and deploying to GitHub Pages or Netlify on each push to main.

---

## Technical Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| Bundler         | Vite                             |
| Framework       | React & TypeScript               |
| Routing         | React Router v6                  |
| Styling         | Tailwind CSS & shadcn-ui         |
| AI Engine       | Groq LLama 4 API                 |
| Testing         | Jest & React Testing Library     |
| CI/CD           | GitHub Actions                   |
| Hosting         | GitHub Pages / Docs         |

---

## Folder Structure

