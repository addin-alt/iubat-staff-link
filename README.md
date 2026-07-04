<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=700&size=25&duration=2800&pause=900&color=006F3C&center=true&vCenter=true&width=850&lines=Professional+IUBAT+Faculty+%26+Employee+Directory;Dynamic+Search+%7C+Staff+Photos+%7C+Official+Notice+Feed;Built+with+React%2C+Vite%2C+GitHub+and+Vercel" />

<br/>
<a href="https://iubat-staff-link-one.vercel.app/">
  <img src="https://img.shields.io/badge/Live%20Website-Visit%20Now-006F3C?style=for-the-badge&logo=vercel&logoColor=white" />
</a>
<a href="https://github.com/addin-alt/iubat-staff-link">
  <img src="https://img.shields.io/badge/GitHub-Repository-111111?style=for-the-badge&logo=github&logoColor=white" />
</a>
<img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
<img src="https://img.shields.io/badge/Version-1.0.0-C8102E?style=for-the-badge" />


</div>

## Project Overview

**IUBAT Staff Link** is a professional, colorful, animated, and responsive faculty and employee directory web application for **IUBAT — International University of Business Agriculture and Technology**.
The platform allows users to search staff and faculty members instantly, filter by department, view profile photos, copy email addresses, send mail, copy phone numbers, make calls, and read official IUBAT notices through an integrated notice feed.

## Live Website

<div align="center">

## 🌐 [Visit IUBAT Staff Link](https://iubat-staff-link-one.vercel.app/)

</div>
<img width="1469" height="760" alt="image" src="https://github.com/user-attachments/assets/3d25f5f9-d9fe-4da1-870c-2d7f122d8536" />


## 🌟 Key Features

<table>
<tr>
<td width="50%">

### 🔎 Smart Dynamic Search
- Real-time search while typing
- Search by name
- Search by department
- Search by designation
- Search by email
- Search by phone
- Search by room, extension, address, and responsibility

</td>
<td width="50%">

### 🏛 Department Filtering
- Department-wise filtering
- Academic and administrative separation
- Office and section-based browsing
- Reset filter option
- Clean structured directory navigation

</td>
</tr>

<tr>
<td width="50%">

### 👤 Staff Profile Cards
- Staff and faculty photos
- Name and designation
- Department information
- Qualification details
- Contact details
- Expandable full profile information

</td>
<td width="50%">

### 📢 Official Notice Feed
- IUBAT official notice integration
- Animated moving notice ticker
- Notice preview cards
- Clickable official notice links
- Vercel serverless API support

</td>
</tr>

<tr>
<td width="50%">

### 📧 Email Actions
- Copy email address
- Send email directly
- Mailto link integration
- Fast communication workflow

</td>
<td width="50%">

### 📞 Phone Actions
- Copy phone number
- Call button
- Tel link integration
- Mobile-friendly contact actions

</td>
</tr>
</table>

## 🎨 UI and Design Highlights

<div align="center">

<img src="https://img.shields.io/badge/UI-Official%20University%20Style-006F3C?style=for-the-badge" />
<img src="https://img.shields.io/badge/Design-Colorful%20%26%20Professional-B78628?style=for-the-badge" />
<img src="https://img.shields.io/badge/Animation-Smooth%20Dashboard%20Motion-C8102E?style=for-the-badge" />
<img src="https://img.shields.io/badge/Layout-Responsive%20Cards-333333?style=for-the-badge" />

</div>

The interface follows a professional university-style color system:

| Purpose | Color Style |
|---|---|
| Primary Theme | IUBAT Green |
| Highlight Accent | Gold / Bronze |
| Alert and Reset | Red / Maroon |
| Copy Buttons | Neutral Grey |
| Call Buttons | Green |
| Email Buttons | Green |

## Main Modules

~~~text
IUBAT Staff Link
│
├── Executive Dashboard Header
├── Official IUBAT Notice Feed
├── Dynamic Staff Search
├── Department Filter System
├── Staff Profile Cards
├── Staff Photo Integration
├── Email / Copy / Call Actions
├── Full Detail Expansion
└── Responsive User Interface
~~~

## 🛠 Tech Stack

<div align="center">

<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111111" />
<img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-App%20Logic-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111" />
<img src="https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
<img src="https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/GitHub-Version%20Control-181717?style=for-the-badge&logo=github&logoColor=white" />

</div>


## 📁 Project Structure

~~~text
iubat-staff-link/
│
├── api/
│   └── iubat-notices.js
│
├── public/
│   ├── iubat-logo.jpg
│   └── staff-photos/
│       ├── staff-0001.jpg
│       ├── staff-0002.jpg
│       └── ...
│
├── src/
│   ├── data/
│   │   ├── iubatStaffData.js
│   │   └── staffPhotoMap.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
~~~

---

## ⚙️ Installation and Setup

Clone the repository:
~~~bash
git clone https://github.com/addin-alt/iubat-staff-link.git
~~~

Go to the project folder:

~~~bash
cd iubat-staff-link
~~~

Install dependencies:

~~~bash
npm install
~~~

Start development server:

~~~bash
npm run dev
~~~

Build for production:

~~~bash
npm run build
~~~

## Vercel Deployment Settings

Use these settings on Vercel:

~~~text
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
~~~

## Future Improvements

- Admin dashboard for updating staff data
- Supabase or Firebase database integration
- Notice search and notice archive
- Advanced staff profile pages
- Staff update request form
- Dark mode
- Department analytics
- QR code profile sharing
- Multi-language support

## 👨‍💻 Author

<div align="center">

### Developed by **Addin Alt**

<a href="https://github.com/addin-alt">
  <img src="https://img.shields.io/badge/GitHub-addin--alt-181717?style=for-the-badge&logo=github" />
</a>
<a href="https://linkedin.com/in/addin-alt-">
  <img src="https://img.shields.io/badge/LinkedIn-Addin%20Alt-0A66C2?style=for-the-badge&logo=linkedin" />
</a>
<a href="https://facebook.com/addin.alt">
  <img src="https://img.shields.io/badge/Facebook-addin.alt-1877F2?style=for-the-badge&logo=facebook&logoColor=white" />
</a>
<a href="https://www.instagram.com/addin_alt/">
  <img src="https://img.shields.io/badge/Instagram-addin__alt-E4405F?style=for-the-badge&logo=instagram&logoColor=white" />
</a>

</div>



## ⭐ Support

If this project is useful, give it a star on GitHub.

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:C8102E,40:B78628,100:006F3C&height=130&section=footer" />

</div>
