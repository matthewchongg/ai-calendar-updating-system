# 📅 Calendar Updating System — AI Academic Assistant

An intelligent **Google Workspace Add-on** designed for university students to automatically parse academic emails (Canvas, Moodle, university notifications) and sync assignment deadlines and class updates directly into Google Calendar using the **Gemini 3.5 Flash-lite** API.

---

## ✨ Features

- 🧠 **Multi-Model Gemini Parsing:** Uses `gemini-3.5-flash-lite` (with fallback protection) to extract exact dates, times, and course codes.
- 🔄 **Intelligent Rescheduling:** Detects class updates or time changes within a 24-hour window and updates existing calendar events in-place instead of creating duplicates.
- 🎯 **Separated Dashboard:** View recent `[COURSEWORK]` deadlines and `[CLASSUPDATES]` event entries in clean, split sections.
- ⚙️ **Customizable Onboarding Wizard:** 3-step setup to configure your Gemini API key, sender email filters (supporting multiple comma-separated addresses), and target export sub-calendar.
- ⏱️ **Automated Background Sync:** Automatically runs on a 1-hour time-driven trigger.

---

# 🚀 Setup & Installation Guide

## Prerequisites
1. A **Google Account** (Gmail or University Workspace).
2. A free **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/api-keys).

<img src="https://github.com/user-attachments/assets/201e66bf-95d0-4957-9d63-a6fc1560ced9" alt="Google AI Studio API Key" width="700" />

---

## Installation Steps

1. Open the **Google Apps Script Editor** at [script.google.com](https://script.google.com/).
2. Create a new project named **Calendar Sync**.
3. Copy the contents of [`Code.gs`](./Code.gs) into your script editor into the file named `Code.gs`.
4. Hover over the gear icon (⚙️) on the left sidebar and click on **Project Settings**.

<img src="https://github.com/user-attachments/assets/be236208-865a-4ee9-94b0-84fb3901d2a3" alt="Project Settings Gear Icon" width="700" />

5. Under General Settings, tick the box beside **"Show 'appsscript.json' manifest file in editor"**.

<img src="https://github.com/user-attachments/assets/46a4347a-f63d-40b0-a4ad-71c01b043c9d" alt="Show manifest file option" width="700" />

6. Hover over the sidebar again and return to the editor.
7. Copy the contents of [`appsscript.json`](./appsscript.json) into the `appsscript.json` manifest file.
8. Click **Run** $\rightarrow$ `onHomepage` to authorize the required permissions.

<img src="https://github.com/user-attachments/assets/cc640d63-0a2d-46d2-9884-8dafc155b684" alt="Run onHomepage function" width="700" />

9. Click on **Show Advanced** then **Go to Calendar Sync (Unsafe)**, then authorize all permissions.

<img src="https://github.com/user-attachments/assets/93600e32-1b45-49a3-bf6a-b15bef613622" alt="Authorize permissions" width="700" />

10. Return to the Apps Script tab and click on **Deploy**, then **Test Deployment**, then **Install**.

<img src="https://github.com/user-attachments/assets/bc00a79a-b7c2-41e7-8cbc-22a42c9057e2" alt="Test Deployment and Install" width="700" />

---

## 📅 Finalizing Setup in Google Calendar

Now that you are done with the Apps Script side of things, open up Google Calendar and access the Add-on:

11. Open the sidebar add-on inside Google Calendar or Gmail, enter your Gemini API Key, then complete the 3-step wizard!

<img src="https://github.com/user-attachments/assets/de0bea7c-8c6b-48c3-94ea-78c0360ce203" alt="Calendar Sidebar Setup Wizard" width="700" />

---

## 🔒 Permissions & Security

This add-on requests the following scopes in `appsscript.json`:
- `gmail.readonly` & `gmail.modify`: To read unread coursework notifications and mark processed emails as read.
- `calendar`: To query existing events for duplicate prevention and create/update schedule entries.
- `script.external_request`: To securely send email content to Google's Gemini REST API.
- `script.scriptapp`: To automatically set up the 1-hour background auto-sync trigger.

---

## 🛠️ Built With

- **Google Apps Script** (V8 Runtime)
- **Google CardService** (UI Components)
- **Google Gemini REST API** (`generativelanguage.googleapis.com`)
