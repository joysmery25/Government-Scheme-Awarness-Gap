# 🏛️ GovScheme Portal – Government Scheme Awareness Gap

A web-based platform developed as a **Community Service Project** to reduce the awareness gap about Central Government and Andhra Pradesh State Government welfare schemes.

The platform allows citizens to easily explore government schemes, understand their benefits and eligibility requirements, view required documents, access official websites, and find schemes they may be eligible for through an interactive Eligibility Checker.

---

## 📌 About the Project

Many people are unaware of the various government welfare schemes available to them or do not know whether they are eligible for a particular scheme.

The **GovScheme Portal** aims to solve this problem by providing government scheme information in one easy-to-use platform.

Instead of searching through multiple government websites, users can:

- 🔎 Browse available government schemes
- 🇮🇳 View Central Government schemes
- 🌾 View Andhra Pradesh State Government schemes
- 📄 Check scheme details and required documents
- 🌐 Access the official website of each scheme
- ✅ Check eligibility based on personal details
- 👤 Create and manage a user account
- 🔐 Login securely as a user or administrator

---

## 🎯 Objectives

The main objectives of the project are:

1. **Increase awareness** about government welfare schemes.
2. Provide government scheme information in a **single platform**.
3. Help users understand **eligibility criteria** easily.
4. Display the **documents required** to apply for schemes.
5. Provide links to the **official government websites**.
6. Help users identify schemes based on their personal information.
7. Provide an **admin interface** for managing scheme-related information.

---

## ✨ Features

### 🏠 Home Page

The home page provides an overview of the portal and allows users to navigate to different sections such as:

- All Schemes
- Eligibility Checker
- About
- Contact
- User Login
- Registration
- Admin Login

---

### 📚 All Schemes

The **All Schemes** section displays government schemes available on the portal.

Schemes are categorized into:

- 🇮🇳 Central Government Schemes
- 🏛️ Andhra Pradesh State Government Schemes

Users can select a scheme to view complete information about it.

---

### 📋 Scheme Details

Each scheme has a dedicated details page containing important information such as:

- Scheme Name
- Government / Department
- Scheme Category
- Description
- Benefits
- Eligibility Criteria
- Age Criteria
- Income Criteria
- Required Documents
- Other Eligibility Conditions
- Official Website
- Application-related information

This helps users understand a scheme before proceeding to the official government portal.

---

### ✅ Eligibility Checker

The **Eligibility Checker** is one of the main features of the project.

Users can enter information such as:

- Age
- Gender
- State
- Occupation
- Education
- Income
- Special Categories
- Other relevant details

The system processes the user's information and identifies schemes whose eligibility conditions match the entered details.

For example:

> A user selects **Farmer** as their occupation.  
> The system checks the available scheme eligibility criteria and displays matching schemes such as **PM-KISAN** and relevant Andhra Pradesh schemes.

This allows users to discover schemes that they may otherwise not know about.

---

### 👤 User Authentication

The portal provides user authentication functionality.

Users can:

- Register an account
- Login
- Access their dashboard
- View their profile
- Manage bookmarks
- Logout

---

### 🔐 Admin Login

An administrator can access a separate admin section of the portal.

The admin functionality is intended to help manage government scheme information and maintain the scheme database.

---

### 🔖 Bookmark Schemes

Users can save schemes for later reference using the bookmark functionality.

This allows users to easily return to schemes they are interested in.

---

## 🛠️ Technology Stack

### Frontend

- **React.js**
- HTML
- CSS
- JavaScript

### Backend

- **Node.js**
- **Express.js**

### Database

- **MongoDB**

### Development Tools

- Visual Studio Code
- Git
- GitHub
- MongoDB / MongoDB Atlas

---

## 🏗️ System Architecture

The project follows a typical MERN stack architecture:

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      (Client)       │
                    └──────────┬──────────┘
                               │
                         HTTP Requests
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express + Node.js │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │      Database       │
                    └─────────────────────┘