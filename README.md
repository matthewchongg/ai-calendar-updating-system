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

## 🚀 Setup & Installation Guide

### Prerequisites
1. A **Google Account** (Gmail or University Workspace).
2. A free **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/api-keys).

### Installation Steps
1. Open the **Google Apps Script Editor** at [script.google.com](https://script.google.com/).
2. Create a new project named **Calendar Sync**.
3. In **Project Settings** (⚙️), check **"Show 'appsscript.json' manifest file in editor"**.
4. Copy the contents of [`Code.gs`](./Code.gs) into your script editor.
5. Copy the contents of [`appsscript.json`](./appsscript.json) into the manifest file.
6. Click **Run** $\rightarrow$ `onHomepage` to authorize the required permissions.
7. Open the sidebar add-on inside Google Calendar or Gmail, complete the 3-step setup wizard, and enter your Gemini API Key!

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
